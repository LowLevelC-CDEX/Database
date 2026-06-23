# Site-80 "JACOBY" — Secure Database

A professional, SCP Foundation–inspired internal database web application for the
fictional facility **Site-80 "JACOBY."** It recreates the atmosphere, organization,
and usability of a classified government intelligence system while leaving **all lore
and SCP content as editable placeholders** for you to populate.

> This project intentionally ships **no copyrighted SCP Wiki content**. Every record is
> a placeholder you can edit through the admin interface.

---

## ✨ Features

- **Animated boot sequence** — terminal-style initialization, progress bar, blinking
  cursor, scanlines, and a particle field, fading into the login screen.
- **Hardened authentication** — password hashing (bcrypt), rate limiting, brute-force
  lockout, session expiration, secure cookies, CSRF protection (NextAuth), optional 2FA,
  admin approval before activation, and a password-reset flow.
- **Role-based access control** — 12 roles × 6 clearance levels, enforced in middleware,
  server components, and every API route. Includes a live permission matrix.
- **Security headers** — Content Security Policy, HSTS, `X-Frame-Options`,
  `X-Content-Type-Options`, Referrer-Policy, and Permissions-Policy via middleware.
- **Audit logging** — every authentication event and data mutation is recorded.
- **Modern dashboard** — announcements, recently updated files, personnel online,
  upcoming operations, favorites, security level, system status, quick links,
  database statistics, and recent activity widgets.
- **Collapsible sidebar** — icon navigation, permission-filtered, with all sections.
- **SCP database** — unlimited custom entries with a full editor (classification,
  assignment, narrative, gallery, addendums, recovery/experiment/incident logs, cross
  testing, history, tags) and automatic **revision history**.
- **Personnel, Departments, Factions** — rich profile/record pages with admin editors.
- **Content system** — Markdown-powered Rules, Documents, Research, and Training pages.
- **Operations & Incidents** — structured records with detail views.
- **Global search** — `⌘K` / `Ctrl+K` command palette across all record types, with filters.
- **Admin panel** — user management (approve, role/clearance/status), audit logs,
  permission matrix, content/SCP/personnel creation, and scaffolding for future modules.
- **Accessibility** — keyboard navigation, ARIA labels, focus states, skip link,
  reduced-motion support, responsive layouts.

---

## 🧱 Tech Stack

| Layer       | Technology                                      |
| ----------- | ----------------------------------------------- |
| Framework   | Next.js 14 (App Router) + TypeScript            |
| Styling     | Tailwind CSS, custom design tokens, glass UI    |
| Auth        | NextAuth (Credentials, JWT sessions)            |
| Database    | PostgreSQL + Prisma ORM                         |
| Validation  | Zod + React Hook Form                           |
| Animation   | Framer Motion                                   |
| Icons       | Lucide                                          |

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+ (tested on Node 22)
- A running PostgreSQL instance

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set at least:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/site80?schema=public"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
npm run db:push      # create tables from the Prisma schema (fast, dev-friendly)
# or
npm run db:migrate   # create a versioned migration (recommended for production)

npm run db:seed      # seed placeholder data + default accounts
```

See [Prisma Schema Guide](#-prisma-schema-guide) below for a full walkthrough of the data model.

### 5. Run

```bash
npm run dev       # development
# or
npm run build && npm run start   # production
```

Visit <http://localhost:3000>.

### Default accounts (created by the seed)

| Username     | Password         | Role                   |
| ------------ | ---------------- | ---------------------- |
| `admin`      | `ChangeMe!2026`  | Website Administrator  |
| `researcher` | `Research!2026`  | Researcher             |
| `pending`    | `Pending!2026`   | Personnel (awaiting approval) |

> **Change these immediately in any real deployment.**

---

## 📁 Project Structure

```
prisma/
  schema.prisma         # Full domain model (PostgreSQL)
  seed.ts               # Placeholder data + default users
src/
  app/
    (app)/              # Authenticated app (sidebar shell)
      dashboard/ scp/ personnel/ departments/ factions/
      operations/ incidents/ rules/ documents/ research/ training/
      security/ medical/ engineering/ containment/ maps/ applications/
      admin/            # Admin panel (users, logs, roles, editors)
      profile/ settings/ help/ announcements/
    api/                # REST endpoints (auth, scp, personnel, content, admin, search)
    login/ register/ forgot-password/ 403/  # Auth + error screens
  components/
    boot/               # Boot sequence, scanlines, particles
    auth/ layout/ dashboard/ admin/ content/ search/ settings/
    shared/ ui/         # Reusable primitives & shared display components
  config/navigation.ts  # Central nav map (icons + permissions)
  lib/
    auth.ts rbac.ts session.ts api.ts middleware helpers
    prisma.ts password.ts rate-limit.ts audit.ts validators.ts utils.ts
  middleware.ts         # Auth gate + security headers + CSP
