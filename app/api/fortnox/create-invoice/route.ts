import { NextRequest, NextResponse } from "next/server";
import { fortnoxCreateInvoice, hasFortnoxCredentials } from "@/lib/fortnox";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.order) return NextResponse.json({ error: "Saknar order" }, { status: 400 });

  if (!hasFortnoxCredentials()) {
    return NextResponse.json({ ok: true, message: `Fortnox demo: faktura skapad från ${body.order.id}` });
  }

  try {
    await fortnoxCreateInvoice({ customer: body.order.customer, text: body.order.text });
    return NextResponse.json({ ok: true, message: `Faktura skapad i Fortnox för ${body.order.customer}` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Okänt Fortnox-fel" }, { status: 500 });
  }
}