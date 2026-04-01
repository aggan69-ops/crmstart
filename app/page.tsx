"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DEMO_MODE, hasSupabase } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type SectionKey = "dashboard" | "pipeline" | "leads" | "customers" | "orders" | "quotes" | "tasks" | "calls" | "sync" | "integrations" | "admin";
type Lead = { id: string; company: string; contact: string; segment: string; status: "Ny" | "Kontaktad" | "Offert" | "Affär" | "Förlorad" };
type Customer = { id: string; name: string; orgNumber: string; city: string; segment: string; email?: string; hot?: boolean };
type Supplier = { id: string; name: string };
type Order = { id: string; customer: string; supplier: string; text: string; status: "Utkast" | "Skickad" | "Fakturerad" };
type QuoteDraft = { id: string; customer: string; title: string; text: string; status: "Utkast" | "Skickad" };
type Task = { id: string; title: string; due: string; owner: string; status: "Öppen" | "Klar" };
type SyncItem = { id: string; customerName: string; field: string; oldValue: string; newValue: string; status: "Pending" | "Approved" | "Rejected" };
type CallNote = { id: string; phone: string; customerName: string; note: string; savedAt: string; source: "Telavox" | "Teams Calling" | "Manual" };
type Audit = { id: string; text: string; at: string };
type User = { id: string; name: string; email: string; password: string; role: "admin" | "employee"; permissions: Record<SectionKey, boolean> };

const defaultLeads: Lead[] = [
  { id: "lead-1", company: "Nordtrafik Service AB", contact: "Anders Holm", segment: "Transport", status: "Ny" },
  { id: "lead-2", company: "Stålverk Mekaniska", contact: "Maria Eng", segment: "Verkstad", status: "Kontaktad" }
];
const defaultCustomers: Customer[] = [
  { id: "cust-1", name: "Mälarfrakt AB", orgNumber: "556123-1111", city: "Västerås", segment: "Transport", email: "info@malarfrakt.se", hot: true },
  { id: "cust-2", name: "Söder Verkstad", orgNumber: "556123-2222", city: "Nykvarn", segment: "Verkstad", email: "order@soderverkstad.se", hot: false }
];
const defaultOrders: Order[] = [
  { id: "ord-1", customer: "Mälarfrakt AB", supplier: "LubriTech Nordic", text: "Motorolja 5W30 20L", status: "Utkast" }
];
const defaultQuotes: QuoteDraft[] = [
  { id: "quote-1", customer: "Mälarfrakt AB", title: "Olja + filter april", text: "Prisförslag på 5W30 och filterpaket.", status: "Utkast" }
];
const defaultTasks: Task[] = [
  { id: "task-1", title: "Följ upp Mälarfrakt", due: "2026-04-03", owner: "Säljare", status: "Öppen" }
];
const defaultSyncQueue: SyncItem[] = [
  { id: "sync-1", customerName: "Mälarfrakt AB", field: "E-post", oldValue: "gammal@malarfrakt.se", newValue: "info@malarfrakt.se", status: "Pending" }
];
const defaultCallNotes: CallNote[] = [
  { id: "call-1", phone: "0701234567", customerName: "Mälarfrakt AB", note: "Ville ha pris på 5W30 och filter", savedAt: "2026-04-01 09:12", source: "Telavox" }
];
const defaultAudit: Audit[] = [{ id: "audit-1", text: "System startat", at: "2026-04-01 08:00" }];
const suppliers: Supplier[] = [
  { id: "sup-1", name: "SKF Distributionspartner" },
  { id: "sup-2", name: "LubriTech Nordic" }
];
const defaultAdmin: User = {
  id: "u-admin", name: "Admin", email: "admin@sodertornsteam.se", password: "admin123", role: "admin",
  permissions: { dashboard: true, pipeline: true, leads: true, customers: true, orders: true, quotes: true, tasks: true, calls: true, sync: true, integrations: true, admin: true }
};
const defaultEmployee: User = {
  id: "u-employee", name: "Säljare", email: "salj@sodertornsteam.se", password: "1234", role: "employee",
  permissions: { dashboard: true, pipeline: true, leads: true, customers: true, orders: true, quotes: true, tasks: true, calls: true, sync: false, integrations: false, admin: false }
};

