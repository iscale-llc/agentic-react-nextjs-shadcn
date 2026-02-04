# Agentic React + shadcn/ui

A GitHub template for building agent-testable SaaS apps. Standard Next.js 16 + shadcn/ui + Neon Postgres — nothing forked or patched. The value-add is architecture patterns + a test harness that lets AI agents (via [agent-browser](https://github.com/vercel/agent-browser)) navigate and test your app using the accessibility tree alone.

Use this as a **starting point for greenfield projects**, then delete the demo pages and build your own features. All dependencies are standard npm packages — `pnpm update` works like any Next.js app.

## Stack

- **Framework**: Next.js 16 App Router + TypeScript strict + Tailwind v4
- **UI**: shadcn/ui (Radix primitives)
- **Database**: Neon Postgres + Drizzle ORM
- **Auth**: NextAuth v5 (credentials provider)
- **Testing**: Vitest + agent-browser (e2e)
- **Linting**: ESLint with jsx-a11y strict mode (30 a11y rules at error level)

## Use as Template

### Option A: GitHub UI

1. Click **"Use this template"** → **"Create a new repository"** on GitHub
2. Clone your new repo and set up:

```bash
git clone https://github.com/your-org/your-new-app.git
cd your-new-app
pnpm install
cp .env.example .env.local   # fill in your values
pnpm db:push
pnpm db:seed
pnpm dev
```

### Option B: CLI

```bash
gh repo create my-saas-app --template your-username/agentic-react-nextjs-shadcn --private --clone
cd my-saas-app
pnpm install
cp .env.example .env.local
```

### What to keep vs delete

| Keep | Delete |
|------|--------|
| `src/app/dashboard/layout.tsx` (nav shell) | Demo pages you don't need (`sheets/`, `activity/`, `analytics/`) |
| `src/components/agent-wrappers/` | `src/lib/mock-data/` |
| `src/components/ui/` (shadcn) | `src/lib/spreadsheet-engine.ts` |
| `tests/e2e/helpers/` (test harness) | `src/app/api/auth/test-login/` (**security — delete before prod**) |
| `src/db/`, `src/lib/auth.ts` | `test-report.md` |
| ESLint jsx-a11y config | Demo contract tests (write your own) |
| `src/lib/traps.ts` (optional, for dev) | |

### Before deploying to production

1. **Delete `/api/auth/test-login/`** — passwordless auth bypass, not for production
2. Set `NEXT_PUBLIC_TRAPS_ENABLED=false` (or delete `src/lib/traps.ts` + all `if (trapsEnabled)` branches)
3. Don't set `NEXT_PUBLIC_TEST_MODE=true` in production
4. Replace mock data with real DB queries
5. Review/restore middleware for route protection

## Quick Start (demo)

```bash
pnpm install
cp .env.example .env.local    # fill in your Neon DATABASE_URL + NEXTAUTH_SECRET
pnpm db:push
pnpm db:seed
pnpm dev                       # http://localhost:3000
```

### Required Environment Variables

```
DATABASE_URL=                  # Neon connection string
NEXTAUTH_SECRET=               # any random string
NEXTAUTH_URL=                  # http://localhost:3000
NEXT_PUBLIC_TEST_MODE=         # "true" to enable test helpers
NEXT_PUBLIC_TRAPS_ENABLED=     # "true" (default) to enable a11y traps
```

### Test Login

Any seeded user email works (no password required in dev):

```
admin@test.com
manager@test.com
member1@test.com
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint with jsx-a11y strict |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | agent-browser e2e tests |
| `pnpm db:push` | Push Drizzle schema |
| `pnpm db:seed` | Seed test data |
| `pnpm db:studio` | Drizzle Studio |

## Architecture

### Server-First React

Pages are React Server Components. Only interactive bits (`'use client'`) are client islands. Agents see full page structure immediately — no loading spinners blocking content.

### Agent Wrappers

Thin components in `src/components/agent-wrappers/` that add ARIA attributes shadcn/TanStack don't provide by default:

| Wrapper | What it adds |
|---------|-------------|
| `DataTable` | `aria-sort` on headers, `aria-busy` during mutations, `aria-live` on tbody, keyboard nav |
| `Pagination` | `aria-current="page"`, per-page labels |
| `Breadcrumb` | `<nav aria-label="Breadcrumb">` with `aria-current` |
| `Loading` | `role="status"` + `aria-label="Loading {context}"` |
| `ErrorDisplay` | `role="alert"` with optional reset |
| `IconButton` | TypeScript-enforced `aria-label` |
| `SearchableSelect` | Combobox with hidden input for form submission |

### Semantic Contract (7 Rules)

1. Clickable → `<button>` or `<a>`, never `<div onClick>`
2. Every form input has `<Label>` or `aria-label`
3. Icon-only buttons require `aria-label`
4. Tables: `aria-label`, `aria-sort` on sortable headers
5. Loading: `role="status"` + descriptive `aria-label`
6. Errors: `role="alert"` with visible text
7. Dynamic regions: `aria-live="polite"`

Rules 1-3 enforced by ESLint jsx-a11y strict mode. Rules 4-7 enforced by agent-browser contract tests.

### Accessibility Traps

14 intentional a11y traps across Sheets and Settings pages, controlled by `NEXT_PUBLIC_TRAPS_ENABLED`. Each component has two render paths: a visually-identical but semantically broken version (trap ON) and a fully accessible version (trap OFF). Use traps during development to validate that your tests catch real a11y issues, not just visual presence. See [CHANGELOG.md](CHANGELOG.md) for the full trap inventory.

### Dual-Layer Test Framework

Every contract test checks BOTH:
- **Visual layer**: content renders, text visible, correct character count
- **Semantic layer**: proper ARIA roles, attributes, keyboard accessibility

With traps ON, the semantic layer fails while the visual layer passes — proving that visual-only tests produce false positives. With traps OFF, both pass. Helpers in `tests/e2e/helpers/semantic-assertions.ts`.

### Hydration Signal

`HydrationSignal` component sets `data-hydrated="true"` on `<html>` after React hydrates. Also intercepts `console.error` to capture hydration mismatches into `data-hydration-errors` attr and a hidden `role="log"` element. Agent tests call `waitForHydration()` before interacting.

### Test Mode

When `NEXT_PUBLIC_TEST_MODE=true`:
- All CSS animations/transitions disabled (0s duration)
- Toast duration extended to 10s
- Test-login API route enabled

## Project Structure

```
src/
  app/
    layout.tsx                    # RSC shell + HydrationSignal + Toaster
    login/                        # Auth page
    dashboard/
      layout.tsx                  # Sidebar, nav, header landmarks
      page.tsx                    # Stats + recent activity
      users/                      # Full CRUD with agent wrappers
      sheets/                     # Spreadsheet (traps #22-28)
      settings/                   # Settings page (6 traps)
      analytics/                  # Charts + metric cards
      activity/                   # Filterable activity log
  components/
    agent-wrappers/               # ARIA-enriched wrappers
    ui/                           # shadcn/ui (don't modify)
    hydration-signal.tsx
  db/
    schema.ts                     # Drizzle schema
    index.ts                      # Neon connection
  lib/
    actions/                      # Server actions
    queries/                      # Server-side data fetching
    validations/                  # Shared zod schemas
    auth.ts                       # NextAuth config
    traps.ts                      # Trap toggle (env-controlled)
    mock-data/                    # Demo data for sheets/analytics/activity
    spreadsheet-engine.ts         # SUM/AVG formula engine
tests/
  e2e/
    contracts/                    # Semantic contract tests (dual-layer)
      table-a11y.test.ts          # Users table
      sheets-a11y.test.ts         # Spreadsheet (19 tests)
      settings-a11y.test.ts       # Settings (11 tests)
      cross-page-a11y.test.ts     # Nav, landmarks, headings (10 tests)
      loading-states.test.ts
      error-states.test.ts
    flows/                        # User flow tests
      users-crud.test.ts
      auth.test.ts
    helpers/
      agent-browser.ts            # CLI wrapper
      semantic-assertions.ts      # Dual-layer assertion helpers
```

## Agent-Browser Testing

```bash
# Install agent-browser
npm install -g agent-browser
agent-browser install

# Open page and get accessibility snapshot
agent-browser open http://localhost:3000/dashboard/users
agent-browser snapshot

# Interact
agent-browser fill @e3 "john"          # search
agent-browser click @e5                 # click button by ref
agent-browser screenshot /tmp/test.png  # visual check
agent-browser close
```

### Running e2e tests

```bash
# Traps ON (default) — semantic tests should FAIL, proving they catch issues
TEST_BASE_URL=http://localhost:3000 pnpm test:e2e

# Traps OFF — all tests should PASS
NEXT_PUBLIC_TRAPS_ENABLED=false pnpm dev &
TEST_BASE_URL=http://localhost:3000 pnpm test:e2e
```

## Not a fork

This template uses **standard npm packages** — `next`, `react`, `radix-ui`, `tailwindcss`. Nothing is forked or monkey-patched. The agent-testability comes from application-level patterns (semantic HTML, ARIA contracts, test helpers), not framework modifications. Security patches to Next.js, React, or any dependency work via normal `pnpm update`.

## License

MIT
