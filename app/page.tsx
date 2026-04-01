"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type SectionKey = "dashboard" | "pipeline" | "leads" | "customers" | "orders" | "quotes" | "tasks" | "calls" | "sync" | "integrations" | "admin";
type WidgetKey = "stats" | "quickActions" | "recentLeads" | "syncQueue" | "incomingCall" | "brent" | "catalog" | "ai" | "today" | "hotlist" | "quotes";

type Lead = { id: string; company: string; contact: string; segment: string; status: "Ny" | "Kontaktad" | "Offert" | "Affär" | "Förlorad" };
type Customer = { id: string; name: string; orgNumber: string; city: string; segment: string; email?: string; paymentTerms?: string; source?: string; hot?: boolean };
type Supplier = { id: string; name: string; category: string; fortnoxSupplierNo: string };
type Order = { id: string; customer: string; supplier: string; text: string; status: "Utkast" | "Skickad" | "Fakturerad" };
type QuoteDraft = { id: string; customer: string; title: string; text: string; status: "Utkast" | "Skickad" };
type Task = { id: string; title: string; due: string; owner: string; status: "Öppen" | "Klar" };
type SyncItem = { id: string; customerName: string; field: string; oldValue: string; newValue: string; status: "Pending" | "Approved" | "Rejected" };
type CallNote = { id: string; phone: string; customerName: string; note: string; savedAt: string; source: "Telavox" | "Teams Calling" | "Manual" };
type Audit = { id: string; text: string; at: string };
type User = { id: string; name: string; email: string; password: string; role: "admin" | "employee"; permissions: Record<SectionKey, boolean>; widgets: Record<WidgetKey, boolean> };

const sectionLabels: Record<SectionKey, string> = {
  dashboard: "Dashboard", pipeline: "Pipeline", leads: "Leads", customers: "Kunder", orders: "Order", quotes: "Offerter", tasks: "Tasks", calls: "Samtal", sync: "Synk-kö", integrations: "Integrationer", admin: "Admin"
};

const widgetLabels: Record<WidgetKey, string> = {
  stats: "Statistik", quickActions: "Snabbknappar", recentLeads: "Senaste leads", syncQueue: "Synk-kö", incomingCall: "Pågående samtal", brent: "Brent-widget", catalog: "Katalog-widget", ai: "AI-panel", today: "Idag-widget", hotlist: "Hotlist", quotes: "Offerter-widget"
};

const defaultSuppliers: Supplier[] = [
  { id: "sup-1", name: "SKF Distributionspartner", category: "Reservdelar", fortnoxSupplierNo: "10012" },
  { id: "sup-2", name: "LubriTech Nordic", category: "Smörjmedel", fortnoxSupplierNo: "10048" },
  { id: "sup-3", name: "Maskin & Driftgrossisten", category: "Maskin", fortnoxSupplierNo: "10111" }
];

const defaultLeads: Lead[] = [
  { id: "lead-1", company: "Nordtrafik Service AB", contact: "Anders Holm", segment: "Transport", status: "Ny" },
  { id: "lead-2", company: "Stålverk Mekaniska", contact: "Maria Eng", segment: "Verkstad", status: "Kontaktad" },
  { id: "lead-3", company: "Maskin Drift AB", contact: "Peter Nor", segment: "Industri", status: "Offert" }
];

const defaultCustomers: Customer[] = [
  { id: "cust-1", name: "Mälarfrakt AB", orgNumber: "556123-1111", city: "Västerås", segment: "Transport", email: "info@malarfrakt.se", paymentTerms: "30 dagar", source: "Lookup", hot: true },
  { id: "cust-2", name: "Söder Verkstad", orgNumber: "556123-2222", city: "Nykvarn", segment: "Verkstad", email: "order@soderverkstad.se", paymentTerms: "20 dagar", source: "Manual", hot: false }
];

const defaultOrders: Order[] = [
  { id: "ord-1", customer: "Mälarfrakt AB", supplier: "LubriTech Nordic", text: "Motorolja 5W30 20L", status: "Utkast" },
  { id: "ord-2", customer: "Söder Verkstad", supplier: "SKF Distributionspartner", text: "Kullager 6205", status: "Skickad" }
];

