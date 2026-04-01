"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Lead = { company: string; contact: string; segment: string };
type Customer = { name: string; orgNumber: string; city: string; segment: string };
type Order = { customer: string; text: string };
type Activity = { text: string };

const defaultLeads: Lead[] = [
  { company: "Nordtrafik Service AB", contact: "Anders Holm", segment: "Transport" },
  { company: "Stålverk Mekaniska", contact: "Maria Eng", segment: "Verkstad" }
];

const defaultCustomers: Customer[] = [
  { name: "Mälarfrakt AB", orgNumber: "556123-1111", city: "Västerås", segment: "Transport" },
  { name: "Söder Verkstad", orgNumber: "556123-2222", city: "Nykvarn", segment: "Verkstad" }
];

const defaultOrders: Order[] = [
  { customer: "Mälarfrakt AB", text: "Motorolja 5W30 20L" },
  { customer: "Söder Verkstad", text: "Kullager 6205" }
];

const defaultActivities: Activity[] = [
  { text: "Ring Anders Holm" },
  { text: "Skicka offert till Söder Verkstad" }
];

export default function Page() {
  const [tab, setTab] = useState("home");
  const [leads, setLeads] = useState<Lead[]>(defaultLeads);
  const [customers, setCustomers] = useState<Customer[]>(defaultCustomers);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);

  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResult, setLookupResult] = useState("");
  const [fortnoxResult, setFortnoxResult] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  useEffect(() => {
    const a = localStorage.getItem("crm_fixed_leads");
    const b = localStorage.getItem("crm_fixed_customers");
    const c = localStorage.getItem("crm_fixed_orders");
    const d = localStorage.getItem("crm_fixed_activities");
    if (a) setLeads(JSON.parse(a));
    if (b) setCustomers(JSON.parse(b));
    if (c) setOrders(JSON.parse(c));
    if (d) setActivities(JSON.parse(d));
  }, []);

  useEffect(() => localStorage.setItem("crm_fixed_leads", JSON.stringify(leads)), [leads]);
  useEffect(() => localStorage.setItem("crm_fixed_customers", JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem("crm_fixed_orders", JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem("crm_fixed_activities", JSON.stringify(activities)), [activities]);

  async function companyLookup() {
    setLookupResult("Söker...");
    const res = await fetch("/api/company-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: lookupQuery })
    });
    const json = await res.json();
    if (!res.ok) return setLookupResult(json.error || "Fel");
    setCustomers([json.company, ...customers]);
    setActivities([{ text: "Ny kund hämtad: " + json.company.name }, ...activities]);
    setLookupResult("Tillagd som kund: " + json.company.name);
  }

  async function sendLatestToFortnox() {
    if (!customers.length) return;
    setFortnoxResult("Skickar...");
    const res = await fetch("/api/fortnox/send-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer: customers[0] })
    });
    const json = await res.json();
    setFortnoxResult(res.ok ? json.message : json.error || "Fel");
  }

  async function askAi() {
    setAiAnswer("Tänker...");
    const res = await fetch("/api/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: aiQuestion })
    });
    const json = await res.json();
    setAiAnswer(res.ok ? json.answer : json.error || "Fel");
  }

  const shell: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: 24, color: "#281414" };
  const hero: React.CSSProperties = { background: "linear-gradient(180deg,#5d0f18 0%,#861e2b 100%)", color: "white", borderRadius: 18, padding: 24, marginBottom: 18 };
  const card: React.CSSProperties = { background: "white", border: "1px solid #decbcd", borderRadius: 16, padding: 18, marginBottom: 16 };
  const nav = (active: boolean): React.CSSProperties => ({
    background: active ? "#7b1823" : "white",
    color: active ? "white" : "#7b1823",
    border: "1px solid #d4aaaf",
    borderRadius: 12,
    padding: "10px 14px",
    marginRight: 8,
    marginBottom: 8,
    cursor: "pointer",
    fontWeight: 700
  });
  const input: React.CSSProperties = { width: "100%", maxWidth: 420, padding: 10, borderRadius: 10, border: "1px solid #cfa7ac", marginBottom: 10 };
  const primary: React.CSSProperties = { background: "#7b1823", color: "white", border: 0, borderRadius: 12, padding: "10px 16px", cursor: "pointer", fontWeight: 700 };

  return (
    <div style={shell}>
      <div style={hero}>
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <Image src="/sodertorns-team-logo.svg" alt="Södertörns Team" width={240} height={82} />
          <div>
            <h1 style={{ margin: 0 }}>Södertörns Team</h1>
            <p style={{ marginBottom: 0 }}>Ren version. Loggan är separat. Gränssnittet är ombyggt.</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button style={nav(tab === "home")} onClick={() => setTab("home")}>Hem</button>
        <button style={nav(tab === "leads")} onClick={() => setTab("leads")}>Leads</button>
        <button style={nav(tab === "customers")} onClick={() => setTab("customers")}>Kunder</button>
        <button style={nav(tab === "orders")} onClick={() => setTab("orders")}>Order</button>
        <button style={nav(tab === "activities")} onClick={() => setTab("activities")}>Aktiviteter</button>
        <button style={nav(tab === "integrations")} onClick={() => setTab("integrations")}>Integrationer</button>
      </div>

      {tab === "home" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Företagslookup</h2>
            <input style={input} value={lookupQuery} onChange={(e) => setLookupQuery(e.target.value)} placeholder="Bolagsnamn eller org.nr" />
            <br />
            <button style={primary} onClick={companyLookup}>Hämta företag</button>
            <p>{lookupResult}</p>
          </div>

          <div style={card}>
            <h2 style={{ marginTop: 0 }}>AI-assistent</h2>
            <input style={input} value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} placeholder="Skriv fråga" />
            <br />
            <button style={primary} onClick={askAi}>Fråga</button>
            <p>{aiAnswer}</p>
          </div>
        </div>
      )}

      {tab === "leads" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Leads</h2>
          <ul>{leads.map((x, i) => <li key={i}>{x.company} - {x.contact} - {x.segment}</li>)}</ul>
        </div>
      )}

      {tab === "customers" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Kunder</h2>
          <button style={primary} onClick={sendLatestToFortnox}>Skicka senaste kund till Fortnox</button>
          <p>{fortnoxResult}</p>
          <ul>{customers.map((x, i) => <li key={i}>{x.name} - {x.orgNumber} - {x.city} - {x.segment}</li>)}</ul>
        </div>
      )}

      {tab === "orders" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Order</h2>
          <ul>{orders.map((x, i) => <li key={i}>{x.customer} - {x.text}</li>)}</ul>
        </div>
      )}

      {tab === "activities" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Aktiviteter</h2>
          <ul>{activities.map((x, i) => <li key={i}>{x.text}</li>)}</ul>
        </div>
      )}

      {tab === "integrations" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          <div style={card}><h2 style={{ marginTop: 0 }}>Fortnox</h2><p>Kundregister och överföring förberett.</p></div>
          <div style={card}><h2 style={{ marginTop: 0 }}>Telavox</h2><p>Samtal och historik förberett.</p></div>
          <div style={card}><h2 style={{ marginTop: 0 }}>ABR</h2><p>Tredje koppling förberedd.</p></div>
        </div>
      )}
    </div>
  );
}
