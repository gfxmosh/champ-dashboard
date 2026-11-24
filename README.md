# champ-dashboard
SaaS

## Checks

```bash
npm run typecheck   # route types + tsc
npm run lint        # eslint
npm test            # unit tests (Node's built-in test runner, no extra deps)
npm run build       # production build
```

### Browser tests

`e2e/projects.e2e.mjs` drives a headless Chrome over the DevTools Protocol to
test the Projects screen end to end (navigation, search, status filters, sort,
detail dialog, console errors). It needs no npm packages, only a local
Chrome/Chromium, and the app must already be running:

```bash
npm run dev                                   # or: npm run build && npm start
npm run test:e2e                              # tests http://localhost:3000
BASE_URL=http://localhost:3124 npm run test:e2e
CHROME_PATH=/path/to/chrome npm run test:e2e  # if Chrome isn't auto-detected
```
