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
- **Modern dashboard** — announcements, recently updated files, system status, quick
  links, database statistics, and recent activity widgets.
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
npm run db:push   # create tables from the Prisma schema
npm run db:seed   # seed placeholder data + default accounts
```

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
```
