import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const q = String(body.question || "").toLowerCase();
  if (!q) return NextResponse.json({ error: "Skriv en fråga" }, { status: 400 });

  let answer = "Föreslå offert och boka uppföljning.";
  if (q.includes("offert")) answer = "Skriv en kort offert med pris, leverans och tydlig bekräftelse.";
  if (q.includes("sälja")) answer = "Börja med reservdelar och smörjmedel, lyft snabb leverans och återkommande behov.";
  if (q.includes("kund")) answer = "Lägg kunden i CRM, segmentera och skicka vidare till Fortnox när datan är klar.";

  return NextResponse.json({ ok: true, answer });
}
