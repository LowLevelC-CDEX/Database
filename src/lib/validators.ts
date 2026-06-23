import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").max(120),
  password: z.string().min(1, "Password is required").max(200),
  totp: z.string().optional(),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Min 3 characters")
    .max(32)
    .regex(/^[a-zA-Z0-9_.-]+$/, "Letters, numbers, . _ - only"),
  email: z.string().email("Invalid email").max(160),
  name: z.string().min(1).max(120),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .max(200)
    .regex(/[A-Z]/, "Needs an uppercase letter")
    .regex(/[a-z]/, "Needs a lowercase letter")
    .regex(/\d/, "Needs a number"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .max(200)
    .regex(/[A-Z]/, "Needs an uppercase letter")
    .regex(/\d/, "Needs a number"),
});

// ── Domain entity schemas (admin editing) ────────────────────

const galleryItem = z.object({ url: z.string(), caption: z.string().optional() });
const logEntry = z.object({ title: z.string().optional(), date: z.string().optional(), body: z.string() });

export const scpSchema = z.object({
  itemNumber: z.string().min(1).max(60),
  codename: z.string().max(120).optional().nullable(),
  objectClass: z.string().max(60).optional().nullable(),
  containmentClass: z.string().max(60).optional().nullable(),
  riskClass: z.string().max(60).optional().nullable(),
  disruptionClass: z.string().max(60).optional().nullable(),
  clearanceRequired: z.string().optional(),
  assignedSite: z.string().max(120).optional().nullable(),
  assignedDepartment: z.string().max(120).optional().nullable(),
  leadResearcher: z.string().max(120).optional().nullable(),
  containmentTeam: z.string().max(120).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  summary: z.string().optional().nullable(),
  containmentProcedures: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  history: z.string().optional().nullable(),
  gallery: z.array(galleryItem).optional(),
  addendums: z.array(logEntry).optional(),
  recoveryLogs: z.array(logEntry).optional(),
  experimentLogs: z.array(logEntry).optional(),
  incidentLogs: z.array(logEntry).optional(),
  crossTesting: z.array(logEntry).optional(),
  tags: z.array(z.string()).optional(),
});

export const personnelSchema = z.object({
  name: z.string().min(1).max(160),
  rank: z.string().max(120).optional().nullable(),
  clearance: z.string().optional(),
  departmentId: z.string().optional().nullable(),
  position: z.string().max(160).optional().nullable(),
  status: z.string().max(60).optional(),
  biography: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  portrait: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const contentPageSchema = z.object({
  category: z.string().min(1).max(60),
  title: z.string().min(1).max(200),
  icon: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  body: z.string().min(1),
  order: z.number().int().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  clearanceRequired: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const announcementSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  level: z.enum(["info", "caution", "alert"]).default("info"),
  pinned: z.boolean().optional(),
});

export const userAdminSchema = z.object({
  role: z.string(),
  clearance: z.string(),
  status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "LOCKED", "ARCHIVED"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
