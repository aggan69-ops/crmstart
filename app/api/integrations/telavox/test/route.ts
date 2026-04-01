import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Telavox test klart. Nästa steg är samtalslogg och klick-för-att-ringa."
  });
}
