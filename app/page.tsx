"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Lead = { company: string; contact: string; segment: string };
type Customer = {
  name: string;
  orgNumber: string;
  city: string;
  segment: string;
  revenue?: string;
  employees?: string;
};
type Order = { customer: string; text: string };
type Activity = { text: string };

const defaultLeads: Lead[] = [
  { company: "Nordtrafik Service AB", contact: "Anders Holm", segment: "Transport" },
  { company: "Stålverk Mekaniska", contact: "Maria Eng", segment: "Verkstad" }
];

const defaultCustomers: Customer[] = [
  { name: "Mälarfrakt AB", orgNumber: "556123-1111", city: "Västerås", segment: "Transport", revenue: "45 MSEK", employees: "23" },
  { name: "Söder Verkstad", orgNumber: "556123-2222", city: "Nykvarn", segment: "Verkstad", revenue: "12 MSEK", employees: "9" }
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

  const [lookupInput, setLookupInput] = useState("");
  const [lookupResult, setLookupResult] = useState("");
  const [lookupPayload, setLookupPayload] = useState<Customer | null>(null);

  const [fortnoxResult, setFortnoxResult] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiResult, setAiResult] = useState("");

  const [leadCompany, setLeadCompany] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [leadSegment, setLeadSegment] = useState("Transport");

  const [orderCustomer, setOrderCustomer] = useState("");
  const [orderText, setOrderText] = useState("");

  const [activityText, setActivityText] = useState("");

  useEffect(() => {
    const savedLeads = localStorage.getItem("crm_leads");
    const savedCustomers = localStorage.getItem("crm_customers");
    const savedOrders = localStorage.getItem("crm_orders");
    const savedActivities = localStorage.getItem("crm_activities");
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
  }, []);

  useEffect(() => localStorage.setItem("crm_leads", JSON.stringify(leads)), [leads]);
  useEffect(() => localStorage.setItem("crm_customers", JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem("crm_orders", JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem("crm_activities", JSON.stringify(activities)), [activities]);

  function addLead() {
    if (!leadCompany.trim() || !leadContact.trim()) return;
    setLeads([{ company: leadCompany.trim(), contact: leadContact.trim(), segment: leadSegment }, ...leads]);
    setLeadCompany("");
    setLeadContact("");
  }

  function addOrder() {
    if (!orderCustomer.trim() || !orderText.trim()) return;
    setOrders([{ customer: orderCustomer.trim(), text: orderText.trim() }, ...orders]);
    setOrderCustomer("");
    setOrderText("");
  }

  function addActivity() {
    if (!activityText.trim()) return;
    setActivities([{ text: activityText.trim() }, ...activities]);
    setActivityText("");
  }

  async function runLookup() {
    setLookupResult("Söker...");
    const response = await fetch("/api/company-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: lookupInput })
    });
    const json = await response.json();
    if (!response.ok) {
      setLookupResult(json.error || "Fel vid lookup");
      return;
    }
    setLookupPayload(json.company);
    setLookupResult(`Hittade ${json.company.name} (${json.company.segment})`);
  }

  function addLookupAsCustomer() {
    if (!lookupPayload) return;
    setCustomers([lookupPayload, ...customers]);
    setActivities([{ text: `Ny kund tillagd från lookup: ${lookupPayload.name}` }, ...activities]);
    setLookupResult(`Tillagd som kund: ${lookupPayload.name}`);
  }

  async function sendToFortnox(customer: Customer) {
    setFortnoxResult("Skickar...");
    const response = await fetch("/api/fortnox/send-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer })
    });
    const json = await response.json();
    setFortnoxResult(response.ok ? json.message : json.error || "Fel");
  }

  async function askAI() {
    setAiResult("Tänker...");
    const response = await fetch("/api/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: aiInput, customers, leads, orders })
    });
    const json = await response.json();
    setAiResult(response.ok ? json.answer : json.error || "Fel");
  }

  const shell: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: 24, color: "#2b1616" };
  const hero: React.CSSProperties = {
    background: "linear-gradient(180deg,#5c0f17 0%,#7d1623 100%)",
    color: "white",
    borderRadius: 20,
    padding: 24,
    marginBottom: 18
  };
  const card: React.CSSProperties = {
    background: "white",
    borderRadius: 16,
    border: "1px solid #dfcbce",
    padding: 18,
    marginBottom: 16,
    boxShadow: "0 10px 25px rgba(90,15,23,0.08)"
  };
  const input: React.CSSProperties = {
    width: "100%",
    maxWidth: 420,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #c6a5aa",
    marginBottom: 10
  };
  const primary: React.CSSProperties = {
    background: "#7d1623",
    color: "white",
    border: 0,
    borderRadius: 12,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700
  };
  const soft: React.CSSProperties = {
    background: "#fff2f3",
    color: "#7d1623",
    border: "1px solid #d8b4b9",
    borderRadius: 12,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700
  };
  const nav = (active: boolean): React.CSSProperties => ({
    background: active ? "#7d1623" : "white",
    color: active ? "white" : "#7d1623",
    border: "1px solid #d2a4aa",
    borderRadius: 12,
    padding: "10px 14px",
    marginRight: 8,
    marginBottom: 8,
    cursor: "pointer",
    fontWeight: 700
  });

  return (
    <div style={shell}>
      <div style={hero}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ minWidth: 120 }}>
            <Image
              src="/sodertorns-team-logo.png"
              alt="Södertörns Team"
              width={120}
              height={120}
              style={{ width: 120, height: 120, objectFit: "contain", borderRadius: 14 }}
            />
          </div>
          <div>
            <h1 style={{ marginTop: 0, marginBottom: 8 }}>Södertörns Team</h1>
            <p style={{ marginTop: 0, opacity: 0.95 }}>
              CRM för transport, verkstad och industri. Mörkröd premiumkänsla med tydliga val, raka knappar
              och fokus på kundarbete, lookup och Fortnox-flöde.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <button style={nav(tab === "home")} onClick={() => setTab("home")}>Hem</button>
        <button style={nav(tab === "leads")} onClick={() => setTab("leads")}>Leads</button>
        <button style={nav(tab === "customers")} onClick={() => setTab("customers")}>Kunder</button>
        <button style={nav(tab === "orders")} onClick={() => setTab("orders")}>Order</button>
        <button style={nav(tab === "activities")} onClick={() => setTab("activities")}>Aktiviteter</button>
        <button style={nav(tab === "integrations")} onClick={() => setTab("integrations")}>Integrationer</button>
      </div>

      {tab === "home" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Företagskontroll</h2>
            <p>Skriv bolagsnamn eller org.nr. Den här versionen använder lokal segmentlogik och visar hur flödet ska fungera.</p>
            <input
              style={input}
              placeholder="Bolagsnamn eller org.nr"
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
            />
            <br />
            <button style={primary} onClick={runLookup}>Sök företag</button>{" "}
            <button style={soft} onClick={addLookupAsCustomer}>Lägg till som kund</button>
            <p>{lookupResult}</p>
            {lookupPayload && (
              <div>
                <div><strong>Namn:</strong> {lookupPayload.name}</div>
                <div><strong>Org.nr:</strong> {lookupPayload.orgNumber}</div>
                <div><strong>Stad:</strong> {lookupPayload.city}</div>
                <div><strong>Segment:</strong> {lookupPayload.segment}</div>
                <div><strong>Omsättning:</strong> {lookupPayload.revenue}</div>
                <div><strong>Anställda:</strong> {lookupPayload.employees}</div>
              </div>
            )}
          </div>

          <div style={card}>
            <h2 style={{ marginTop: 0 }}>ChatGPT-assistent</h2>
            <p>Ställ frågor direkt från landningssidan.</p>
            <input
              style={input}
              placeholder="Skriv din fråga"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />
            <br />
            <button style={primary} onClick={askAI}>Fråga</button>
            <p style={{ whiteSpace: "pre-wrap" }}>{aiResult}</p>
          </div>
        </div>
      )}

      {tab === "leads" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Leads</h2>
          <input style={input} placeholder="Företag" value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} />
          <br />
          <input style={input} placeholder="Kontakt" value={leadContact} onChange={(e) => setLeadContact(e.target.value)} />
          <br />
          <select style={input} value={leadSegment} onChange={(e) => setLeadSegment(e.target.value)}>
            <option>Transport</option>
            <option>Verkstad</option>
            <option>Industri</option>
            <option>Övrigt</option>
          </select>
          <br />
          <button style={primary} onClick={addLead}>Lägg till lead</button>
          <ul>
            {leads.map((lead, i) => <li key={i}>{lead.company} - {lead.contact} - {lead.segment}</li>)}
          </ul>
        </div>
      )}

      {tab === "customers" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Kunder</h2>
          <ul>
            {customers.map((customer, i) => (
              <li key={i}>
                {customer.name} - {customer.orgNumber} - {customer.city} - {customer.segment}
                {" "}
                <button style={soft} onClick={() => sendToFortnox(customer)}>Skicka till Fortnox</button>
              </li>
            ))}
          </ul>
          <p>{fortnoxResult}</p>
        </div>
      )}

      {tab === "orders" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Order</h2>
          <input style={input} placeholder="Kund" value={orderCustomer} onChange={(e) => setOrderCustomer(e.target.value)} />
          <br />
          <input style={input} placeholder="Ordertext" value={orderText} onChange={(e) => setOrderText(e.target.value)} />
          <br />
          <button style={primary} onClick={addOrder}>Lägg till order</button>
          <ul>
            {orders.map((order, i) => <li key={i}>{order.customer} - {order.text}</li>)}
          </ul>
        </div>
      )}

      {tab === "activities" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Aktiviteter</h2>
          <input style={input} placeholder="Aktivitet" value={activityText} onChange={(e) => setActivityText(e.target.value)} />
          <br />
          <button style={primary} onClick={addActivity}>Lägg till aktivitet</button>
          <ul>
            {activities.map((activity, i) => <li key={i}>{activity.text}</li>)}
          </ul>
        </div>
      )}

      {tab === "integrations" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Fortnox</h2>
            <p>Förberett för kundregister, artiklar och order.</p>
            <div><code>/api/integrations/fortnox/status</code></div>
            <div><code>/api/fortnox/send-customer</code></div>
          </div>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Telavox</h2>
            <p>Förberett för samtal, historik och kontaktkort.</p>
            <div><code>/api/integrations/telavox/status</code></div>
          </div>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>ABR</h2>
            <p>Förberett som tredje koppling. Nästa steg är att mappa exakt datamodell och endpoints.</p>
            <div><code>/api/integrations/abr/status</code></div>
          </div>
        </div>
      )}
    </div>
  );
}
