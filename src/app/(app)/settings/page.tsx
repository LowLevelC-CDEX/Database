import { requireAuth } from "@/lib/session";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsPanel } from "@/components/settings/settings-panel";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireAuth();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Preferences" title="Settings" description="Manage your account, security, and interface preferences." />
      <SettingsPanel username={user.username} twoFactorEnabled={false} />
    </div>
  );
}
