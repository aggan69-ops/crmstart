"use client";

import { useEffect, useState } from "react";

type Lead = { company: string; contact: string };
type Customer = { name: string; city: string };
type Order = { customer: string; text: string };
type Activity = { text: string };
type IntegrationForm = { baseUrl: string; apiKey: string; enabled: boolean };

const defaultLeads: Lead[] = [
  { company: "Nordtrafik Service AB", contact: "Anders Holm" },
  { company: "Stålverk Mekaniska", contact: "Maria Eng" }
];

const defaultCustomers: Customer[] = [
  { name: "Mälarfrakt AB", city: "Västerås" },
  { name: "Söder Verkstad", city: "Nykvarn" }
];

const defaultOrders: Order[] = [
  { customer: "Mälarfrakt AB", text: "Motorolja 5W30 20L" },
  { customer: "Söder Verkstad", text: "Kullager 6205" }
];

const defaultActivities: Activity[] = [
  { text: "Ring Anders Holm" },
  { text: "Skicka offert till Söder Verkstad" }
];

const defaultIntegration: IntegrationForm = {
  baseUrl: "",
  apiKey: "",
  enabled: false
};

export default function Page() {
  const [tab, setTab] = useState("home");

  const [leads, setLeads] = useState<Lead[]>(defaultLeads);
  const [customers, setCustomers] = useState<Customer[]>(defaultCustomers);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);

  const [leadCompany, setLeadCompany] = useState("");
  const [leadContact, setLeadContact] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerCity, setCustomerCity] = useState("");

  const [orderCustomer, setOrderCustomer] = useState("");
  const [orderText, setOrderText] = useState("");

  const [activityText, setActivityText] = useState("");

  const [fortnox, setFortnox] = useState<IntegrationForm>(defaultIntegration);
  const [telavox, setTelavox] = useState<IntegrationForm>(defaultIntegration);
  const [abr, setAbr] = useState<IntegrationForm>(defaultIntegration);

  const [fortnoxTest, setFortnoxTest] = useState("");
  const [telavoxTest, setTelavoxTest] = useState("");
  const [abrTest, setAbrTest] = useState("");

  useEffect(() => {
    const savedLeads = localStorage.getItem("crm_leads");
    const savedCustomers = localStorage.getItem("crm_customers");
    const savedOrders = localStorage.getItem("crm_orders");
    const savedActivities = localStorage.getItem("crm_activities");
    const savedFortnox = localStorage.getItem("crm_fortnox");
    const savedTelavox = localStorage.getItem("crm_telavox");
    const savedAbr = localStorage.getItem("crm_abr");

    if (savedLeads) setLeads(JSON.parse(savedLeads));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
    if (savedFortnox) setFortnox(JSON.parse(savedFortnox));
    if (savedTelavox) setTelavox(JSON.parse(savedTelavox));
    if (savedAbr) setAbr(JSON.parse(savedAbr));
  }, []);

  useEffect(() => localStorage.setItem("crm_leads", JSON.stringify(leads)), [leads]);
  useEffect(() => localStorage.setItem("crm_customers", JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem("crm_orders", JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem("crm_activities", JSON.stringify(activities)), [activities]);
  useEffect(() => localStorage.setItem("crm_fortnox", JSON.stringify(fortnox)), [fortnox]);
  useEffect(() => localStorage.setItem("crm_telavox", JSON.stringify(telavox)), [telavox]);
  useEffect(() => localStorage.setItem("crm_abr", JSON.stringify(abr)), [abr]);

  function addLead() {
    if (!leadCompany.trim() || !leadContact.trim()) return;
    setLeads([{ company: leadCompany.trim(), contact: leadContact.trim() }, ...leads]);
    setLeadCompany("");
    setLeadContact("");
  }

  function addCustomer() {
    if (!customerName.trim() || !customerCity.trim()) return;
    setCustomers([{ name: customerName.trim(), city: customerCity.trim() }, ...customers]);
    setCustomerName("");
    setCustomerCity("");
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

  async function testIntegration(name: "fortnox" | "telavox" | "abr") {
    const response = await fetch(`/api/integrations/${name}/test`, { method: "POST" });
    const json = await response.json();
    const text = response.ok ? json.message : json.error || "Fel";
    if (name === "fortnox") setFortnoxTest(text);
    if (name === "telavox") setTelavoxTest(text);
    if (name === "abr") setAbrTest(text);
  }

  function resetAll() {
    localStorage.clear();
    setLeads(defaultLeads);
    setCustomers(defaultCustomers);
    setOrders(defaultOrders);
    setActivities(defaultActivities);
    setFortnox(defaultIntegration);
    setTelavox(defaultIntegration);
    setAbr(defaultIntegration);
    setFortnoxTest("");
    setTelavoxTest("");
    setAbrTest("");
  }

  const shell = { maxWidth: 1180, margin: "0 auto", padding: 24, fontFamily: "Arial, sans-serif", color: "#2a1313" } as const;
  const hero = { background: "linear-gradient(180deg,#5b0f18 0%,#7b1823 100%)", color: "white", borderRadius: 18, padding: 24, marginBottom: 18 } as const;
  const navButton = (active: boolean) => ({
    background: active ? "#6f1120" : "#ffffff",
    color: active ? "#ffffff" : "#6f1120",
    border: "1px solid #b77a80",
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
    marginRight: 8,
    marginBottom: 8
  });
  const card = { background: "#ffffff", border: "1px solid #e0cfd1", borderRadius: 16, padding: 18, marginBottom: 16, boxShadow: "0 6px 20px rgba(91,15,24,0.05)" } as const;
  const input = { width: "100%", maxWidth: 420, padding: 10, borderRadius: 10, border: "1px solid #c7a8ac", marginBottom: 10 } as const;
  const action = { background: "#7b1823", color: "#ffffff", border: 0, borderRadius: 12, padding: "10px 16px", cursor: "pointer", fontWeight: 700 } as const;
  const secondary = { background: "#fff4f5", color: "#6f1120", border: "1px solid #d7b1b6", borderRadius: 12, padding: "10px 16px", cursor: "pointer", fontWeight: 700 } as const;
  const statWrap = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 16 } as const;
  const stat = { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 14, padding: 16 } as const;

  return (
    <div style={shell}>
      <div style={hero}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>CRM</h1>
        <p style={{ marginTop: 0, opacity: 0.95 }}>
          Enkel mörkröd version inspirerad av en tydlig produktkänsla som på oljat.se:
          stora rubriker, raka val, tydliga kategorier och fokus på säljflödet. citeturn505069view0
        </p>
        <div style={statWrap}>
          <div style={stat}><strong>Leads</strong><div>{leads.length}</div></div>
          <div style={stat}><strong>Kunder</strong><div>{customers.length}</div></div>
          <div style={stat}><strong>Order</strong><div>{orders.length}</div></div>
          <div style={stat}><strong>Aktiviteter</strong><div>{activities.length}</div></div>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <button style={navButton(tab === "home")} onClick={() => setTab("home")}>Hem</button>
        <button style={navButton(tab === "leads")} onClick={() => setTab("leads")}>Leads</button>
        <button style={navButton(tab === "customers")} onClick={() => setTab("customers")}>Kunder</button>
        <button style={navButton(tab === "orders")} onClick={() => setTab("orders")}>Order</button>
        <button style={navButton(tab === "activities")} onClick={() => setTab("activities")}>Aktiviteter</button>
        <button style={navButton(tab === "integrations")} onClick={() => setTab("integrations")}>API / Integrationer</button>
        <button style={navButton(tab === "settings")} onClick={() => setTab("settings")}>Inställningar</button>
      </div>

      {tab === "home" && (
        <div>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Översikt</h2>
            <p>Det här är en färdig bas med mörkröd UI, enkla knappar och förberedelse för Fortnox, Telavox och ABR.</p>
            <ul>
              <li>Leads och kunder kan läggas till direkt.</li>
              <li>Order och aktiviteter sparas i browsern.</li>
              <li>Tre integrationsblock finns klara för nästa steg.</li>
            </ul>
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
          <button style={action} onClick={addLead}>Lägg till lead</button>
          <ul>
            {leads.map((lead, i) => <li key={i}>{lead.company} - {lead.contact}</li>)}
          </ul>
        </div>
      )}

      {tab === "customers" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Kunder</h2>
          <input style={input} placeholder="Kundnamn" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <br />
          <input style={input} placeholder="Stad" value={customerCity} onChange={(e) => setCustomerCity(e.target.value)} />
          <br />
          <button style={action} onClick={addCustomer}>Lägg till kund</button>
          <ul>
            {customers.map((customer, i) => <li key={i}>{customer.name} - {customer.city}</li>)}
          </ul>
        </div>
      )}

      {tab === "orders" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Order</h2>
          <input style={input} placeholder="Kund" value={orderCustomer} onChange={(e) => setOrderCustomer(e.target.value)} />
          <br />
          <input style={input} placeholder="Ordertext" value={orderText} onChange={(e) => setOrderText(e.target.value)} />
          <br />
          <button style={action} onClick={addOrder}>Lägg till order</button>
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
          <button style={action} onClick={addActivity}>Lägg till aktivitet</button>
          <ul>
            {activities.map((activity, i) => <li key={i}>{activity.text}</li>)}
          </ul>
        </div>
      )}

      {tab === "integrations" && (
        <div>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Fortnox</h2>
            <input style={input} placeholder="Base URL" value={fortnox.baseUrl} onChange={(e) => setFortnox({ ...fortnox, baseUrl: e.target.value })} />
            <br />
            <input style={input} placeholder="API-nyckel / token" value={fortnox.apiKey} onChange={(e) => setFortnox({ ...fortnox, apiKey: e.target.value })} />
            <br />
            <button style={secondary} onClick={() => setFortnox({ ...fortnox, enabled: !fortnox.enabled })}>
              {fortnox.enabled ? "Stäng av" : "Aktivera"}
            </button>{" "}
            <button style={action} onClick={() => testIntegration("fortnox")}>Testa API</button>
            <p>Status: {fortnox.enabled ? "Aktiv" : "Inte aktiv"}</p>
            <p>{fortnoxTest}</p>
          </div>

          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Telavox</h2>
            <input style={input} placeholder="Base URL" value={telavox.baseUrl} onChange={(e) => setTelavox({ ...telavox, baseUrl: e.target.value })} />
            <br />
            <input style={input} placeholder="API-nyckel / token" value={telavox.apiKey} onChange={(e) => setTelavox({ ...telavox, apiKey: e.target.value })} />
            <br />
            <button style={secondary} onClick={() => setTelavox({ ...telavox, enabled: !telavox.enabled })}>
              {telavox.enabled ? "Stäng av" : "Aktivera"}
            </button>{" "}
            <button style={action} onClick={() => testIntegration("telavox")}>Testa API</button>
            <p>Status: {telavox.enabled ? "Aktiv" : "Inte aktiv"}</p>
            <p>{telavoxTest}</p>
          </div>

          <div style={card}>
            <h2 style={{ marginTop: 0 }}>ABR</h2>
            <input style={input} placeholder="Base URL" value={abr.baseUrl} onChange={(e) => setAbr({ ...abr, baseUrl: e.target.value })} />
            <br />
            <input style={input} placeholder="API-nyckel / token" value={abr.apiKey} onChange={(e) => setAbr({ ...abr, apiKey: e.target.value })} />
            <br />
            <button style={secondary} onClick={() => setAbr({ ...abr, enabled: !abr.enabled })}>
              {abr.enabled ? "Stäng av" : "Aktivera"}
            </button>{" "}
            <button style={action} onClick={() => testIntegration("abr")}>Testa API</button>
            <p>Status: {abr.enabled ? "Aktiv" : "Inte aktiv"}</p>
            <p>{abrTest}</p>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Inställningar</h2>
          <button style={secondary} onClick={resetAll}>Återställ allt</button>
        </div>
      )}
    </div>
  );
}
