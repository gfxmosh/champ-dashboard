// Browser functional tests for the Projects screen (/dashboard/projects),
// driven over the Chrome DevTools Protocol with real mouse and keyboard input.
// No npm dependencies: Node's built-in fetch + WebSocket and a local Chrome.
//
// The app must already be running, e.g. `npm run dev` or `npm run build && npm start`.
//
//   npm run test:e2e                                  # http://localhost:3000
//   BASE_URL=http://localhost:3124 npm run test:e2e   # another server
//   CHROME_PATH=/path/to/chrome npm run test:e2e      # non-standard Chrome
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
]

function findChrome() {
  const found = [process.env.CHROME_PATH, ...CHROME_CANDIDATES].find(
    (p) => p && existsSync(p),
  )
  if (!found) {
    throw new Error("Chrome not found. Set CHROME_PATH to a Chrome/Chromium binary.")
  }
  return found
}

async function launchChrome() {
  const profile = await mkdtemp(join(tmpdir(), "champ-e2e-"))
  const proc = spawn(
    findChrome(),
    [
      "--headless=new",
      "--remote-debugging-port=0", // let Chrome pick a free port
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-gpu",
      "about:blank",
    ],
    { stdio: "ignore" },
  )
  const exited = new Promise((resolve) => proc.once("exit", resolve))
  const cleanup = async () => {
    if (proc.exitCode === null && proc.signalCode === null) proc.kill()
    // Wait for Chrome to exit so it isn't still writing to the profile we delete.
    await Promise.race([exited, sleep(5000)])
    await rm(profile, { recursive: true, force: true }).catch(() => {})
  }
  // Chrome writes the chosen port to DevToolsActivePort in the profile dir.
  for (let i = 0; i < 100; i++) {
    try {
      const [port] = (await readFile(join(profile, "DevToolsActivePort"), "utf8")).split("\n")
      if (port) return { port, cleanup }
    } catch {
      // not written yet
    }
    await sleep(100)
  }
  await cleanup()
  throw new Error("Chrome did not start (no DevToolsActivePort).")
}

const results = []
const consoleErrors = []
let ws
let msgId = 0
const pending = new Map()

function send(method, params = {}) {
  const id = ++msgId
  ws.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id)
        reject(new Error(`CDP timeout: ${method}`))
      }
    }, 15000)
  })
}

async function evaluate(expression) {
  const r = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + " :: " + expression)
  return r.result.value
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitFor(expression, label, timeout = 6000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return
    await sleep(50)
  }
  throw new Error(`waitFor timed out: ${label}`)
}

/** Wait until no finite CSS/Web animations are running (e.g. dialog zoom-in). */
async function settle(timeout = 2000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const running = await evaluate(
      `document.getAnimations().filter(a => a.playState === "running" && a.effect?.getComputedTiming().iterations !== Infinity).length`,
    )
    if (running === 0) return
    await sleep(50)
  }
}

async function clickAt(selectorExpr, label) {
  // Measure only after animations finish, or the click can land off-target.
  await settle()
  const rect = await evaluate(`(() => {
    const el = ${selectorExpr};
    if (!el) return null;
    el.scrollIntoView({ block: "center" });
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  })()`)
  if (!rect) throw new Error(`clickAt: element not found: ${label}`)
  const base = { x: rect.x, y: rect.y, button: "left", clickCount: 1 }
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: rect.x, y: rect.y })
  await send("Input.dispatchMouseEvent", { type: "mousePressed", ...base })
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", ...base })
}

async function key(keyName, code, keyCode) {
  const text = keyName === "Enter" ? "\r" : undefined
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: keyName, code, windowsVirtualKeyCode: keyCode, text })
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: keyName, code, windowsVirtualKeyCode: keyCode })
}

