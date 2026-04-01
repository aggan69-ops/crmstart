import { NextRequest, NextResponse } from "next/server";
import { fortnoxCreateCustomer, hasFortnoxCredentials } from "@/lib/fortnox";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.customer) return NextResponse.json({ error: "Saknar kund" }, { status: 400 });

  if (!hasFortnoxCredentials()) {
    return NextResponse.json({ ok: true, message: `Fortnox demo: kund redo för skickning ${body.customer.name}` });
  }

  try {
    await fortnoxCreateCustomer(body.customer);
    return NextResponse.json({ ok: true, message: `Kund skickad till Fortnox: ${body.customer.name}` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Okänt Fortnox-fel" }, { status: 500 });
  }
}
