import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface SearchResult {
  type: string;
  label: string;
  sublabel?: string;
  href: string;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const filter = req.nextUrl.searchParams.get("type") ?? "all";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const like = { contains: q, mode: "insensitive" as const };
  const results: SearchResult[] = [];
  const take = 6;

  const wants = (t: string) => filter === "all" || filter === t;

  const [scps, personnel, departments, pages, incidents, operations, factions] = await Promise.all([
    wants("scp")
      ? prisma.scpObject.findMany({ where: { deletedAt: null, OR: [{ itemNumber: like }, { codename: like }, { summary: like }] }, take })
      : [],
    wants("personnel")
      ? prisma.personnel.findMany({ where: { deletedAt: null, OR: [{ name: like }, { position: like }, { rank: like }] }, take })
      : [],
    wants("department")
      ? prisma.department.findMany({ where: { deletedAt: null, OR: [{ name: like }, { overview: like }] }, take })
      : [],
    wants("document") || wants("research") || wants("rules")
      ? prisma.contentPage.findMany({ where: { deletedAt: null, OR: [{ title: like }, { excerpt: like }, { body: like }] }, take })
      : [],
    wants("incident")
      ? prisma.incident.findMany({ where: { deletedAt: null, OR: [{ title: like }, { refNumber: like }, { summary: like }] }, take })
      : [],
    wants("operation")
      ? prisma.operation.findMany({ where: { deletedAt: null, OR: [{ codename: like }, { objective: like }] }, take })
      : [],
    wants("faction")
      ? prisma.faction.findMany({ where: { deletedAt: null, OR: [{ name: like }, { overview: like }] }, take })
      : [],
  ]);

  for (const s of scps) results.push({ type: "SCP", label: `${s.itemNumber}`, sublabel: s.objectClass ?? undefined, href: `/scp/${s.slug}` });
  for (const p of personnel) results.push({ type: "Personnel", label: p.name, sublabel: p.position ?? p.rank ?? undefined, href: `/personnel/${p.id}` });
  for (const d of departments) results.push({ type: "Department", label: d.name, href: `/departments/${d.slug}` });
  for (const c of pages) results.push({ type: "Document", label: c.title, sublabel: c.category, href: `/${c.category}/${c.slug}` });
  for (const i of incidents) results.push({ type: "Incident", label: i.title, sublabel: i.refNumber, href: `/incidents/${i.slug}` });
  for (const o of operations) results.push({ type: "Operation", label: o.codename, sublabel: o.status, href: `/operations/${o.slug}` });
  for (const f of factions) results.push({ type: "Faction", label: f.name, href: `/factions/${f.slug}` });

  return NextResponse.json({ results });
}
