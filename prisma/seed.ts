import { PrismaClient, Role, Clearance, AccountStatus, ContentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hash(pw: string) {
  return bcrypt.hash(pw, 12);
}

async function main() {
  console.log("→ Seeding Site-80 \"JACOBY\" database…");

  // ── Users ──────────────────────────────────────────────────
  const adminPass = await hash("ChangeMe!2026");
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@site80.foundation",
      name: "Site Administrator",
      passwordHash: adminPass,
      role: Role.WEBSITE_ADMINISTRATOR,
      clearance: Clearance.LEVEL_5,
      status: AccountStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });

  const researcher = await prisma.user.upsert({
    where: { username: "researcher" },
    update: {},
    create: {
      username: "researcher",
      email: "researcher@site80.foundation",
      name: "Dr. [REDACTED]",
      passwordHash: await hash("Research!2026"),
      role: Role.RESEARCHER,
      clearance: Clearance.LEVEL_3,
      status: AccountStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { username: "pending" },
    update: {},
    create: {
      username: "pending",
      email: "recruit@site80.foundation",
      name: "Unverified Recruit",
      passwordHash: await hash("Pending!2026"),
      role: Role.PERSONNEL,
      clearance: Clearance.LEVEL_1,
      status: AccountStatus.PENDING,
    },
  });

  // ── Departments ────────────────────────────────────────────
  const departments = [
    ["administration", "Administration", "ADM", "ShieldCheck"],
    ["research", "Research", "RSD", "FlaskConical"],
    ["security", "Security", "SEC", "Shield"],
    ["medical", "Medical", "MED", "HeartPulse"],
    ["engineering", "Engineering", "ENG", "Wrench"],
    ["logistics", "Logistics", "LOG", "Truck"],
    ["maintenance", "Maintenance", "MNT", "Hammer"],
    ["intelligence", "Intelligence", "INT", "Eye"],
    ["ethics", "Ethics Committee", "ETH", "Scale"],
    ["internal-affairs", "Internal Affairs", "IA", "Search"],
    ["communications", "Communications", "COM", "Radio"],
    ["operations", "Operations", "OPS", "Crosshair"],
    ["containment", "Containment", "CNT", "Lock"],
  ];

  for (const [slug, name, shortName, icon] of departments) {
    await prisma.department.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name,
        shortName,
        icon,
        overview: `[PLACEHOLDER] Overview for the ${name} department at Site-80 "JACOBY". Replace with your own lore.`,
        responsibilities: "[PLACEHOLDER] List the responsibilities of this department here.",
        leadership: [{ name: "[VACANT]", role: "Director" }],
        sops: [{ title: "[PLACEHOLDER] Standard Operating Procedure", body: "Add SOP details here." }],
        statistics: { members: 0, activeProjects: 0 },
        status: ContentStatus.PUBLISHED,
      },
    });
  }

  const research = await prisma.department.findUnique({ where: { slug: "research" } });

  // ── Personnel ──────────────────────────────────────────────
  await prisma.personnel.upsert({
    where: { userId: researcher.id },
    update: {},
    create: {
      userId: researcher.id,
      name: "Dr. [REDACTED]",
      rank: "Senior Researcher",
      clearance: Clearance.LEVEL_3,
      departmentId: research?.id,
      position: "Lead Researcher",
      status: "Active",
      biography: "[PLACEHOLDER] Personnel biography. Add background, specialties, and notes.",
      training: ["[PLACEHOLDER] Containment Theory", "[PLACEHOLDER] Field Research"],
      awards: ["[PLACEHOLDER] Commendation"],
      tags: ["research"],
    },
  });

  // ── SCP Objects (placeholders only) ───────────────────────
  const scps = [
    ["SCP-080-A", "scp-080-a", "Safe"],
    ["SCP-080-B", "scp-080-b", "Euclid"],
    ["SCP-080-C", "scp-080-c", "Keter"],
  ];
  for (const [itemNumber, slug, objectClass] of scps) {
    await prisma.scpObject.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        itemNumber,
        codename: "[CLASSIFIED]",
        objectClass,
        containmentClass: "[PLACEHOLDER]",
        riskClass: "[PLACEHOLDER]",
        disruptionClass: "[PLACEHOLDER]",
        clearanceRequired: Clearance.LEVEL_2,
        assignedSite: "Site-80 \"JACOBY\"",
        assignedDepartment: "Research",
        leadResearcher: "[VACANT]",
        containmentTeam: "[VACANT]",
        status: ContentStatus.PUBLISHED,
        summary: "[PLACEHOLDER] Short summary of the anomaly. Replace with your own content.",
        containmentProcedures:
          "[PLACEHOLDER] Special Containment Procedures. Describe how the object is contained.",
        description: "[PLACEHOLDER] Description of the anomalous object and its properties.",
        addendums: [{ title: "Addendum 080-1", body: "[PLACEHOLDER] Addendum content." }],
        experimentLogs: [{ title: "Experiment Log 080-A", body: "[PLACEHOLDER] Experiment results." }],
        tags: ["placeholder"],
      },
    });
  }

  // ── Factions ───────────────────────────────────────────────
  await prisma.faction.upsert({
    where: { slug: "task-force-omega" },
    update: {},
    create: {
      slug: "task-force-omega",
      name: "[PLACEHOLDER] Elite Faction",
      type: "Elite Faction",
      motto: "[PLACEHOLDER] Motto",
      overview: "[PLACEHOLDER] Describe this elite group. Add your own custom factions.",
      requirements: "[PLACEHOLDER] Entry requirements.",
      equipment: ["[PLACEHOLDER] Standard kit"],
      status: ContentStatus.PUBLISHED,
    },
  });

  // ── Operations (placeholders) ────────────────────────────────
  const ops: [string, string, string, string, number][] = [
    ["op-nightwatch", "OPERATION NIGHTWATCH", "Routine", "Planned", 3],
    ["op-sweep", "OPERATION SWEEP", "Classified", "Approved", 7],
  ];
  for (const [slug, codename, classification, status, daysAhead] of ops) {
    await prisma.operation.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        codename,
        classification,
        status,
        scheduledFor: new Date(Date.now() + Number(daysAhead) * 86_400_000),
        objective: "[PLACEHOLDER] Operation objective. Replace with your own mission details.",
        body: "[PLACEHOLDER] Full operation briefing.",
        contentStatus: ContentStatus.PUBLISHED,
      },
    });
  }

  // ── Content pages (rules + docs + training) ────────────────
  const rules = [
    ["general-rules", "General Rules"],
    ["roleplay-rules", "Roleplay Rules"],
    ["research-rules", "Research Rules"],
    ["security-rules", "Security Rules"],
    ["containment-rules", "Containment Rules"],
    ["discord-rules", "Discord Rules"],
    ["website-rules", "Website Rules"],
    ["administration-policies", "Administration Policies"],
    ["punishments", "Punishments"],
    ["appeals", "Appeals"],
    ["code-of-conduct", "Code of Conduct"],
  ];
  let order = 0;
  for (const [slug, title] of rules) {
    await prisma.contentPage.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        category: "rules",
        title,
        order: order++,
        excerpt: `[PLACEHOLDER] ${title} summary.`,
        body: `# ${title}\n\n[PLACEHOLDER] Add your ${title.toLowerCase()} here. This content is fully editable from the admin panel.`,
        status: ContentStatus.PUBLISHED,
      },
    });
  }

  // ── Announcements ──────────────────────────────────────────
  await prisma.announcement.create({
    data: {
      title: "Welcome to Site-80 \"JACOBY\"",
      body: "[PLACEHOLDER] This is your announcements feed. Post site-wide notices here.",
      level: "info",
      pinned: true,
      authorName: "Administration",
    },
  });
  await prisma.announcement.create({
    data: {
      title: "Database initialized",
      body: "All modules are online. Begin populating lore via the admin panel.",
      level: "caution",
      authorName: "System",
    },
  });

  // ── Settings ───────────────────────────────────────────────
  await prisma.setting.upsert({
    where: { key: "site" },
    update: {},
    create: {
      key: "site",
      value: {
        name: 'Site-80 "JACOBY"',
        tagline: "Secure. Contain. Protect.",
        securityLevel: "GREEN",
        registrationOpen: true,
      },
    },
  });

  console.log("✓ Seed complete.");
  console.log("  Admin login:      admin / ChangeMe!2026");
  console.log("  Researcher login: researcher / Research!2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
