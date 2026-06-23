import type { Permission } from "@/lib/rbac";
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  Building2,
  Crosshair,
  Star,
  UserCog,
  ClipboardList,
  AlertTriangle,
  Microscope,
  Wrench,
  HeartPulse,
  Shield,
  Lock,
  Map,
  FileText,
  Scale,
  GraduationCap,
  FilePlus2,
  Settings2,
  CircleUser,
  LifeBuoy,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
  badge?: string;
}

export interface NavSection {
  heading: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    heading: "Overview",
    items: [
      { label: "Home", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
    ],
  },
  {
    heading: "Records",
    items: [
      { label: "Personnel Database", href: "/personnel", icon: Users, permission: "personnel.view" },
      { label: "SCP Objects", href: "/scp", icon: FlaskConical, permission: "scp.view" },
      { label: "Departments", href: "/departments", icon: Building2, permission: "departments.view" },
      { label: "Task Forces", href: "/factions?type=task-force", icon: Crosshair, permission: "factions.view" },
      { label: "Elite Factions", href: "/factions", icon: Star, permission: "factions.view" },
      { label: "Staff", href: "/personnel?staff=1", icon: UserCog, permission: "personnel.view" },
    ],
  },
  {
    heading: "Operations",
    items: [
      { label: "Operations", href: "/operations", icon: ClipboardList, permission: "operations.view" },
      { label: "Incident Reports", href: "/incidents", icon: AlertTriangle, permission: "incidents.view" },
      { label: "Research", href: "/research", icon: Microscope, permission: "research.view" },
      { label: "Engineering", href: "/engineering", icon: Wrench, permission: "engineering.view" },
      { label: "Medical", href: "/medical", icon: HeartPulse, permission: "medical.view" },
      { label: "Security", href: "/security", icon: Shield, permission: "security.view" },
      { label: "Containment", href: "/containment", icon: Lock, permission: "containment.view" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "Maps", href: "/maps", icon: Map, permission: "maps.view" },
      { label: "Documents", href: "/documents", icon: FileText, permission: "documents.view" },
      { label: "Rules", href: "/rules", icon: Scale, permission: "rules.view" },
      { label: "Training", href: "/training", icon: GraduationCap, permission: "training.view" },
      { label: "Applications", href: "/applications", icon: FilePlus2, permission: "applications.view" },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Administration", href: "/admin", icon: ShieldCheck, permission: "admin.view" },
      { label: "Settings", href: "/settings", icon: Settings2 },
      { label: "Profile", href: "/profile", icon: CircleUser },
      { label: "Help", href: "/help", icon: LifeBuoy },
    ],
  },
];
