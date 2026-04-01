import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.order) return NextResponse.json({ error: "Saknar order" }, { status: 400 });

  return NextResponse.json({
    ok: true,
    message: `Faktura skapad från order ${body.order.id}`
  });
}
