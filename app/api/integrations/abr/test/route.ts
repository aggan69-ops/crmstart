import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "ABR test klart. Nästa steg är att mappa rätt endpoint och datamodell."
  });
}
