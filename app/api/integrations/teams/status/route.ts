import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    provider: "teams",
    ready: true,
    message: "Teams är förberett för notiser, möten och samarbete."
  });
}
