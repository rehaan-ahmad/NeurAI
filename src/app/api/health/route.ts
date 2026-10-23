import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";

export async function GET() {
  try {
    requireAdmin();
    return NextResponse.json({
      status: "ready",
      service: "neurai",
      demo: true,
      timestamp: new Date().toISOString(),
      checks: {
        auth: "configured",
        persistence: "demo-adaptor",
        ai: "disabled-until-approved",
      },
    });
  } catch {
    return NextResponse.json({ status: "unauthorized" }, { status: 403 });
  }
}
