import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const q = String(body.question || "").toLowerCase().trim();
  if (!q) return NextResponse.json({ error: "Skriv en fråga" }, { status: 400 });

  let answer = "Börja med att följa upp kunden, skapa offert och lägg in nästa aktivitet.";
  if (q.includes("automatisera")) {
    answer = "Automatisera lookup vid ny kund, synk-kö till Fortnox, Teams-notis vid ny order och påminnelse om uppföljning efter 7 dagar.";
  } else if (q.includes("offert")) {
    answer = "Skriv en kort offert med produkt, pris, leverans och tydlig bekräftelse från kunden.";
  } else if (q.includes("sälja")) {
    answer = "För segmenten transport, verkstad och industri är reservdelar och smörjmedel en bra första kontaktpunkt.";
  } else if (q.includes("fortnox")) {
    answer = "Skicka ny eller ändrad kunddata via synk-kön och skapa order/faktura först efter godkännande.";
  }

  return NextResponse.json({ ok: true, answer });
}
