"use server";

// Protected layout — server-side authorization runs before rendering.
// Every route under /protected/* independently checks identity, role and org
// scope on the server. Hiding a link is not authorization.
import { authorize } from "@/server/auth/authorize";
import { Shell } from "@/components/shell";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  authorize({ requiredRole: "clinician" });
  return <Shell>{children}</Shell>;
}