const defaultQuotes: QuoteDraft[] = [
  { id: "quote-1", customer: "Mälarfrakt AB", title: "Olja + filter april", text: "Prisförslag på 5W30 och filterpaket.", status: "Utkast" }
];

const defaultTasks: Task[] = [
  { id: "task-1", title: "Följ upp Mälarfrakt", due: "2026-04-03", owner: "Säljare", status: "Öppen" },
  { id: "task-2", title: "Skicka offert Söder Verkstad", due: "2026-04-02", owner: "Admin", status: "Öppen" }
];

const defaultSyncQueue: SyncItem[] = [
  { id: "sync-1", customerName: "Mälarfrakt AB", field: "E-post", oldValue: "gammal@malarfrakt.se", newValue: "info@malarfrakt.se", status: "Pending" },
  { id: "sync-2", customerName: "Söder Verkstad", field: "Betalvillkor", oldValue: "30 dagar", newValue: "20 dagar", status: "Pending" }
];

const defaultCallNotes: CallNote[] = [
  { id: "call-1", phone: "0701234567", customerName: "Mälarfrakt AB", note: "Ville ha pris på 5W30 och filter", savedAt: "2026-04-01 09:12", source: "Telavox" }
];

const defaultAudit: Audit[] = [
  { id: "audit-1", text: "Admin loggade in", at: "2026-04-01 08:00" }
];

const defaultAdmin: User = {
  id: "u-admin", name: "Admin", email: "admin@sodertornsteam.se", password: "admin123", role: "admin",
  permissions: { dashboard: true, pipeline: true, leads: true, customers: true, orders: true, quotes: true, tasks: true, calls: true, sync: true, integrations: true, admin: true },
  widgets: { stats: true, quickActions: true, recentLeads: true, syncQueue: true, incomingCall: true, brent: true, catalog: true, ai: true, today: true, hotlist: true, quotes: true }
};

const defaultEmployee: User = {
  id: "u-employee", name: "Säljare", email: "salj@sodertornsteam.se", password: "1234", role: "employee",
  permissions: { dashboard: true, pipeline: true, leads: true, customers: true, orders: true, quotes: true, tasks: true, calls: true, sync: false, integrations: false, admin: false },
  widgets: { stats: true, quickActions: true, recentLeads: true, syncQueue: false, incomingCall: true, brent: true, catalog: true, ai: true, today: true, hotlist: true, quotes: true }
};