function pill(on: boolean): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 12,
    background: on ? "#eaf8ef" : "#fdeceb",
    color: on ? "#198754" : "#c1121f",
    marginBottom: 10
  };
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([defaultAdmin, defaultEmployee]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [tab, setTab] = useState<SectionKey>("dashboard");
  const [authInfo, setAuthInfo] = useState("");

  const [leads, setLeads] = useState(defaultLeads);
  const [customers, setCustomers] = useState(defaultCustomers);
  const [orders, setOrders] = useState(defaultOrders);
  const [quotes, setQuotes] = useState(defaultQuotes);
  const [tasks, setTasks] = useState(defaultTasks);
  const [syncQueue, setSyncQueue] = useState(defaultSyncQueue);
  const [callNotes, setCallNotes] = useState(defaultCallNotes);
  const [audit, setAudit] = useState(defaultAudit);

  const [email, setEmail] = useState("admin@sodertornsteam.se");
  const [password, setPassword] = useState("admin123");
  const [loginMessage, setLoginMessage] = useState("");

  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupMessage, setLookupMessage] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadContact, setNewLeadContact] = useState("");
  const [newLeadSegment, setNewLeadSegment] = useState("Transport");
  const [newOrderCustomer, setNewOrderCustomer] = useState(defaultCustomers[0]?.name || "");
  const [newOrderSupplier, setNewOrderSupplier] = useState(suppliers[0]?.name || "");
  const [newOrderText, setNewOrderText] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [invoiceMessage, setInvoiceMessage] = useState("");
  const [fortnoxMessage, setFortnoxMessage] = useState("");

  const [newQuoteCustomer, setNewQuoteCustomer] = useState(defaultCustomers[0]?.name || "");
  const [newQuoteTitle, setNewQuoteTitle] = useState("");
  const [newQuoteText, setNewQuoteText] = useState("");

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("2026-04-03");

  const [callPhone, setCallPhone] = useState("0701234567");
  const [callCustomerName, setCallCustomerName] = useState("Mälarfrakt AB");
  const [callSource, setCallSource] = useState<CallNote["source"]>("Telavox");
  const [callLiveNote, setCallLiveNote] = useState("");
  const [callSaveMessage, setCallSaveMessage] = useState("");

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [integrationInfo, setIntegrationInfo] = useState<Record<string, string>>({ fortnox: "", office365: "", teams: "", telavox: "", catalog: "", brent: "" });

  const currentUser = useMemo(() => users.find((x) => x.id === currentUserId) || null, [users, currentUserId]);

  useEffect(() => {
    const raw = localStorage.getItem("crm_production_ready_state");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.currentUserId) setCurrentUserId(parsed.currentUserId);
    if (parsed.leads) setLeads(parsed.leads);
    if (parsed.customers) setCustomers(parsed.customers);
    if (parsed.orders) setOrders(parsed.orders);
    if (parsed.quotes) setQuotes(parsed.quotes);
    if (parsed.tasks) setTasks(parsed.tasks);
    if (parsed.syncQueue) setSyncQueue(parsed.syncQueue);
    if (parsed.callNotes) setCallNotes(parsed.callNotes);
    if (parsed.audit) setAudit(parsed.audit);
  }, []);

  useEffect(() => {
    localStorage.setItem("crm_production_ready_state", JSON.stringify({
      currentUserId, leads, customers, orders, quotes, tasks, syncQueue, callNotes, audit
    }));
  }, [currentUserId, leads, customers, orders, quotes, tasks, syncQueue, callNotes, audit]);

  useEffect(() => {
    setAuthInfo(DEMO_MODE ? "Demo mode är på." : hasSupabase() ? "Supabase är konfigurerat." : "Supabase-nycklar saknas.");
  }, []);

  function logEvent(text: string) {
    setAudit((prev) => [{ id: "audit-" + Date.now(), text, at: new Date().toLocaleString("sv-SE") }, ...prev]);
  }

  async function login() {
    if (!DEMO_MODE && hasSupabase()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setLoginMessage(error.message);
          return;
        }
        setLoginMessage("Inloggad via Supabase.");
        return;
      }
    }
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!found) return setLoginMessage("Fel e-post eller lösenord.");
    setCurrentUserId(found.id);
    setLoginMessage(`Inloggad som ${found.name}`);
    logEvent(`${found.name} loggade in`);
  }

  function logout() {
    if (currentUser) logEvent(`${currentUser.name} loggade ut`);
    setCurrentUserId("");
    setLoginMessage("");
  }

  async function lookupCompany() {
    setLookupMessage("Söker...");
    const res = await fetch("/api/company-lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: lookupQuery }) });
    const json = await res.json();
    if (!res.ok) return setLookupMessage(json.error || "Fel");
    setCustomers([json.company, ...customers]);
    logEvent(`Kund tillagd från lookup: ${json.company.name}`);
    setLookupMessage(`Tillagd som kund: ${json.company.name}`);
  }

  function addLead() {
    if (!newLeadCompany.trim() || !newLeadContact.trim()) return;
    setLeads([{ id: "lead-" + Date.now(), company: newLeadCompany.trim(), contact: newLeadContact.trim(), segment: newLeadSegment, status: "Ny" }, ...leads]);
    logEvent(`Lead skapad: ${newLeadCompany.trim()}`);
    setNewLeadCompany(""); setNewLeadContact("");
  }

  async function createOrder() {
    if (!newOrderCustomer || !newOrderSupplier || !newOrderText.trim()) return;
    setOrderMessage("Skickar...");
    const res = await fetch("/api/fortnox/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer: newOrderCustomer, supplier: newOrderSupplier, text: newOrderText }) });
    const json = await res.json();
    if (!res.ok) return setOrderMessage(json.error || "Fel");
    setOrders([{ id: "ord-" + Date.now(), customer: newOrderCustomer, supplier: newOrderSupplier, text: newOrderText, status: "Skickad" }, ...orders]);
    setNewOrderText(""); setOrderMessage(json.message);
  }

  async function createInvoice(order: Order) {
    const res = await fetch("/api/fortnox/create-invoice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order }) });
    const json = await res.json();
    if (!res.ok) return setInvoiceMessage(json.error || "Fel");
    setOrders((prev) => prev.map((x) => x.id === order.id ? { ...x, status: "Fakturerad" } : x));
    setInvoiceMessage(json.message);
  }

  async function sendLatestCustomerToFortnox() {
    if (!customers.length) return;
    const res = await fetch("/api/fortnox/send-customer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer: customers[0] }) });
    const json = await res.json();
    setFortnoxMessage(res.ok ? json.message : json.error || "Fel");
  }

  function createQuote() {
    if (!newQuoteCustomer || !newQuoteTitle.trim() || !newQuoteText.trim()) return;
    setQuotes([{ id: "quote-" + Date.now(), customer: newQuoteCustomer, title: newQuoteTitle.trim(), text: newQuoteText.trim(), status: "Utkast" }, ...quotes]);
    setNewQuoteTitle(""); setNewQuoteText("");
  }

  function sendQuote(id: string) {
    setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status: "Skickad" } : q));
  }

  function createTask() {
    if (!newTaskTitle.trim()) return;
    setTasks([{ id: "task-" + Date.now(), title: newTaskTitle.trim(), due: newTaskDue, owner: currentUser?.name || "Okänd", status: "Öppen" }, ...tasks]);
    setNewTaskTitle("");
  }

  function completeTask(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "Klar" } : t));
  }

  function autoSaveCall() {
    const item: CallNote = { id: "call-" + Date.now(), phone: callPhone, customerName: callCustomerName, note: callLiveNote, savedAt: new Date().toLocaleString("sv-SE"), source: callSource };
    setCallNotes([item, ...callNotes]);
    setCallSaveMessage("Samtal autosparat.");
    setCallLiveNote("");
  }

  function approveSync(id: string) { setSyncQueue((prev) => prev.map((x) => x.id === id ? { ...x, status: "Approved" } : x)); }
  function rejectSync(id: string) { setSyncQueue((prev) => prev.map((x) => x.id === id ? { ...x, status: "Rejected" } : x)); }

  async function askAI() {
    setAiAnswer("Tänker...");
    const res = await fetch("/api/ai-assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: aiQuestion }) });
    const json = await res.json();
    setAiAnswer(res.ok ? json.answer : json.error || "Fel");
  }

  async function loadIntegration(provider: "fortnox" | "office365" | "teams" | "telavox" | "catalog" | "brent") {
    const map = {
      fortnox: "/api/integrations/fortnox/status",
      office365: "/api/integrations/office365/status",
      teams: "/api/integrations/teams/status",
      telavox: "/api/integrations/telavox/status",
      catalog: "/api/integrations/catalog/status",
      brent: "/api/integrations/brent/status"
    };
    const res = await fetch(map[provider]);
    const json = await res.json();
    setIntegrationInfo((prev) => ({ ...prev, [provider]: json.message || JSON.stringify(json) }));
  }

  const allowedSections = currentUser ? (Object.keys(currentUser.permissions) as SectionKey[]).filter((x) => currentUser.permissions[x]) : [];
  const pipelineCols = ["Ny", "Kontaktad", "Offert", "Affär", "Förlorad"] as const;

  const shell: React.CSSProperties = { maxWidth: 1360, margin: "0 auto", padding: 24, color: "#141414" };
  const sidebar: React.CSSProperties = { width: 250, background: "#111214", color: "white", borderRadius: 24, padding: 18, minHeight: "calc(100vh - 48px)" };
  const appWrap: React.CSSProperties = { display: "grid", gridTemplateColumns: "250px 1fr", gap: 18 };
  const hero: React.CSSProperties = { background: "#ffffff", borderRadius: 24, padding: 22, border: "1px solid #e6e6e6", marginBottom: 18 };
  const card: React.CSSProperties = { background: "#ffffff", border: "1px solid #e6e6e6", borderRadius: 20, padding: 18, marginBottom: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.05)" };
  const input: React.CSSProperties = { width: "100%", maxWidth: 460, padding: 12, borderRadius: 12, border: "1px solid #d6d6d6", marginBottom: 10, background: "#fff" };
  const primary: React.CSSProperties = { background: "#b01422", color: "white", border: 0, borderRadius: 14, padding: "11px 16px", cursor: "pointer", fontWeight: 700 };
  const soft: React.CSSProperties = { background: "#ffffff", color: "#111214", border: "1px solid #d6d6d6", borderRadius: 14, padding: "11px 16px", cursor: "pointer", fontWeight: 700 };
  const sideBtn = (active: boolean): React.CSSProperties => ({ width: "100%", textAlign: "left", background: active ? "#b01422" : "transparent", color: "white", border: "1px solid " + (active ? "#b01422" : "#2a2d33"), borderRadius: 14, padding: "12px 14px", marginBottom: 8, cursor: "pointer", fontWeight: 700 });

  if (!currentUser) {
    return (
      <div style={shell}>
        <div style={{ maxWidth: 700, margin: "60px auto" }}>
          <div style={{ ...card, padding: 28 }}>
            <Image src="/sodertorns-team-logo.svg" alt="Södertörns Team" width={220} height={60} />
            <h1>Logga in</h1>
            <p>{authInfo}</p>
            <p><strong>Admin:</strong> admin@sodertornsteam.se / admin123</p>
            <p><strong>Anställd:</strong> salj@sodertornsteam.se / 1234</p>
            <input style={input} placeholder="E-post" value={email} onChange={(e) => setEmail(e.target.value)} />
            <br />
            <input style={input} placeholder="Lösenord" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button style={primary} onClick={login}>Logga in</button>
            <p>{loginMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={shell}>
      <div style={appWrap}>
        <aside style={sidebar}>
          <div style={{ marginBottom: 18 }}>
            <Image src="/sodertorns-team-logo.svg" alt="Södertörns Team" width={190} height={52} />
            <div style={{ marginTop: 12, fontSize: 14, opacity: 0.9 }}>{currentUser.name} · {currentUser.role}</div>
          </div>
          {allowedSections.map((section) => (
            <button key={section} style={sideBtn(tab === section)} onClick={() => setTab(section)}>{section}</button>
          ))}
          <div style={{ marginTop: 20 }}>
            <button style={{ ...soft, width: "100%" }} onClick={logout}>Logga ut</button>
          </div>
        </aside>

        <main>
          <div style={hero}>
            <h1 style={{ marginTop: 0, marginBottom: 8 }}>Production ready</h1>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={pill(true)}>På: Fortnox server-side</span>
              <span style={pill(true)}>På: SQL-schema</span>
              <span style={pill(DEMO_MODE)}>{DEMO_MODE ? "På: demo mode" : "Av: demo mode"}</span>
            </div>
          </div>

          {tab === "dashboard" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
                <div style={card}><div style={{ color: "#666" }}>Leads</div><div style={{ fontSize: 30, fontWeight: 800 }}>{leads.length}</div></div>
                <div style={card}><div style={{ color: "#666" }}>Kunder</div><div style={{ fontSize: 30, fontWeight: 800 }}>{customers.length}</div></div>
                <div style={card}><div style={{ color: "#666" }}>Order</div><div style={{ fontSize: 30, fontWeight: 800 }}>{orders.length}</div></div>
                <div style={card}><div style={{ color: "#666" }}>Tasks</div><div style={{ fontSize: 30, fontWeight: 800 }}>{tasks.filter(t => t.status === "Öppen").length}</div></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={card}><h2 style={{ marginTop: 0 }}>Hotlist</h2><ul>{customers.filter(c => c.hot).map(c => <li key={c.id}>{c.name}</li>)}</ul></div>
                <div style={card}><h2 style={{ marginTop: 0 }}>Audit log</h2><ul>{audit.slice(0, 5).map(a => <li key={a.id}>{a.at} - {a.text}</li>)}</ul></div>
              </div>
            </>
          )}

          {tab === "pipeline" && <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>{pipelineCols.map(col => <div key={col} style={card}><h2 style={{ marginTop: 0 }}>{col}</h2><ul>{leads.filter(l => l.status === col).map(l => <li key={l.id}>{l.company}</li>)}</ul></div>)}</div>}

          {tab === "leads" && <div style={card}><h2 style={{ marginTop: 0 }}>Leads</h2><input style={input} placeholder="Företag" value={newLeadCompany} onChange={(e) => setNewLeadCompany(e.target.value)} /><br /><input style={input} placeholder="Kontakt" value={newLeadContact} onChange={(e) => setNewLeadContact(e.target.value)} /><br /><select style={input} value={newLeadSegment} onChange={(e) => setNewLeadSegment(e.target.value)}><option>Transport</option><option>Verkstad</option><option>Industri</option><option>Övrigt</option></select><br /><button style={primary} onClick={addLead}>Lägg till lead</button></div>}

          {tab === "customers" && <div style={card}><h2 style={{ marginTop: 0 }}>Kunder</h2><input style={input} placeholder="Sök bolag eller org.nr" value={lookupQuery} onChange={(e) => setLookupQuery(e.target.value)} /><br /><button style={primary} onClick={lookupCompany}>Hämta och kategorisera</button>{" "}<button style={soft} onClick={sendLatestCustomerToFortnox}>Skicka senaste kund till Fortnox</button><p>{lookupMessage}</p><p>{fortnoxMessage}</p><ul>{customers.map(c => <li key={c.id}>{c.name} - {c.segment}</li>)}</ul></div>}

          {tab === "orders" && <div style={card}><h2 style={{ marginTop: 0 }}>Ordersystem</h2><select style={input} value={newOrderCustomer} onChange={(e) => setNewOrderCustomer(e.target.value)}>{customers.map(c => <option key={c.id}>{c.name}</option>)}</select><br /><select style={input} value={newOrderSupplier} onChange={(e) => setNewOrderSupplier(e.target.value)}>{suppliers.map(s => <option key={s.id}>{s.name}</option>)}</select><br /><input style={input} placeholder="Artikel / text" value={newOrderText} onChange={(e) => setNewOrderText(e.target.value)} /><br /><button style={primary} onClick={createOrder}>Skicka order</button><p>{orderMessage}</p><p>{invoiceMessage}</p><ul>{orders.map(o => <li key={o.id}>{o.customer} - {o.text} - {o.status} {o.status !== "Fakturerad" && <button style={soft} onClick={() => createInvoice(o)}>Fakturera</button>}</li>)}</ul></div>}

          {tab === "quotes" && <div style={card}><h2 style={{ marginTop: 0 }}>Offerter</h2><select style={input} value={newQuoteCustomer} onChange={(e) => setNewQuoteCustomer(e.target.value)}>{customers.map(c => <option key={c.id}>{c.name}</option>)}</select><br /><input style={input} placeholder="Titel" value={newQuoteTitle} onChange={(e) => setNewQuoteTitle(e.target.value)} /><br /><textarea style={{ ...input, minHeight: 120 }} placeholder="Offertutkast" value={newQuoteText} onChange={(e) => setNewQuoteText(e.target.value)} /><br /><button style={primary} onClick={createQuote}>Skapa offertutkast</button><ul>{quotes.map(q => <li key={q.id}>{q.customer} - {q.title} - {q.status} {q.status !== "Skickad" && <button style={soft} onClick={() => sendQuote(q.id)}>Skicka</button>}</li>)}</ul></div>}

          {tab === "tasks" && <div style={card}><h2 style={{ marginTop: 0 }}>Tasks</h2><input style={input} placeholder="Task" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} /><br /><input style={input} type="date" value={newTaskDue} onChange={(e) => setNewTaskDue(e.target.value)} /><br /><button style={primary} onClick={createTask}>Skapa task</button><ul>{tasks.map(t => <li key={t.id}>{t.title} - {t.due} - {t.status} {t.status !== "Klar" && <button style={soft} onClick={() => completeTask(t.id)}>Klar</button>}</li>)}</ul></div>}

          {tab === "calls" && <div style={card}><h2 style={{ marginTop: 0 }}>Samtal</h2><input style={input} placeholder="Telefonnummer" value={callPhone} onChange={(e) => setCallPhone(e.target.value)} /><br /><input style={input} placeholder="Kundnamn" value={callCustomerName} onChange={(e) => setCallCustomerName(e.target.value)} /><br /><select style={input} value={callSource} onChange={(e) => setCallSource(e.target.value as CallNote["source"])}><option>Telavox</option><option>Teams Calling</option><option>Manual</option></select><br /><textarea style={{ ...input, minHeight: 120 }} placeholder="Skriv notering" value={callLiveNote} onChange={(e) => setCallLiveNote(e.target.value)} /><br /><button style={primary} onClick={autoSaveCall}>Autospara samtal</button><p>{callSaveMessage}</p><ul>{callNotes.map(c => <li key={c.id}>{c.customerName} - {c.phone}</li>)}</ul></div>}

          {tab === "sync" && <div style={card}><h2 style={{ marginTop: 0 }}>Synk-kö</h2><ul>{syncQueue.map(item => <li key={item.id}>{item.customerName} - {item.field} - {item.status} {item.status === "Pending" && <><button style={soft} onClick={() => approveSync(item.id)}>Godkänn</button>{" "}<button style={soft} onClick={() => rejectSync(item.id)}>Avvisa</button></>}</li>)}</ul></div>}

          {tab === "integrations" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>{(["fortnox","office365","teams","telavox","catalog","brent"] as const).map(key => <div key={key} style={card}><h2 style={{ marginTop: 0 }}>{key}</h2><div style={pill(Boolean(integrationInfo[key]))}>{integrationInfo[key] ? "På" : "Av"}</div><button style={primary} onClick={() => loadIntegration(key)}>Ladda status</button><p>{integrationInfo[key]}</p></div>)}</div>}

          {tab === "admin" && <div style={card}><h2 style={{ marginTop: 0 }}>Admin</h2><input style={input} placeholder="Namn" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} /><br /><input style={input} placeholder="E-post" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} /><br /><input style={input} placeholder="Lösenord" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} /><br /><select style={input} value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as "admin" | "employee")}><option value="employee">Anställd</option><option value="admin">Admin</option></select><br /><button style={primary} onClick={createUser}>Skapa användare</button><p>{adminMessage}</p></div>}
        </main>
      </div>
    </div>
  );
}