```

---

## 🔐 Roles & Clearance

**Roles:** Guest · Personnel · Researcher · Security · Medical · Engineering ·
Containment Specialist · Department Director · Ethics Committee · O5 Administration ·
Developer · Website Administrator.

**Clearance:** Level 0 → Level 5 (Thaumiel).

Permissions are defined in `src/lib/rbac.ts` and visualized at `/admin/roles`.

---

## 🗄️ Prisma Schema Guide

This section walks you through `prisma/schema.prisma` — how the database is structured,
how to set it up, and how to extend it.

### Overview

The schema is organized into logical domains:

| Domain | Models | Purpose |
| ------ | ------ | ------- |
| Auth | `User`, `Account`, `Session`, `VerificationToken`, `PasswordResetToken` | Login, sessions, 2FA, password reset |
| Personnel | `Personnel` | Staff profiles linked to user accounts |
| Records | `ScpObject`, `Department`, `Faction`, `ContentPage`, `Incident`, `Operation` | All editable lore and operational data |
| System | `Announcement`, `Revision`, `Favorite`, `AuditLog`, `Media`, `Setting` | Dashboard feeds, version history, audit trail, config |

Every content model uses **soft deletes** via an optional `deletedAt` timestamp. Queries
throughout the app filter `deletedAt: null` so records can be restored later.

### Step 1 — Configure the datasource

At the top of `schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

`DATABASE_URL` in your `.env` must point to a running PostgreSQL database:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/site80?schema=public"
```

### Step 2 — Understand the enums

Four enums drive access control and publishing state:

```prisma
enum Role { GUEST, PERSONNEL, RESEARCHER, SECURITY, ... }
enum Clearance { LEVEL_0, LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5 }
enum AccountStatus { PENDING, ACTIVE, SUSPENDED, LOCKED, ARCHIVED }
enum ContentStatus { DRAFT, PUBLISHED, ARCHIVED }
```

- **Role** — assigned to `User.role`; drives page/API permissions via `src/lib/rbac.ts`.
- **Clearance** — assigned to both `User` and `Personnel`; gates sensitive record fields.
- **AccountStatus** — `PENDING` accounts cannot log in until an admin approves them.
- **ContentStatus** — `DRAFT` SCPs are hidden from non-editors; `PUBLISHED` are visible.

### Step 3 — Auth models

**`User`** is the central identity record:

| Field | Notes |
| ----- | ----- |
| `username`, `email` | Unique login identifiers |
| `passwordHash` | bcrypt hash (never store plaintext) |
| `role`, `clearance`, `status` | Access control |
| `twoFactorEnabled`, `twoFactorSecret` | Optional 2FA |
| `failedLoginCount`, `lockedUntil` | Brute-force lockout |
| `lastLoginAt`, `lastLoginIp` | Audit + "personnel online" dashboard widget |

**`Session`** and **`Account`** support NextAuth's Prisma adapter. **`PasswordResetToken`**
stores hashed reset tokens with expiry.

### Step 4 — Personnel model

`Personnel` is a rich profile that can optionally link to a `User` via `userId`:

```
User (1) ←→ (0..1) Personnel
Personnel (n) → (1) Department
Personnel (n) → (1) Personnel  [supervisor self-relation]
```

Structured arrays (training, awards, disciplinary actions, assignment history) are stored
as **JSON** fields so you can add entries through the admin UI without schema migrations.

### Step 5 — SCP Objects

`ScpObject` is the most detailed model. Key design choices:

- **`slug`** — URL-safe identifier (e.g. `scp-080-a` → `/scp/scp-080-a`)
- **`itemNumber`** — display identifier (e.g. `SCP-080-A`)
- Classification fields (`objectClass`, `containmentClass`, `riskClass`, `disruptionClass`) are free-text strings so you can use any classification system.
- Narrative fields (`summary`, `containmentProcedures`, `description`, `history`) are `@db.Text` for long content.
- Collections (`gallery`, `addendums`, `recoveryLogs`, etc.) are **JSON arrays** edited via repeatable form components in the admin panel.
- **`revisions`** — every save creates a `Revision` snapshot for version history.

### Step 6 — Departments, Factions, Content Pages

**`Department`** — organizational divisions with leadership, SOPs, statistics (all JSON).

**`Faction`** — task forces and elite groups with equipment, gallery, documents.

**`ContentPage`** — generic Markdown pages categorized by `category` field:
- `rules`, `documents`, `research`, `training`
- Routed to `/{category}/{slug}` (e.g. `/rules/general-rules`)

### Step 7 — Operations & Incidents

**`Operation`** — mission records with codename, classification, schedule, objective.

**`Incident`** — incident reports with ref number, severity, location, date.

Both support draft/published workflow via `ContentStatus`.

### Step 8 — System models

| Model | Purpose |
| ----- | ------- |
| `Announcement` | Dashboard feed; `pinned` + `level` (info/caution/alert) |
| `Revision` | Generic version history linked to SCPs and content pages |
| `Favorite` | Per-user pinned pages on the dashboard |
| `AuditLog` | Security audit trail (auth events, mutations) |
| `Media` | Uploaded files metadata (URL, mime, size, folder) |
| `Setting` | Key-value JSON config (site name, security level, etc.) |

### Step 9 — Apply the schema

**Development (quick):**

```bash
npm run db:push
```

Pushes the schema directly to your database. Good for local iteration; no migration files.

**Production (versioned):**

```bash
npm run db:migrate
# Prisma will prompt for a migration name, e.g. "init"
```

Creates a timestamped SQL file in `prisma/migrations/`. Commit these to version control.

**Seed placeholder data:**

```bash
npm run db:seed
```

Populates departments, placeholder SCPs, rules pages, default users, and operations.
The seed is idempotent — it uses `upsert` so re-running is safe.

**Reset everything (destructive):**

```bash
npm run db:reset
```

Drops the database, re-applies migrations, and re-seeds.

### Step 10 — Regenerate the Prisma Client

After any schema change:

```bash
npm run db:generate
```

This runs automatically on `npm install` and `npm run build`. The generated client is
imported everywhere via `src/lib/prisma.ts`.

### Step 11 — Add a new module (example)

To add an **Equipment Database** in the future:

1. **Add a model** to `schema.prisma`:

```prisma
model Equipment {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  category    String
  description String?   @db.Text
  status      ContentStatus @default(DRAFT)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
}
```

2. **Apply the migration:**

```bash
npm run db:migrate
```

3. **Add a route** at `src/app/(app)/equipment/page.tsx`.

4. **Add a nav entry** in `src/config/navigation.ts`.

5. **Add a permission** in `src/lib/rbac.ts` and assign it to relevant roles.

6. **Optionally seed** placeholder records in `prisma/seed.ts`.

### Common Prisma commands

| Command | What it does |
| ------- | ------------ |
| `npm run db:generate` | Regenerate the TypeScript client |
| `npm run db:push` | Sync schema → database (no migration file) |
| `npm run db:migrate` | Create + apply a versioned migration |
| `npm run db:seed` | Run `prisma/seed.ts` |
| `npm run db:reset` | Drop, migrate, and seed (dev only) |

### JSON field conventions

Several models use `Json?` fields for flexible collections. The admin forms expect these shapes:

```typescript
// gallery
[{ url: string, caption?: string }]

