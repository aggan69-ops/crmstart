import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    provider: "abr",
    ready: true,
    message: "ABR är lagt som tredje integrationsplats och kan kopplas i nästa steg."
  });
}
