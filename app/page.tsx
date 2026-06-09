import { redirect } from "next/navigation";

// Root redirects to dashboard. Actual dashboard page lives at
// app/(shell)/dashboard/page.tsx so the shell layout wraps it.
export default function RootPage() {
  redirect("/dashboard");
}
