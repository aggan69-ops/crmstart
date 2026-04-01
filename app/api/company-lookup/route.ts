import { NextRequest, NextResponse } from "next/server";

function segmentFromQuery(query: string) {
  const q = query.toLowerCase();
  if (q.includes("frakt") || q.includes("transport") || q.includes("logistik")) return "Transport";
  if (q.includes("verkstad") || q.includes("mek") || q.includes("service")) return "Verkstad";
  if (q.includes("industri") || q.includes("produktion") || q.includes("stål")) return "Industri";
  return "Övrigt";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = String(body.query || "").trim();
  if (!query) return NextResponse.json({ error: "Saknar sökning" }, { status: 400 });

  return NextResponse.json({
    ok: true,
    company: {
      id: "cust-" + Date.now(),
      name: query.includes("556") ? "Lookup Företag AB" : query,
      orgNumber: query.includes("556") ? query : "556999-1234",
      city: "Stockholm",
      segment: segmentFromQuery(query),
      email: "info@lookupforetag.se",
      paymentTerms: "30 dagar",
      source: "Lookup"
    }
  });
}