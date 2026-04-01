import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const q = String(body.question || "").toLowerCase().trim();
  if (!q) return NextResponse.json({ error: "Skriv en fråga" }, { status: 400 });

  let answer = "Börja med att följa upp kunden, skapa offert och lägg nästa aktivitet.";
  if (q.includes("automatisera")) answer = "Automatisera lookup, synk-kö till Fortnox, Telavox-popup vid inkommande samtal och Teams-notis när order skickas.";
  if (q.includes("olja")) answer = "Bygg produktförslag utifrån segment, tidigare order och oljepris-widget.";
  if (q.includes("katalog")) answer = "Koppla katalog-API per kategori: personbil, lastbil och maskin.";
  if (q.includes("offert")) answer = "Lägg offertutkast i CRM, skicka efter godkännande och skapa task för uppföljning.";
  return NextResponse.json({ ok: true, answer });
}
