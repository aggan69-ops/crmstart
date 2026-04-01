import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    provider: "catalog",
    ready: true,
    message: "Katalog-API är förberett för personbil, lastbil och maskin."
  });
}
