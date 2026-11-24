// Run with `npm test` (Node's built-in test runner; no extra dependencies).
import assert from "node:assert/strict"
import { describe, test } from "node:test"

import {
  countByStatus,
  DEFAULT_QUERY,
  isSortOption,
  isStatusFilter,
  projects,
  queryProjects,
  type Project,
} from "./projects.ts"

const ids = (list: Project[]) => list.map((p) => p.id)

describe("search", () => {
  test("empty or whitespace search returns every project", () => {
    assert.equal(queryProjects(projects, DEFAULT_QUERY).length, projects.length)
    assert.equal(
      queryProjects(projects, { ...DEFAULT_QUERY, search: "   " }).length,
      projects.length,
    )
  })

  test("matches project name, case-insensitively", () => {
    const result = queryProjects(projects, { ...DEFAULT_QUERY, search: "BILLING" })
    assert.deepEqual(ids(result), ["PRJ-1025"])
  })

  test("matches client name", () => {
    const result = queryProjects(projects, {
      ...DEFAULT_QUERY,
      search: "northwind",
      sort: "name-asc",
    })
    assert.deepEqual(ids(result), ["PRJ-1024", "PRJ-1032"])
  })

  test("matches owner name", () => {
    const result = queryProjects(projects, { ...DEFAULT_QUERY, search: "grace okafor" })
    assert.ok(result.length > 0)
    assert.ok(result.every((p) => p.owner === "Grace Okafor"))
  })

  test("matches project ID", () => {
    assert.deepEqual(
      ids(queryProjects(projects, { ...DEFAULT_QUERY, search: "prj-1031" })),
      ["PRJ-1031"],
    )
  })

  test("no match returns an empty list", () => {
    assert.deepEqual(
      queryProjects(projects, { ...DEFAULT_QUERY, search: "zzz-no-match" }),
      [],
    )
  })
})

describe("status filter", () => {
  for (const status of ["active", "completed", "pending", "delayed"] as const) {
    test(`"${status}" keeps only ${status} projects`, () => {
      const result = queryProjects(projects, { ...DEFAULT_QUERY, status })
      assert.ok(result.length > 0, "dummy data should cover every status")
      assert.ok(result.every((p) => p.status === status))
      assert.equal(result.length, projects.filter((p) => p.status === status).length)
    })
  }

  test("combines with search", () => {
    const result = queryProjects(projects, {
      ...DEFAULT_QUERY,
      search: "kestrel",
      status: "completed",
    })
    assert.deepEqual(ids(result), ["PRJ-1031"])
  })

  test("counts respect the search and add up to the total", () => {
    const all = countByStatus(projects, "")
    assert.equal(all.all, projects.length)
    assert.equal(all.active + all.completed + all.pending + all.delayed, all.all)

    const kestrel = countByStatus(projects, "kestrel")
    assert.deepEqual(kestrel, { all: 2, active: 0, completed: 1, pending: 0, delayed: 1 })
  })
})

describe("sort", () => {
  test("due date ascending and descending", () => {
    const asc = queryProjects(projects, { ...DEFAULT_QUERY, sort: "due-asc" })
    const desc = queryProjects(projects, { ...DEFAULT_QUERY, sort: "due-desc" })
    for (let i = 1; i < asc.length; i++) {
      assert.ok(asc[i - 1].dueDate <= asc[i].dueDate)
      assert.ok(desc[i - 1].dueDate >= desc[i].dueDate)
    }
  })

  test("name A–Z and Z–A are reverses of each other", () => {
    const az = ids(queryProjects(projects, { ...DEFAULT_QUERY, sort: "name-asc" }))
    const za = ids(queryProjects(projects, { ...DEFAULT_QUERY, sort: "name-desc" }))
    assert.deepEqual(za, [...az].reverse())
    assert.equal(az[0], "PRJ-1035") // "Admin Console Accessibility"
  })

  test("progress and budget sort high to low", () => {
    const byProgress = queryProjects(projects, { ...DEFAULT_QUERY, sort: "progress-desc" })
    const byBudget = queryProjects(projects, { ...DEFAULT_QUERY, sort: "budget-desc" })
    for (let i = 1; i < projects.length; i++) {
      assert.ok(byProgress[i - 1].progress >= byProgress[i].progress)
      assert.ok(byBudget[i - 1].budget >= byBudget[i].budget)
    }
    assert.equal(byBudget[0].id, "PRJ-1027")
  })

  test("does not mutate the source list", () => {
    const before = ids(projects)
    queryProjects(projects, { ...DEFAULT_QUERY, sort: "name-desc" })
    assert.deepEqual(ids(projects), before)
  })
})

describe("guards", () => {
  test("isSortOption / isStatusFilter reject unknown values", () => {
    assert.ok(isSortOption("budget-desc"))
    assert.ok(!isSortOption("random"))
    assert.ok(isStatusFilter("all"))
    assert.ok(isStatusFilter("delayed"))
    assert.ok(!isStatusFilter("archived"))
  })
})
