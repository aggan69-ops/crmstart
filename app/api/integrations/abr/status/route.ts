import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    provider: "abr",
    ready: true,
    message: "ABR är förberett som tredje extern datakoppling."
  });
}