// addendums / logs
[{ title: string, body: string }]

// leadership
[{ name: string, role: string }]

// disciplinary
[{ date: string, action: string, notes?: string }]
```

You can query JSON fields with Prisma's JSON filters if needed, but the app primarily
reads/writes them as structured arrays through the API layer.

---

## 🧩 Editing Content

All lore is editable in-app (no code changes needed):

- **SCPs:** `/admin/scp/new` or the **Edit** button on any SCP page.
- **Personnel:** `/admin/personnel/new` or **Edit** on a profile.
- **Pages (Rules/Docs/Research/Training):** `/admin/content/new`.
- **Users:** `/admin/users` to approve accounts and assign roles/clearance.

Narrative fields support **Markdown** (headings, bold/italic, lists, quotes, code).

---

## 🛣️ Built for Expansion

The architecture is modular. Scaffolded routes and the data model leave room for:
Interactive Facility Map, Containment Status Monitor, Power Grid, AI Assistant,
Research Submission, Mission Planning, Equipment/Vehicle/Inventory databases,
Training Portal, Badge Printing, Shift & Visitor Management, and an Emergency Alert
System. Add a model to `schema.prisma`, a route under `src/app/(app)/`, and a nav entry
in `src/config/navigation.ts`.

---

## 🔒 Production Notes

- Set `SECURE_COOKIES="true"` behind HTTPS (enables `__Secure-` cookie prefix + HSTS).
- Swap the in-memory rate limiter (`src/lib/rate-limit.ts`) for Redis in multi-instance deployments.
- Wire `src/app/api/forgot-password` and registration to a real email provider for
  verification and reset emails.
- Review and tighten the CSP in `src/middleware.ts` for your asset domains.
