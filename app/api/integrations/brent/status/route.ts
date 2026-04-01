import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    provider: "brent",
    ready: true,
    message: "Brent-widget är förberedd för extern prisfeed."
  });
}
