import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.customer || !body.supplier || !body.text) {
    return NextResponse.json({ error: "Saknar orderdata" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: `Order skapad för ${body.customer} och skickad via leverantör ${body.supplier}`,
    payload: body
  });
}
