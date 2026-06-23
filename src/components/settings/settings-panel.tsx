"use client";

import { useState } from "react";
import { Shield, Bell, Eye, KeyRound, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full border transition-colors ${checked ? "border-accent/60 bg-accent/30" : "border-hairline/70 bg-panel-2"}`}
    >
      <span className={`absolute top-0.5 size-4 rounded-full bg-foreground transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function Row({ icon: Icon, title, desc, children }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-hairline/30 py-3 last:border-0">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-4 text-accent" />
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function SettingsPanel({ username, twoFactorEnabled }: { username: string; twoFactorEnabled: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [twoFa, setTwoFa] = useState(twoFactorEnabled);
  const [compact, setCompact] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-4 text-accent" /> Security</CardTitle></CardHeader>
        <CardContent>
          <Row icon={Smartphone} title="Two-Factor Authentication" desc="Require a code at login for added security.">
            <Toggle checked={twoFa} onChange={setTwoFa} label="Two-factor authentication" />
          </Row>
          <Row icon={KeyRound} title="Password" desc="Change your account password.">
            <Button variant="secondary" size="sm">Change</Button>
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="size-4 text-accent" /> Notifications</CardTitle></CardHeader>
        <CardContent>
          <Row icon={Bell} title="Email Notifications" desc="Receive announcements and alerts by email.">
            <Toggle checked={emailNotif} onChange={setEmailNotif} label="Email notifications" />
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="size-4 text-accent" /> Interface</CardTitle></CardHeader>
        <CardContent>
          <Row icon={Eye} title="Reduced Motion" desc="Minimize animations across the interface.">
            <Toggle checked={reducedMotion} onChange={setReducedMotion} label="Reduced motion" />
          </Row>
          <Row icon={Eye} title="Compact Density" desc="Show more content with tighter spacing.">
            <Toggle checked={compact} onChange={setCompact} label="Compact density" />
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted">Signed in as <span className="font-mono text-foreground">@{username}</span></p>
          <p className="mt-2 text-xs text-muted">Preferences shown here are illustrative and persist per-session in this build. Wire them to the Settings table for full persistence.</p>
        </CardContent>
      </Card>
    </div>
  );
}
