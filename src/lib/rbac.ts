import type { Role, Clearance } from "@prisma/client";

// ── Role metadata ────────────────────────────────────────────
// `rank` is used for hierarchical comparisons (higher = more authority).

export const ROLES: Record<
  Role,
  { label: string; rank: number; color: string; description: string }
> = {
  GUEST: { label: "Guest", rank: 0, color: "muted", description: "Unverified visitor with minimal access." },
  PERSONNEL: { label: "Personnel", rank: 10, color: "accent", description: "General Foundation staff." },
  RESEARCHER: { label: "Researcher", rank: 20, color: "accent", description: "Research Division staff." },
  SECURITY: { label: "Security", rank: 20, color: "accent", description: "Security Department staff." },
  MEDICAL: { label: "Medical", rank: 20, color: "accent", description: "Medical Department staff." },
  ENGINEERING: { label: "Engineering", rank: 20, color: "accent", description: "Engineering Department staff." },
  CONTAINMENT_SPECIALIST: { label: "Containment Specialist", rank: 30, color: "caution", description: "Containment operations." },
  DEPARTMENT_DIRECTOR: { label: "Department Director", rank: 50, color: "caution", description: "Leads a department." },
  ETHICS_COMMITTEE: { label: "Ethics Committee", rank: 60, color: "caution", description: "Ethical oversight." },
  O5_ADMINISTRATION: { label: "O5 Administration", rank: 90, color: "alert", description: "Overseer-level administration." },
  DEVELOPER: { label: "Developer", rank: 95, color: "alert", description: "Platform developer." },
  WEBSITE_ADMINISTRATOR: { label: "Website Administrator", rank: 100, color: "alert", description: "Full system administration." },
};

export const ROLE_ORDER = Object.keys(ROLES) as Role[];

export const CLEARANCES: Record<Clearance, { label: string; level: number; short: string }> = {
  LEVEL_0: { label: "Level 0 — Unrestricted", level: 0, short: "L0" },
  LEVEL_1: { label: "Level 1 — Confidential", level: 1, short: "L1" },
  LEVEL_2: { label: "Level 2 — Restricted", level: 2, short: "L2" },
  LEVEL_3: { label: "Level 3 — Secret", level: 3, short: "L3" },
  LEVEL_4: { label: "Level 4 — Top Secret", level: 4, short: "L4" },
  LEVEL_5: { label: "Level 5 — Thaumiel", level: 5, short: "L5" },
};

export const CLEARANCE_ORDER = Object.keys(CLEARANCES) as Clearance[];

// ── Permissions ──────────────────────────────────────────────

export type Permission =
  | "dashboard.view"
  | "scp.view"
  | "scp.manage"
  | "personnel.view"
  | "personnel.manage"
  | "departments.view"
  | "departments.manage"
  | "factions.view"
  | "operations.view"
  | "operations.manage"
  | "incidents.view"
  | "incidents.manage"
  | "research.view"
  | "documents.view"
  | "rules.view"
  | "content.manage"
  | "security.view"
  | "containment.view"
  | "medical.view"
  | "engineering.view"
  | "maps.view"
  | "training.view"
  | "applications.view"
  | "admin.view"
  | "admin.users"
  | "admin.roles"
  | "admin.settings"
  | "admin.logs"
  | "admin.media"
  | "admin.system";

// Base permissions everyone authenticated gets.
const BASE: Permission[] = [
  "dashboard.view",
  "scp.view",
  "personnel.view",
  "departments.view",
  "factions.view",
  "operations.view",
  "incidents.view",
  "research.view",
  "documents.view",
  "rules.view",
  "maps.view",
  "training.view",
  "applications.view",
];

const CONTENT_MANAGE: Permission[] = [
  "scp.manage",
  "content.manage",
  "incidents.manage",
  "operations.manage",
];

const ADMIN_FULL: Permission[] = [
  "admin.view",
  "admin.users",
  "admin.roles",
  "admin.settings",
  "admin.logs",
  "admin.media",
  "admin.system",
  "personnel.manage",
  "departments.manage",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  GUEST: ["dashboard.view", "rules.view", "applications.view"],
  PERSONNEL: [...BASE],
  RESEARCHER: [...BASE, "research.view", "scp.manage"],
  SECURITY: [...BASE, "security.view", "containment.view"],
  MEDICAL: [...BASE, "medical.view"],
  ENGINEERING: [...BASE, "engineering.view"],
  CONTAINMENT_SPECIALIST: [...BASE, "containment.view", "security.view", "scp.manage"],
  DEPARTMENT_DIRECTOR: [...BASE, "research.view", "security.view", "medical.view", "engineering.view", "containment.view", ...CONTENT_MANAGE, "personnel.manage"],
  ETHICS_COMMITTEE: [...BASE, "research.view", "medical.view", "containment.view", "admin.logs", "admin.view"],
  O5_ADMINISTRATION: [...BASE, "research.view", "security.view", "medical.view", "engineering.view", "containment.view", ...CONTENT_MANAGE, ...ADMIN_FULL],
  DEVELOPER: [...BASE, "research.view", "security.view", "medical.view", "engineering.view", "containment.view", ...CONTENT_MANAGE, ...ADMIN_FULL],
  WEBSITE_ADMINISTRATOR: [...BASE, "research.view", "security.view", "medical.view", "engineering.view", "containment.view", ...CONTENT_MANAGE, ...ADMIN_FULL],
};

export function permissionsFor(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function can(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return permissionsFor(role).includes(permission);
}

export function roleAtLeast(role: Role | undefined | null, minimum: Role): boolean {
  if (!role) return false;
  return ROLES[role].rank >= ROLES[minimum].rank;
}

export function clearanceAtLeast(
  clearance: Clearance | undefined | null,
  minimum: Clearance,
): boolean {
  if (!clearance) return false;
  return CLEARANCES[clearance].level >= CLEARANCES[minimum].level;
}

export function roleLabel(role: Role) {
  return ROLES[role]?.label ?? role;
}

export function clearanceLabel(clearance: Clearance) {
  return CLEARANCES[clearance]?.label ?? clearance;
}

export function clearanceShort(clearance: Clearance) {
  return CLEARANCES[clearance]?.short ?? clearance;
}
