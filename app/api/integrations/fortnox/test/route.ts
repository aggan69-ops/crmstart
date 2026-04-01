import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Fortnox test klart. Nästa steg är riktig auth och hämtning av kunder/artiklar."
  });
}
