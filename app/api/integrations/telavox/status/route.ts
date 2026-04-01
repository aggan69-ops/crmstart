import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    provider: "telavox",
    ready: true,
    message: "Telavox är förberett för samtal, kontaktkort och historik."
  });
}