const q = (sel) => `document.querySelector(${JSON.stringify(sel)})`
const rowIds = `[...document.querySelectorAll('[data-project-id]')].map(r => r.dataset.projectId)`
const rowStatuses = `[...document.querySelectorAll('[data-project-id] [data-status]')].map(b => b.dataset.status)`
const firstRowName = `document.querySelector('[data-project-id] button')?.textContent`
const resultText = `${q('[data-testid="result-count"]')}?.textContent`

async function check(name, fn) {
  try {
    await fn()
    results.push({ name, ok: true })
  } catch (err) {
    results.push({ name, ok: false, err: err.message })
  }
}

function assertEq(actual, expected, what) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a !== e) throw new Error(`${what}: expected ${e}, got ${a}`)
}

async function typeSearch(text) {
  // Clear via the native value setter so React sees the change, then type for real.
  await clickAt(q('[data-testid="project-search"]'), "search input")
  await evaluate(`(() => {
    const el = ${q('[data-testid="project-search"]')};
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    set.call(el, ""); el.dispatchEvent(new Event("input", { bubbles: true }));
  })()`)
  if (text) await send("Input.insertText", { text })
  await sleep(150)
}

async function chooseSort(label) {
  await clickAt(q('[data-testid="project-sort"]'), "sort trigger")
  await waitFor(`document.querySelector('[role="listbox"]')`, "sort listbox open")
  await clickAt(
    `[...document.querySelectorAll('[role="option"]')].find(o => o.textContent.trim() === ${JSON.stringify(label)})`,
    `option ${label}`,
  )
  await waitFor(`!document.querySelector('[role="listbox"]')`, "sort listbox closed")
  await waitFor(`${q('[data-testid="project-sort"]')}.textContent.includes(${JSON.stringify(label)})`, "sort label updated")
}

async function main() {
  try {
    await fetch(`${BASE}/dashboard/projects`)
  } catch {
    throw new Error(`App not reachable at ${BASE}. Start it first (npm run dev).`)
  }
  const chrome = await launchChrome()
  try {
    return await run(chrome.port)
  } finally {
    ws?.close()
    await chrome.cleanup()
  }
}

