import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const customer = body.customer;

  if (!customer) {
    return NextResponse.json({ error: "Saknar kunddata" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: `Klar för Fortnox: ${customer.name}. Nästa steg är live token + riktig POST mot Fortnox API.`,
    payload: {
      Name: customer.name,
      OrganisationNumber: customer.orgNumber,
      City: customer.city
    }
  });
}
