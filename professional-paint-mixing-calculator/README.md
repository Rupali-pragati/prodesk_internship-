# MixStation Pro — Paint Mixing Calculator

Professional paint mixing workbench built for hardware store floor staff. Replaces the
manual paper/Excel workflow with a digital tool: colorant dosing against base paints,
batch volume math with displacement, colourant-load safety checks, a persistent
formula library, printable batch tickets, and graceful behaviour on unreliable
store connections.

Built for the internal "Hardware Store" ticket. No customer PII is collected.

---

## Contents

1. [Features](#features)
2. [Tech Stack and Constraint Compliance](#tech-stack-and-constraint-compliance)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Design System](#design-system)
6. [Edge Case Handling (Unhappy Paths)](#edge-case-handling-unhappy-paths)
7. [Non-Functional Requirements](#non-functional-requirements)
8. [API Reference](#api-reference)
9. [Database](#database)
10. [Definition of Done](#definition-of-done)

---

## Features

- **Batch calculator** — select a base paint (White / Pastel / Deep / Clear), add up
  to 12 colourant rows with rates in ml per litre, and set the batch size in litres
  or US gallons.
- **Physically correct math** — the base volume is reduced by the total colourant
  volume, so the finished batch matches the requested size. Outputs include totals
  in ml and fl oz, colourant load percentage, and a load-vs-limit gauge per base.
- **Safety warnings** — dosing above a colourant's recommended maximum, or a load
  above the base's limit, raises explicit warnings. An impossible batch (colourants
  exceed the requested volume) is rejected with a clear explanation instead of
  crashing.
- **Batch ticket** — a numbered mixing procedure plus a full addition table, with a
  one-click print view for the dispensing bench.
- **Formula library** — 12 standard factory formulas are seeded on first run. Staff
  can save custom mixes, search by name, reload them into the calculator, and delete
  custom entries (standard formulas are protected server-side).
- **Offline resilience** — the connection state is shown live in the header. Saves
  made while offline are queued in `localStorage` and sync automatically when the
  connection returns; the queue depth is visible in the header.
- **Simulated telemetry** — primary actions log
  `[Analytics] User interacted with Paint Mixing Calculator` to the browser console.

## Tech Stack and Constraint Compliance

The TRD specifies React fundamentals. This platform runtime hosts the UI on
**Next.js (App Router)**; the engineering constraints from the TRD are honoured
exactly:

| TRD constraint | Implementation |
| --- | --- |
| `useState`, `useEffect`, prop drilling only | All state lives in `src/app/page.tsx` and is passed down via props. No context providers, no reducers. |
| No Redux or other state libraries | None installed. |
| No React Router | None. The tool is a single-screen application; navigation is file-based at the platform level only. |
| Data structured consistently | Typed domain models in `src/lib/mixing.ts` and `src/lib/formulas.ts`; server persists via Drizzle ORM into PostgreSQL. |
| Monochromatic corporate design system | One ink hue scale plus two functional status colours, defined once as tokens. See [Design System](#design-system). |
| 16px / 32px padding rhythm | Spacing uses a strict 4/8/16/32/48 step throughout. |
| No real API keys or PII | Zero secrets in source. The only environment variable is `DATABASE_URL`. |

Stack:

- **UI:** React 19, TypeScript, Tailwind CSS 4 (token-driven theme)
- **Server:** Next.js route handlers (typed JSON APIs)
- **Persistence:** PostgreSQL + Drizzle ORM (parameterised queries throughout)

## Getting Started

Prerequisites: Node.js 18+ (20+ recommended) and PostgreSQL 13+.

```bash
# 1. Install dependencies
npm install

# 2. Configure the database connection
#    .env already contains: DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
#    Adjust to match your environment if different.

# 3. Apply the database schema
npx drizzle-kit push

# 4. Run in development
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

The catalog (13 colourants, 4 bases) and 12 standard formulas are seeded
automatically and idempotently on the first API request — no manual seed step.

The app runs anywhere Node and PostgreSQL are available: a back-office server, a
Docker container, or any managed platform that exposes `DATABASE_URL`.

## Project Structure

```
src/
  app/
    api/
      health/route.ts            # liveness probe (DB round-trip)
      catalog/route.ts           # GET colourants + bases
      formulas/route.ts          # GET search / POST create
      formulas/[id]/route.ts     # DELETE custom formulas
    globals.css                  # design tokens + component primitives
    layout.tsx                   # document shell, fonts, skip link
    page.tsx                     # single-screen workbench (all state)
  components/
    Header.tsx  ConnectionBadge.tsx  Logo.tsx  Toast.tsx  icons.tsx
    BaseSelector.tsx  ColorantEditor.tsx  BatchPanel.tsx
    ResultsPanel.tsx  FormulaLibrary.tsx  SavePanel.tsx
  db/
    index.ts                     # Drizzle client (pg Pool)
    schema.ts                    # table definitions
    seed.ts                      # idempotent catalog + preset seed
  lib/
    mixing.ts                    # core mixing math, unit conversion, validation
    formulas.ts                  # API shapes + offline queue persistence
    sanitize.ts                  # XSS input sanitation
    analytics.ts                 # simulated telemetry
```

## Design System

Single-hue **ink** scale (steel/graphite) for the entire interface; **danger** and
**success** exist solely as functional status colours and are never decorative.
All colours live as Tailwind theme tokens in `src/app/globals.css` — components
only reference token names, so no rogue hex values can creep in.

| Token | Value | Role |
| --- | --- | --- |
| `ink-950` … `ink-50` | `#0e1826` → `#f4f7fa` | Surfaces, text, borders, controls |
| `danger-600` | `#b3261e` | Invalid fields, destructive actions, errors |
| `success-600` | `#1f6b44` | Confirmations, online status |
| `paper` | `#f2f5f8` | Ambient page backdrop with engineering grid |

Typography: **Archivo** (display/headings), **Instrument Sans** (UI/body),
**IBM Plex Mono** (numeric readouts, codes, metadata). System fallbacks are
defined so the UI degrades cleanly offline.

## Edge Case Handling (Unhappy Paths)

| Failure state | Behaviour |
| --- | --- |
| Empty search results | "No formulas match" panel with a clear-search action; never a blank screen. |
| Empty library / no calculation yet | Distinct empty-state panels with next-step guidance. |
| Slow / failed connections | Skeleton loaders for every async region; error banners with a Retry button; live Online/Offline badge driven by `navigator.onLine` events. |
| Offline writes | Saves are queued to `localStorage`, badge shows the queue depth, and queued items sync automatically on `online`. |
| Missing or malformed input | Submission is blocked; offending fields get red borders, red inline messages, `aria-invalid`, and focus-friendly descriptions. |
| Impossible batch | Colourant totals exceeding the batch volume produce a "Batch not possible" explanation, not a crash. |
| Duplicate colourant rows | Rejected client-side with a per-field message and again server-side. |
| Server validation errors | Field-specific messages (e.g. name too short) surface inline; state is never lost. |

## Non-Functional Requirements

- **Accessibility.** Semantic landmarks, a skip-to-content link, labelled controls
  (`label`/`htmlFor`, `fieldset`/`legend`), ARIA (`aria-live` status regions,
  `role="alert"` errors, `aria-invalid`, `aria-describedby` error links), visible
  keyboard focus rings on every interactive element, native radio groups for
  keyboard operation, `prefers-reduced-motion` support, and AA+ colour contrast
  across the token palette.
- **Telemetry simulation.** `src/lib/analytics.ts` logs
  `[Analytics] User interacted with Paint Mixing Calculator — <action>` with a
  structured payload on mix calculation, formula save/load/delete, queue sync, and
  reset. No network calls.
- **Security.** All free-text inputs (names, notes, search) pass through
  `sanitizeText()` **before** entering client state and again server-side before
  persistence. All SQL is parameterised via Drizzle. React escapes on render as a
  final layer. No secrets exist in the source tree.

## API Reference

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | DB liveness probe. |
| `GET` | `/api/catalog` | Colourant and base catalogs (auto-seeds). |
| `GET` | `/api/formulas?q=<term>` | Search formulas; returns items joined with colourant names. |
| `POST` | `/api/formulas` | Create a formula. Body: `{ name, baseCode, notes?, items: [{ colorantCode, mlPerLiter }] }`. Validates existence, duplicates, and rate bounds (0–600 ml/L). |
| `DELETE` | `/api/formulas/:id` | Delete a custom formula. Standard formulas return `403`. |

## Database

Four tables (`src/db/schema.ts`): `colorants`, `bases`, `formulas`,
`formula_items`. Rates are stored as ml of colourant per litre of finished batch.
Cascade delete keeps formula items consistent. Apply changes any time with
`npx drizzle-kit push`.

## Definition of Done

- [x] Code compiles and runs without fatal errors (`next build`, `tsc --noEmit`).
- [x] Lints clean (`npm run lint`), no unused imports.
- [x] Happy path: calculate a batch, save it, reload it, delete it.
- [x] Unhappy path: empty states, loading indicators, red-highlighted invalid
      inputs, offline queueing, impossible-batch rejection.
- [x] Accessibility: labelled/ARIA-wired controls, keyboard operable, reduced
      motion honoured.
- [x] Telemetry: `[Analytics] User interacted with Paint Mixing Calculator` on
      primary actions (verify in DevTools console).
- [x] No real API keys or PII anywhere in source.
