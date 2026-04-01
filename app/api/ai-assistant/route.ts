import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const question = String(body.question || "").trim();

  if (!question) {
    return NextResponse.json({ error: "Skriv en fråga" }, { status: 400 });
  }

  const lower = question.toLowerCase();

  let answer = "Jag föreslår att du följer upp kunden med offert och nästa samtalstid.";

  if (lower.includes("sälja") || lower.includes("erbjud")) {
    answer = "Börja med reservdelar och smörjmedel. Lyft snabb leverans, återkommande behov och möjlighet till Fortnox-baserat orderflöde.";
  } else if (lower.includes("offert")) {
    answer = "Skriv en kort offert med produkt, pris, leveranstid och tydlig call to action: be kunden bekräfta direkt.";
  } else if (lower.includes("sammanfatta")) {
    answer = "Bolaget ser ut att passa i segmentet transport/verkstad/industri beroende på lookup. Nästa steg är att lägga till som kund och skicka till Fortnox.";
  }

  return NextResponse.json({ ok: true, answer });
}
