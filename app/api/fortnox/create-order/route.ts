import { NextRequest, NextResponse } from "next/server";
import { fortnoxCreateOrder, hasFortnoxCredentials } from "@/lib/fortnox";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.customer || !body.supplier || !body.text) return NextResponse.json({ error: "Saknar orderdata" }, { status: 400 });

  if (!hasFortnoxCredentials()) {
    return NextResponse.json({ ok: true, message: `Fortnox demo: order skapad för ${body.customer} via ${body.supplier}` });
  }

  try {
    await fortnoxCreateOrder(body);
    return NextResponse.json({ ok: true, message: `Order skickad till Fortnox för ${body.customer}` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Okänt Fortnox-fel" }, { status: 500 });
  }
}
