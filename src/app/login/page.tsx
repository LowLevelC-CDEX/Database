import { LoginExperience } from "@/components/auth/login-experience";

// Dynamic so middleware's per-request CSP nonce is injected into scripts.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <LoginExperience />;
}
