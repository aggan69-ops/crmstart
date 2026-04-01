import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const q = String(body.question || "").toLowerCase().trim();
  if (!q) return NextResponse.json({ error: "Skriv en fråga" }, { status: 400 });

  let answer = "Börja med att följa upp kunden, skapa offert och lägg nästa aktivitet.";
  if (q.includes("automatisera")) answer = "Automatisera lookup, synk-kö till Fortnox, Telavox-popup vid inkommande samtal, Teams-notis när order skickas och widget för brent/katalog.";
  if (q.includes("olja")) answer = "Bygg produktförslag utifrån segment, tidigare order och oljepris-widget.";
  if (q.includes("katalog")) answer = "Koppla katalog-API per kategori: personbil, lastbil och maskin. Mappa artikelnummer mot leverantör och order.";
  if (q.includes("offert")) answer = "Lägg offertutkast i CRM, skicka efter godkännande och skapa task för uppföljning.";
  if (q.includes("branch")) answer = "För din branch behövs pipeline, hotlist, tasks, offerter, audit log och inkommande samtal med autosave.";
  return NextResponse.json({ ok: true, answer });
}