async function run(PORT) {
  const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json()
  ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j })
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) reject(new Error(msg.error.message))
      else resolve(msg.result)
    } else if (msg.method === "Runtime.exceptionThrown") {
      consoleErrors.push("exception: " + msg.params.exceptionDetails.exception?.description)
    } else if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      consoleErrors.push("console.error: " + msg.params.args.map((a) => a.value ?? a.description).join(" "))
    }
  }
  await send("Runtime.enable")
  await send("Page.enable")
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

  // --- Navigation -----------------------------------------------------------
  await send("Page.navigate", { url: `${BASE}/dashboard` })
  await waitFor(`document.readyState === "complete" && ${q('a[href="/dashboard/projects"]')}`, "dashboard loaded")
  await sleep(300) // hydration

  await check("sidebar has a Projects link", async () => {
    assertEq(await evaluate(`${q('a[href="/dashboard/projects"]')}.textContent.trim()`), "Projects", "link text")
  })

  await check("clicking Projects navigates, marks nav active, updates breadcrumb", async () => {
    await clickAt(q('a[href="/dashboard/projects"]'), "Projects nav link")
    await waitFor(`location.pathname === "/dashboard/projects" && ${q('[data-testid="projects-table"]')}`, "projects page")
    assertEq(await evaluate(`${q('a[href="/dashboard/projects"]')}.dataset.active`), "true", "Projects data-active")
    assertEq(await evaluate(`${q('[data-sidebar="menu-button"][href="/dashboard"]')}?.dataset.active`), "false", "Overview data-active")
    assertEq(await evaluate(`${q('[data-slot="breadcrumb-page"]')}.textContent`), "Projects", "breadcrumb")
    assertEq(await evaluate(`document.title`), "Projects · Champ Dashboard", "document title")
  })

  await check("initial state: 12 rows, sorted by due date (soonest)", async () => {
    assertEq(await evaluate(`${rowIds}.length`), 12, "row count")
    assertEq(await evaluate(resultText), "Showing 12 of 12 projects", "result text")
    assertEq(await evaluate(firstRowName), "Onboarding Analytics", "first row (due 2026-06-30)")
    assertEq(await evaluate(`${q('[data-testid="clear-filters"]')} === null`), true, "no clear button when unfiltered")
  })

  // --- Search ---------------------------------------------------------------
  await check("search by client name (case-insensitive)", async () => {
    await typeSearch("NorthWind")
    assertEq(await evaluate(rowIds), ["PRJ-1024", "PRJ-1032"], "rows")
    assertEq(await evaluate(resultText), "Showing 2 of 12 projects", "result text")
  })

  await check("search by project name", async () => {
    await typeSearch("billing")
    assertEq(await evaluate(rowIds), ["PRJ-1025"], "rows")
  })

  await check("search by owner", async () => {
    await typeSearch("grace")
    const ids = await evaluate(rowIds)
    assertEq(ids.slice().sort(), ["PRJ-1028", "PRJ-1034"], "rows (owner only, not team)")
  })

  await check("search by project ID", async () => {
    await typeSearch("prj-1031")
    assertEq(await evaluate(rowIds), ["PRJ-1031"], "rows")
  })

  await check("status chip counts follow the search", async () => {
    await typeSearch("kestrel")
    const counts = await evaluate(`["all","active","completed","pending","delayed"].map(s => ${'`'}${'$'}{s}:${'$'}{document.querySelector('[data-testid="status-' + s + '"]').textContent.match(/\\d+$/)[0]}${'`'})`)
    assertEq(counts, ["all:2", "active:0", "completed:1", "pending:0", "delayed:1"], "chip counts")
  })

  await check("no matches shows empty state; its Clear filters restores rows", async () => {
    await typeSearch("zzz-no-match")
    await waitFor(`document.body.textContent.includes("No projects found")`, "empty state")
    assertEq(await evaluate(`${q('[data-testid="projects-table"]')} === null`), true, "table hidden")
    await clickAt(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === "Clear filters" && !b.dataset.testid)`, "empty-state clear")
    await waitFor(`${rowIds}.length === 12`, "rows restored")
    assertEq(await evaluate(`${q('[data-testid="project-search"]')}.value`), "", "search cleared")
  })

  // --- Status filter ---------------------------------------------------------
  const expectedByStatus = { active: 4, completed: 3, pending: 3, delayed: 2 }
  for (const [status, n] of Object.entries(expectedByStatus)) {
    await check(`status filter "${status}" shows only ${status} (${n})`, async () => {
      await clickAt(q(`[data-testid="status-${status}"]`), `chip ${status}`)
      await waitFor(`${q(`[data-testid="status-${status}"]`)}.dataset.state === "on"`, "chip pressed")
      const statuses = await evaluate(rowStatuses)
      assertEq(statuses.length, n, "row count")
      assertEq(statuses.every((s) => s === status), true, "all rows match")
    })
  }

  await check("clicking the selected chip again keeps it selected", async () => {
    await clickAt(q('[data-testid="status-delayed"]'), "chip delayed again")
    await sleep(150)
    assertEq(await evaluate(`${q('[data-testid="status-delayed"]')}.dataset.state`), "on", "still on")
    assertEq(await evaluate(`${rowIds}.length`), 2, "rows unchanged")
  })

  await check("search + status combine", async () => {
    await clickAt(q('[data-testid="status-completed"]'), "chip completed")
    await typeSearch("kestrel")
    assertEq(await evaluate(rowIds), ["PRJ-1031"], "rows")
  })

  await check("toolbar Clear filters resets search and status", async () => {
    await clickAt(q('[data-testid="clear-filters"]'), "clear filters")
    await waitFor(`${rowIds}.length === 12`, "rows restored")
    assertEq(await evaluate(`${q('[data-testid="status-all"]')}.dataset.state`), "on", "All chip on")
    assertEq(await evaluate(`${q('[data-testid="project-search"]')}.value`), "", "search cleared")
  })

  // --- Sort ---------------------------------------------------------------------
  const sorts = [
    ["Name (A–Z)", "Admin Console Accessibility"],
    ["Name (Z–A)", "Usage-Based Pricing Pilot"],
    ["Budget (high–low)", "Mobile App MVP"],
    ["Progress (high–low)", "Onboarding Analytics"],
    ["Due date (latest)", "Mobile App MVP"],
    ["Due date (soonest)", "Onboarding Analytics"],
  ]
  for (const [label, first] of sorts) {
    await check(`sort "${label}" puts "${first}" first`, async () => {
      await chooseSort(label)
      assertEq(await evaluate(firstRowName), first, "first row")
    })
  }

  await check("sort is kept while filtering", async () => {
    await chooseSort("Name (A–Z)")
    await clickAt(q('[data-testid="status-active"]'), "chip active")
    await waitFor(`${rowIds}.length === 4`, "4 active")
    const names = await evaluate(`[...document.querySelectorAll('[data-project-id] button')].map(b => b.textContent)`)
    assertEq(names, [...names].sort((a, b) => a.localeCompare(b)), "A–Z order")
    await clickAt(q('[data-testid="clear-filters"]'), "clear")
    await waitFor(`${rowIds}.length === 12`, "rows restored")
    assertEq(await evaluate(firstRowName), "Admin Console Accessibility", "sort survived clear")
  })

  // --- Detail dialog ------------------------------------------------------------
  await check("clicking a row opens the detail dialog with that project", async () => {
    // Click the Client cell, not the name button, to prove the whole row is clickable.
    await clickAt(`document.querySelector('[data-project-id="PRJ-1025"] td:nth-child(2)')`, "row PRJ-1025")
    await waitFor(`document.querySelector('[role="dialog"]')`, "dialog open")
    const text = await evaluate(`document.querySelector('[role="dialog"]').textContent`)
    for (const s of ["Billing Migration", "PRJ-1025", "Kestrel Freight", "Marcus Webb", "Delayed", "Milestones", "Tax provider integration", "$72,000"]) {
      if (!text.includes(s)) throw new Error(`dialog missing "${s}"`)
    }
    assertEq(await evaluate(`document.querySelector('[role="dialog"] [data-slot="dialog-title"]').textContent`), "Billing Migration", "title")
  })

  await check("Escape closes the dialog", async () => {
    await key("Escape", "Escape", 27)
    await waitFor(`!document.querySelector('[role="dialog"]')`, "dialog closed")
  })

  await check("keyboard: Enter on a project name opens its dialog; Close button closes", async () => {
    await evaluate(`document.querySelector('[data-project-id="PRJ-1030"] button').focus()`)
    await key("Enter", "Enter", 13)
    await waitFor(`document.querySelector('[role="dialog"]')?.textContent.includes("Support Chatbot")`, "dialog open via keyboard")
    await clickAt(`[...document.querySelectorAll('[role="dialog"] button')].find(b => b.textContent.trim() === "Close")`, "Close button")
    await waitFor(`!document.querySelector('[role="dialog"]')`, "dialog closed")
  })

  await check("no console errors or uncaught exceptions", async () => {
    if (consoleErrors.length) throw new Error(consoleErrors.join("\n"))
  })

  const failed = results.filter((r) => !r.ok)
  for (const r of results) console.log(`${r.ok ? "✔" : "✖"} ${r.name}${r.ok ? "" : `\n    ${r.err}`}`)
  console.log(`\n${results.length - failed.length}/${results.length} passed against ${BASE}`)
  return failed.length ? 1 : 0
}

main().then(
  (code) => {
    process.exitCode = code
  },
  (err) => {
    console.error(err instanceof Error ? err.message : err)
    process.exitCode = 2
  },
)
