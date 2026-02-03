# Agentic React + shadcn/ui

Agent-testable SaaS dashboard built with Next.js 16, shadcn/ui, and Neon Postgres. Designed so AI agents (via [agent-browser](https://github.com/vercel/agent-browser)) can navigate, interact, and test the app using the accessibility tree alone.

## Stack

- **Framework**: Next.js 16 App Router + TypeScript strict + Tailwind v4
- **UI**: shadcn/ui (Radix primitives)
- **Database**: Neon Postgres + Drizzle ORM
- **Auth**: NextAuth v5 (credentials provider)
- **Testing**: Vitest + agent-browser (e2e)

## Quick Start

```bash
pnpm install
cp ~/.config/templates/.env.local .    # or create .env.local manually
pnpm db:push                           # push schema to Neon
pnpm db:seed                           # seed 10 test users
pnpm dev                               # http://localhost:3000
```

### Required Environment Variables

```
DATABASE_URL=            # Neon connection string
NEXTAUTH_SECRET=         # any random string
NEXTAUTH_URL=            # http://localhost:3000
NEXT_PUBLIC_TEST_MODE=   # "true" to enable test helpers
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
      users/
        page.tsx                  # RSC data fetch → client islands
        _components/
          users-table.tsx         # DataTable + delete confirm + pagination
          users-filters.tsx       # Search + role/status dropdowns
          create-user-dialog.tsx  # Create form in dialog
          edit-user-form.tsx      # Edit form in dialog
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
tests/
  e2e/
    contracts/                    # Semantic contract tests
    flows/                        # User flow tests
    helpers/agent-browser.ts      # CLI wrapper
```

## Agent-Browser Testing

```bash
# Open page and get accessibility snapshot
agent-browser open http://localhost:3000/dashboard/users
agent-browser snapshot

# Interact
agent-browser fill @e3 "john"          # search
agent-browser click @e5                 # click button by ref
agent-browser screenshot /tmp/test.png  # visual check
agent-browser close
```

The e2e tests run via Vitest, shelling out to agent-browser and asserting on snapshot output. See `tests/e2e/helpers/agent-browser.ts` for the wrapper.

## License

MIT