export default function Page() {
  const [users, setUsers] = useState<User[]>([defaultAdmin, defaultEmployee]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [tab, setTab] = useState<SectionKey>("dashboard");

  const [leads, setLeads] = useState<Lead[]>(defaultLeads);
  const [customers, setCustomers] = useState<Customer[]>(defaultCustomers);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [quotes, setQuotes] = useState<QuoteDraft[]>(defaultQuotes);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [suppliers] = useState<Supplier[]>(defaultSuppliers);
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>(defaultSyncQueue);
  const [callNotes, setCallNotes] = useState<CallNote[]>(defaultCallNotes);
  const [audit, setAudit] = useState<Audit[]>(defaultAudit);

  const [email, setEmail] = useState("admin@sodertornsteam.se");
  const [password, setPassword] = useState("admin123");
  const [loginMessage, setLoginMessage] = useState("");

  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupMessage, setLookupMessage] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadContact, setNewLeadContact] = useState("");
  const [newLeadSegment, setNewLeadSegment] = useState("Transport");

  const [newOrderCustomer, setNewOrderCustomer] = useState(defaultCustomers[0]?.name || "");
  const [newOrderSupplier, setNewOrderSupplier] = useState(defaultSuppliers[0]?.name || "");
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

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "employee">("employee");
  const [adminMessage, setAdminMessage] = useState("");

  const currentUser = useMemo(() => users.find((x) => x.id === currentUserId) || null, [users, currentUserId]);

  useEffect(() => {
    const raw = localStorage.getItem("crm_branch_plus_state");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.users) setUsers(parsed.users);
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
    localStorage.setItem("crm_branch_plus_state", JSON.stringify({ users, currentUserId, leads, customers, orders, quotes, tasks, syncQueue, callNotes, audit }));
  }, [users, currentUserId, leads, customers, orders, quotes, tasks, syncQueue, callNotes, audit]);

  useEffect(() => {
    if (!currentUser) return;
    if (!currentUser.permissions[tab]) {
      const firstAllowed = (Object.keys(sectionLabels) as SectionKey[]).find((key) => currentUser.permissions[key]);
      if (firstAllowed) setTab(firstAllowed);
    }
  }, [currentUser, tab]);

  function logEvent(text: string) {
    setAudit((prev) => [{ id: "audit-" + Date.now(), text, at: new Date().toLocaleString("sv-SE") }, ...prev]);
  }

  function login() {
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

  function addLead() {
    if (!newLeadCompany.trim() || !newLeadContact.trim()) return;
    setLeads([{ id: "lead-" + Date.now(), company: newLeadCompany.trim(), contact: newLeadContact.trim(), segment: newLeadSegment, status: "Ny" }, ...leads]);
    logEvent(`Lead skapad: ${newLeadCompany.trim()}`);
    setNewLeadCompany(""); setNewLeadContact("");
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

  async function createFortnoxOrder() {
    if (!newOrderCustomer || !newOrderSupplier || !newOrderText.trim()) return;
    setOrderMessage("Skickar...");
    const res = await fetch("/api/fortnox/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer: newOrderCustomer, supplier: newOrderSupplier, text: newOrderText }) });
    const json = await res.json();
    if (!res.ok) return setOrderMessage(json.error || "Fel");
    setOrders([{ id: "ord-" + Date.now(), customer: newOrderCustomer, supplier: newOrderSupplier, text: newOrderText, status: "Skickad" }, ...orders]);
    logEvent(`Order skapad för ${newOrderCustomer}`);
    setNewOrderText(""); setOrderMessage(json.message);
  }

  async function createInvoice(order: Order) {
    setInvoiceMessage("Fakturerar...");
    const res = await fetch("/api/fortnox/create-invoice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order }) });
    const json = await res.json();
    if (!res.ok) return setInvoiceMessage(json.error || "Fel");
    setOrders((prev) => prev.map((x) => x.id === order.id ? { ...x, status: "Fakturerad" } : x));
    logEvent(`Faktura skapad från order ${order.id}`);
    setInvoiceMessage(json.message);
  }

  async function sendLatestCustomerToFortnox() {
    if (!customers.length) return;
    setFortnoxMessage("Skickar...");
    const res = await fetch("/api/fortnox/send-customer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer: customers[0] }) });
    const json = await res.json();
    setFortnoxMessage(res.ok ? json.message : json.error || "Fel");
    logEvent(`Fortnox-skick: ${customers[0].name}`);
  }

  function autoSaveCall() {
    const item: CallNote = { id: "call-" + Date.now(), phone: callPhone, customerName: callCustomerName, note: callLiveNote, savedAt: new Date().toLocaleString("sv-SE"), source: callSource };
    setCallNotes([item, ...callNotes]);
    const exists = customers.some((c) => c.name.toLowerCase() === callCustomerName.toLowerCase());
    if (!exists && callCustomerName.trim()) {
      setCustomers([{ id: "cust-" + Date.now(), name: callCustomerName.trim(), orgNumber: "", city: "", segment: "Övrigt", source: "Incoming call" }, ...customers]);
    }
    logEvent(`Samtal autosparat: ${callCustomerName}`);
    setCallSaveMessage("Samtal autosparat.");
    setCallLiveNote("");
  }

  function approveSync(id: string) { setSyncQueue((prev) => prev.map((x) => x.id === id ? { ...x, status: "Approved" } : x)); logEvent(`Synk godkänd ${id}`); }
  function rejectSync(id: string) { setSyncQueue((prev) => prev.map((x) => x.id === id ? { ...x, status: "Rejected" } : x)); logEvent(`Synk avvisad ${id}`); }

  async function askAI() {
    setAiAnswer("Tänker...");
    const res = await fetch("/api/ai-assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: aiQuestion, leads, customers, orders, callNotes, tasks, quotes }) });
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

  function createQuote() {
    if (!newQuoteCustomer || !newQuoteTitle.trim() || !newQuoteText.trim()) return;
    setQuotes([{ id: "quote-" + Date.now(), customer: newQuoteCustomer, title: newQuoteTitle.trim(), text: newQuoteText.trim(), status: "Utkast" }, ...quotes]);
    logEvent(`Offertutkast skapat för ${newQuoteCustomer}`);
    setNewQuoteTitle(""); setNewQuoteText("");
  }

  function sendQuote(id: string) {
    setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status: "Skickad" } : q));
    logEvent(`Offert skickad ${id}`);
  }

  function createTask() {
    if (!newTaskTitle.trim()) return;
    setTasks([{ id: "task-" + Date.now(), title: newTaskTitle.trim(), due: newTaskDue, owner: currentUser?.name || "Okänd", status: "Öppen" }, ...tasks]);
    logEvent(`Task skapad: ${newTaskTitle.trim()}`);
    setNewTaskTitle("");
  }

  function completeTask(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "Klar" } : t));
    logEvent(`Task klar ${id}`);
  }

  function createUser() {
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) return setAdminMessage("Fyll i namn, e-post och lösenord.");
    if (users.some((u) => u.email.toLowerCase() == newUserEmail.trim().toLowerCase())) return setAdminMessage("Den e-posten finns redan.");
    const isAdmin = newUserRole === "admin";
    const newUser: User = {
      id: "u-" + Date.now(),
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      password: newUserPassword,
      role: newUserRole,
      permissions: { dashboard: true, pipeline: true, leads: true, customers: true, orders: true, quotes: true, tasks: true, calls: true, sync: isAdmin, integrations: isAdmin, admin: isAdmin },
      widgets: { stats: true, quickActions: true, recentLeads: true, syncQueue: isAdmin, incomingCall: true, brent: true, catalog: true, ai: true, today: true, hotlist: true, quotes: true }
    };
    setUsers([newUser, ...users]);
    logEvent(`Användare skapad: ${newUser.email}`);
    setAdminMessage("Användare skapad.");
    setNewUserName(""); setNewUserEmail(""); setNewUserPassword(""); setNewUserRole("employee");
  }

  function toggleSectionPermission(userId: string, section: SectionKey) {
    setUsers((prev) => prev.map((u) => u.id !== userId || u.role === "admin" ? u : ({ ...u, permissions: { ...u.permissions, [section]: !u.permissions[section] } })));
  }

  function toggleWidget(userId: string, widget: WidgetKey) {
    setUsers((prev) => prev.map((u) => u.id !== userId ? u : ({ ...u, widgets: { ...u.widgets, [widget]: !u.widgets[widget] } })));
  }

  function setRole(userId: string, role: "admin" | "employee") {
    setUsers((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      if (role === "admin") return { ...u, role, permissions: { dashboard: true, pipeline: true, leads: true, customers: true, orders: true, quotes: true, tasks: true, calls: true, sync: true, integrations: true, admin: true }, widgets: { stats: true, quickActions: true, recentLeads: true, syncQueue: true, incomingCall: true, brent: true, catalog: true, ai: true, today: true, hotlist: true, quotes: true } };
      return { ...u, role, permissions: { ...u.permissions, sync: false, integrations: false, admin: false }, widgets: { ...u.widgets, syncQueue: false } };
    }));
  }

  const currentUserWidgets = currentUser?.widgets || defaultAdmin.widgets;
  const allowedSections = currentUser ? (Object.keys(sectionLabels) as SectionKey[]).filter((x) => currentUser.permissions[x]) : [];
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
            <p>Branch plus med fler delar som jag tycker behövs i din verksamhet.</p>
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
            <button key={section} style={sideBtn(tab === section)} onClick={() => setTab(section)}>{sectionLabels[section]}</button>
          ))}
          <div style={{ marginTop: 20 }}>
            <button style={{ ...soft, width: "100%" }} onClick={logout}>Logga ut</button>
          </div>
        </aside>

        <main>
          <div style={hero}>
            <h1 style={{ marginTop: 0, marginBottom: 8 }}>Dashboard</h1>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={pill(true)}>På: live-redo Fortnox</span>
              <span style={pill(true)}>På: pipeline</span>
              <span style={pill(true)}>På: offerter / tasks</span>
              <span style={pill(false)}>Av: riktiga tokens saknas</span>
            </div>
          </div>

          {tab === "dashboard" && (
            <div>
              {currentUserWidgets.stats && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
                  <div style={card}><div style={{ color: "#666" }}>Leads</div><div style={{ fontSize: 30, fontWeight: 800 }}>{leads.length}</div></div>
                  <div style={card}><div style={{ color: "#666" }}>Kunder</div><div style={{ fontSize: 30, fontWeight: 800 }}>{customers.length}</div></div>
                  <div style={card}><div style={{ color: "#666" }}>Order</div><div style={{ fontSize: 30, fontWeight: 800 }}>{orders.length}</div></div>
                  <div style={card}><div style={{ color: "#666" }}>Tasks</div><div style={{ fontSize: 30, fontWeight: 800 }}>{tasks.filter(t => t.status === "Öppen").length}</div></div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
                {currentUserWidgets.quickActions && <div style={card}><h2 style={{ marginTop: 0 }}>Snabbknappar</h2><button style={primary} onClick={() => setTab("leads")}>Nytt lead</button>{" "}<button style={soft} onClick={() => setTab("orders")}>Ny order</button>{" "}<button style={soft} onClick={() => setTab("quotes")}>Ny offert</button>{" "}<button style={soft} onClick={() => setTab("calls")}>Pågående samtal</button></div>}
                {currentUserWidgets.ai && <div style={card}><h2 style={{ marginTop: 0 }}>AI-assistent</h2><input style={input} value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} placeholder="Fråga om sälj, olja, katalog eller automation" /><br /><button style={primary} onClick={askAI}>Fråga</button><p style={{ whiteSpace: "pre-wrap" }}>{aiAnswer}</p></div>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {currentUserWidgets.recentLeads && <div style={card}><h2 style={{ marginTop: 0 }}>Senaste leads</h2><ul>{leads.slice(0, 5).map((lead, i) => <li key={i}>{lead.company} - {lead.contact} - {lead.status}</li>)}</ul></div>}
                {currentUserWidgets.hotlist && <div style={card}><h2 style={{ marginTop: 0 }}>Hotlist</h2><ul>{customers.filter(c => c.hot).map((c) => <li key={c.id}>{c.name} - {c.segment}</li>)}</ul></div>}
                {currentUserWidgets.syncQueue && <div style={card}><h2 style={{ marginTop: 0 }}>Synk-kö</h2><ul>{syncQueue.filter((x) => x.status === "Pending").map((item) => <li key={item.id}>{item.customerName}: {item.field} {item.oldValue} → {item.newValue}</li>)}</ul></div>}
                {currentUserWidgets.incomingCall && <div style={card}><h2 style={{ marginTop: 0 }}>Pågående samtal</h2><div>Senast: {callNotes[0]?.customerName || "-"}</div><div>Telefon: {callNotes[0]?.phone || "-"}</div><button style={soft} onClick={() => setTab("calls")}>Öppna samtalspanel</button></div>}
                {currentUserWidgets.brent && <div style={card}><h2 style={{ marginTop: 0 }}>Brent-widget</h2><div>Senaste sparade nivå: <strong>76.40 USD/fat</strong></div><button style={soft} onClick={() => loadIntegration("brent")}>Hämta status</button><div>{integrationInfo.brent}</div></div>}
                {currentUserWidgets.catalog && <div style={card}><h2 style={{ marginTop: 0 }}>Katalog-widget</h2><div>Personbil, lastbil och maskin.</div><button style={soft} onClick={() => loadIntegration("catalog")}>Hämta status</button><div>{integrationInfo.catalog}</div></div>}
                {currentUserWidgets.today && <div style={card}><h2 style={{ marginTop: 0 }}>Idag</h2><div>Öppna tasks: {tasks.filter(t => t.status === "Öppen").length}</div><div>Order att fakturera: {orders.filter(o => o.status !== "Fakturerad").length}</div><div>Synk-kö: {syncQueue.filter(x => x.status === "Pending").length}</div></div>}
                {currentUserWidgets.quotes && <div style={card}><h2 style={{ marginTop: 0 }}>Offerter-widget</h2><ul>{quotes.slice(0, 3).map((q) => <li key={q.id}>{q.customer} - {q.title} - {q.status}</li>)}</ul></div>}
              </div>
            </div>
          )}

          {tab === "pipeline" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>
              {pipelineCols.map((col) => (
                <div key={col} style={card}>
                  <h2 style={{ marginTop: 0 }}>{col}</h2>
                  <ul>{leads.filter(l => l.status === col).map((lead) => <li key={lead.id}>{lead.company}<br />{lead.contact}</li>)}</ul>
                </div>
              ))}
            </div>
          )}

          {tab === "leads" && (
            <div style={card}>
              <h2 style={{ marginTop: 0 }}>Leads</h2>
              <input style={input} placeholder="Företag" value={newLeadCompany} onChange={(e) => setNewLeadCompany(e.target.value)} />
              <br />
              <input style={input} placeholder="Kontakt" value={newLeadContact} onChange={(e) => setNewLeadContact(e.target.value)} />
              <br />
              <select style={input} value={newLeadSegment} onChange={(e) => setNewLeadSegment(e.target.value)}>
                <option>Transport</option>
                <option>Verkstad</option>
                <option>Industri</option>
                <option>Övrigt</option>
              </select>
              <br />
              <button style={primary} onClick={addLead}>Lägg till lead</button>
              <ul>{leads.map((lead) => <li key={lead.id}>{lead.company} - {lead.contact} - {lead.segment} - {lead.status}</li>)}</ul>
            </div>
          )}

          {tab === "customers" && (
            <div style={card}>
              <h2 style={{ marginTop: 0 }}>Kunder</h2>
              <input style={input} placeholder="Sök bolag eller org.nr" value={lookupQuery} onChange={(e) => setLookupQuery(e.target.value)} />
              <br />
              <button style={primary} onClick={lookupCompany}>Hämta och kategorisera</button>{" "}
              <button style={soft} onClick={sendLatestCustomerToFortnox}>Skicka senaste kund till Fortnox</button>
              <p>{lookupMessage}</p>
              <p>{fortnoxMessage}</p>
              <ul>{customers.map((customer) => <li key={customer.id}>{customer.name} - {customer.orgNumber} - {customer.city} - {customer.segment}</li>)}</ul>
            </div>
          )}

          {tab === "orders" && (
            <div style={card}>
              <h2 style={{ marginTop: 0 }}>Ordersystem</h2>
              <select style={input} value={newOrderCustomer} onChange={(e) => setNewOrderCustomer(e.target.value)}>
                {customers.map((customer) => <option key={customer.id}>{customer.name}</option>)}
              </select>
              <br />
              <select style={input} value={newOrderSupplier} onChange={(e) => setNewOrderSupplier(e.target.value)}>
                {suppliers.map((supplier) => <option key={supplier.id}>{supplier.name}</option>)}
              </select>
              <br />
              <input style={input} placeholder="Artikel / text" value={newOrderText} onChange={(e) => setNewOrderText(e.target.value)} />
              <br />
              <button style={primary} onClick={createFortnoxOrder}>Skicka order</button>
              <p>{orderMessage}</p>
              <p>{invoiceMessage}</p>
              <ul>{orders.map((order) => <li key={order.id}>{order.customer} - {order.supplier} - {order.text} - {order.status} {order.status !== "Fakturerad" && <button style={soft} onClick={() => createInvoice(order)}>Fakturera</button>}</li>)}</ul>
            </div>
          )}

          {tab === "quotes" && (
            <div style={card}>
              <h2 style={{ marginTop: 0 }}>Offerter</h2>
              <select style={input} value={newQuoteCustomer} onChange={(e) => setNewQuoteCustomer(e.target.value)}>
                {customers.map((customer) => <option key={customer.id}>{customer.name}</option>)}
              </select>
              <br />
              <input style={input} placeholder="Titel" value={newQuoteTitle} onChange={(e) => setNewQuoteTitle(e.target.value)} />
              <br />
              <textarea style={{ ...input, minHeight: 120 }} placeholder="Offertutkast" value={newQuoteText} onChange={(e) => setNewQuoteText(e.target.value)} />
              <br />
              <button style={primary} onClick={createQuote}>Skapa offertutkast</button>
              <ul>{quotes.map((quote) => <li key={quote.id}>{quote.customer} - {quote.title} - {quote.status} {quote.status !== "Skickad" && <button style={soft} onClick={() => sendQuote(quote.id)}>Skicka</button>}</li>)}</ul>
            </div>
          )}

          {tab === "tasks" && (
            <div style={card}>
              <h2 style={{ marginTop: 0 }}>Tasks / uppföljning</h2>
              <input style={input} placeholder="Task" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
              <br />
              <input style={input} type="date" value={newTaskDue} onChange={(e) => setNewTaskDue(e.target.value)} />
              <br />
              <button style={primary} onClick={createTask}>Skapa task</button>
              <ul>{tasks.map((task) => <li key={task.id}>{task.title} - {task.due} - {task.owner} - {task.status} {task.status !== "Klar" && <button style={soft} onClick={() => completeTask(task.id)}>Klar</button>}</li>)}</ul>
            </div>
          )}

          {tab === "calls" && (
            <div style={card}>
              <h2 style={{ marginTop: 0 }}>Inkommande samtal</h2>
              <input style={input} placeholder="Telefonnummer" value={callPhone} onChange={(e) => setCallPhone(e.target.value)} />
              <br />
              <input style={input} placeholder="Kundnamn" value={callCustomerName} onChange={(e) => setCallCustomerName(e.target.value)} />
              <br />
              <select style={input} value={callSource} onChange={(e) => setCallSource(e.target.value as CallNote["source"])}>
                <option>Telavox</option>
                <option>Teams Calling</option>
                <option>Manual</option>
              </select>
              <br />
              <textarea style={{ ...input, minHeight: 120 }} placeholder="Skriv notering under pågående samtal" value={callLiveNote} onChange={(e) => setCallLiveNote(e.target.value)} />
              <br />
              <button style={primary} onClick={autoSaveCall}>Autospara samtal</button>
              <p>{callSaveMessage}</p>
              <ul>{callNotes.map((call) => <li key={call.id}>{call.savedAt} - {call.customerName} - {call.phone} - {call.source} - {call.note}</li>)}</ul>
            </div>
          )}

          {tab === "sync" && (
            <div style={card}>
              <h2 style={{ marginTop: 0 }}>Synk-kö till Fortnox</h2>
              <ul>{syncQueue.map((item) => <li key={item.id}>{item.customerName} - {item.field}: {item.oldValue} → {item.newValue} - {item.status} {item.status === "Pending" && <><button style={soft} onClick={() => approveSync(item.id)}>Godkänn</button>{" "}<button style={soft} onClick={() => rejectSync(item.id)}>Avvisa</button></>}</li>)}</ul>
            </div>
          )}

          {tab === "integrations" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
              <div style={card}><h2 style={{ marginTop: 0 }}>Fortnox</h2><div style={pill(Boolean(integrationInfo.fortnox))}>{integrationInfo.fortnox ? "På" : "Av"}</div><button style={primary} onClick={() => loadIntegration("fortnox")}>Ladda status</button><p>{integrationInfo.fortnox}</p></div>
              <div style={card}><h2 style={{ marginTop: 0 }}>Office 365</h2><div style={pill(Boolean(integrationInfo.office365))}>{integrationInfo.office365 ? "På" : "Av"}</div><button style={primary} onClick={() => loadIntegration("office365")}>Ladda status</button><p>{integrationInfo.office365}</p></div>
              <div style={card}><h2 style={{ marginTop: 0 }}>Teams</h2><div style={pill(Boolean(integrationInfo.teams))}>{integrationInfo.teams ? "På" : "Av"}</div><button style={primary} onClick={() => loadIntegration("teams")}>Ladda status</button><p>{integrationInfo.teams}</p></div>
              <div style={card}><h2 style={{ marginTop: 0 }}>Telavox</h2><div style={pill(Boolean(integrationInfo.telavox))}>{integrationInfo.telavox ? "På" : "Av"}</div><button style={primary} onClick={() => loadIntegration("telavox")}>Ladda status</button><p>{integrationInfo.telavox}</p></div>
              <div style={card}><h2 style={{ marginTop: 0 }}>Katalog-API</h2><div style={pill(Boolean(integrationInfo.catalog))}>{integrationInfo.catalog ? "På" : "Av"}</div><button style={primary} onClick={() => loadIntegration("catalog")}>Ladda status</button><p>{integrationInfo.catalog}</p></div>
              <div style={card}><h2 style={{ marginTop: 0 }}>Brent</h2><div style={pill(Boolean(integrationInfo.brent))}>{integrationInfo.brent ? "På" : "Av"}</div><button style={primary} onClick={() => loadIntegration("brent")}>Ladda status</button><p>{integrationInfo.brent}</p></div>
            </div>
          )}

          {tab === "admin" && (
            <div>
              <div style={card}>
                <h2 style={{ marginTop: 0 }}>Skapa användare</h2>
                <input style={input} placeholder="Namn" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                <br />
                <input style={input} placeholder="E-post" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
                <br />
                <input style={input} placeholder="Lösenord" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
                <br />
                <select style={input} value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as "admin" | "employee")}>
                  <option value="employee">Anställd</option>
                  <option value="admin">Admin</option>
                </select>
                <br />
                <button style={primary} onClick={createUser}>Skapa användare</button>
                <p>{adminMessage}</p>
              </div>

              <div style={card}>
                <h2 style={{ marginTop: 0 }}>Behörigheter och widgets</h2>
                {users.map((user) => (
                  <div key={user.id} style={{ borderTop: "1px solid #eee", paddingTop: 12, marginTop: 12 }}>
                    <div><strong>{user.name}</strong> - {user.email} - {user.role}</div>
                    <div style={{ marginTop: 8 }}>
                      <button style={soft} onClick={() => setRole(user.id, "employee")}>Sätt som anställd</button>{" "}
                      <button style={soft} onClick={() => setRole(user.id, "admin")}>Sätt som admin</button>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <strong>Sektioner:</strong><br />
                      {(Object.keys(sectionLabels) as SectionKey[]).map((section) => (
                        <label key={section} style={{ display: "inline-block", marginRight: 12, marginBottom: 8 }}>
                          <input type="checkbox" checked={user.permissions[section]} disabled={user.role === "admin"} onChange={() => toggleSectionPermission(user.id, section)} /> {sectionLabels[section]}
                        </label>
                      ))}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <strong>Widgets:</strong><br />
                      {(Object.keys(widgetLabels) as WidgetKey[]).map((widget) => (
                        <label key={widget} style={{ display: "inline-block", marginRight: 12, marginBottom: 8 }}>
                          <input type="checkbox" checked={user.widgets[widget]} onChange={() => toggleWidget(user.id, widget)} /> {widgetLabels[widget]}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={card}>
                <h2 style={{ marginTop: 0 }}>Audit log</h2>
                <ul>{audit.slice(0, 20).map((item) => <li key={item.id}>{item.at} - {item.text}</li>)}</ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

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
