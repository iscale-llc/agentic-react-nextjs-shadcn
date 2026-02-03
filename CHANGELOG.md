# Changelog

## 0.1.1 — 2026-02-03

Agent-friendliness improvements for reliable agent-browser testing.

### Test Mode
- `data-test-mode="true"` on `<html>` when `NEXT_PUBLIC_TEST_MODE=true`
- CSS kills all animations/transitions to 0s in test mode

### Delete Confirmation
- AlertDialog before delete — shows user name/email, requires explicit confirm
- Prevents accidental deletions during agent flows

### Results Status Region
- `<p role="status" aria-live="polite">` above table announces result count
- Agent-browser sees "Showing X–Y of Z users" after filter/sort/page

### Mutation Busy State
- `aria-busy="true"` on `<table>` during delete operations and page transitions
- `useTransition` tracks revalidation so `aria-busy` stays true until data settles
- Agent-browser `waitForIdle` now reliably waits for mutations + revalidation

### Empty State Semantics
- Empty table shows `<p role="status">No users found. Try adjusting your filters.</p>`
- Agent-browser sees `status` element instead of bare text

### Keyboard Navigation
- Arrow Up/Down, Home/End navigate table rows
- `tabIndex`, `aria-selected`, focus ring on active row
- Agents can navigate tables without mouse

## 0.1.0 — 2026-02-03

Initial implementation of agent-testable SaaS dashboard.

### Scaffold
- Next.js 16 App Router + TypeScript strict + Tailwind v4
- shadcn/ui (button, input, label, dialog, table, badge, card, select, dropdown-menu, separator, sheet, command, popover)
- ESLint with jsx-a11y strict mode (30 a11y rules at error level)

### Database
- Neon Postgres + Drizzle ORM
- `users` table: uuid PK, name, email, role enum, status enum, timestamps
- Seed script: 10 test users across all roles/statuses

### Auth
- NextAuth v5 (beta) with credentials provider
- Middleware gating `/dashboard` routes
- Test-login API route (`/api/auth/test-login`) for agent-browser e2e

### Agent Wrappers (`components/agent-wrappers/`)
- `DataTable` — TanStack Table + shadcn with `aria-sort`, `aria-busy`, `aria-live`, `<caption>`
- `SearchableSelect` — combobox with hidden input for form submission
- `Pagination` — `aria-current="page"`, per-page aria-labels
- `Breadcrumb` — `<nav aria-label="Breadcrumb">` with `aria-current`
- `Loading` — `role="status"` + `aria-label="Loading {context}"`
- `ErrorDisplay` — `role="alert"` with optional reset
- `IconButton` — TypeScript-enforced `aria-label`

### Hydration Signal
- Sets `data-hydrated="true"` on `<html>` after React hydration
- Intercepts `console.error` for hydration mismatch detection
- Surfaces errors in `data-hydration-errors` attr + hidden `role="log"` element
- Agent-browser helper: `assertNoHydrationErrors()`

### Layout
- RSC shell with semantic landmarks: `<aside>`, `<nav>`, `<header>`, `<main>`
- Sonner toasts (10s duration in test mode, `role="alert"` for errors)
- Error boundaries at root, dashboard, and users route levels

### Pages
- **Login** — accessible form with labels, credentials provider
- **Dashboard** — stat cards, recent users list
- **Users** — full CRUD:
  - Server-side search, filter (role/status), sort, pagination via URL params
  - Client search with 500ms debounce synced to URL
  - Create user dialog (Tier 2: server action form)
  - Edit user dialog (Tier 3: client submit)
  - Delete user (Tier 1: form + server action)
  - Shared zod validation (`lib/validations/user.ts`)

### Test Infrastructure
- agent-browser CLI helper with `waitForHydration`, `waitForContent`, `waitForIdle`, `assertNoHydrationErrors`
- Contract tests: table a11y, loading states, error states
- Flow tests: users CRUD, auth
- Vitest configs for unit + e2e

### CI
- GitHub Actions workflow: pnpm install, db push + seed, build + start, agent-browser e2e, screenshot upload on failure
