import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.customer) return NextResponse.json({ error: "Saknar kund" }, { status: 400 });

  return NextResponse.json({
    ok: true,
    message: `Kund redo för Fortnox: ${body.customer.name}`,
    payload: {
      Name: body.customer.name,
      OrganisationNumber: body.customer.orgNumber,
      City: body.customer.city,
      Email: body.customer.email
    }
  });
}
