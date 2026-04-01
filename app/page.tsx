"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type SectionKey =
  | "dashboard"
  | "leads"
  | "customers"
  | "orders"
  | "activities"
  | "sync"
  | "integrations"
  | "admin";

type Lead = {
  company: string;
  contact: string;
  segment: string;
  status: "Ny" | "Kontaktad" | "Offert" | "Affär" | "Förlorad";
};

type Customer = {
  id: string;
  name: string;
  orgNumber: string;
  city: string;
  segment: string;
  revenue?: string;
  employees?: string;
  paymentTerms?: string;
  email?: string;
};

type Supplier = {
  id: string;
  name: string;
  category: string;
  fortnoxSupplierNo: string;
};

type Order = {
  id: string;
  customer: string;
  supplier: string;
  text: string;
  status: "Utkast" | "Skickad" | "Fakturerad";
};

type Activity = {
  text: string;
  type: "Samtal" | "Mail" | "Möte" | "Notering";
};

type SyncItem = {
  id: string;
  customerName: string;
  field: string;
  oldValue: string;
  newValue: string;
  status: "Pending" | "Approved" | "Rejected";
};

type WidgetKey =
  | "stats"
  | "recentLeads"
  | "syncQueue"
  | "quickActions"
  | "integrations"
  | "ai";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee";
  permissions: Record<SectionKey, boolean>;
  widgets: Record<WidgetKey, boolean>;
};

const sectionLabels: Record<SectionKey, string> = {
  dashboard: "Dashboard",
  leads: "Leads",
  customers: "Kunder",
  orders: "Order",
  activities: "Aktiviteter",
  sync: "Synk-kö",
  integrations: "Integrationer",
  admin: "Admin"
};

const widgetLabels: Record<WidgetKey, string> = {
  stats: "Statistik",
  recentLeads: "Senaste leads",
  syncQueue: "Synk-kö",
  quickActions: "Snabbknappar",
  integrations: "Integrationsstatus",
  ai: "AI-panel"
};

const defaultSuppliers: Supplier[] = [
  { id: "sup-1", name: "SKF Distributionspartner", category: "Reservdelar", fortnoxSupplierNo: "10012" },
  { id: "sup-2", name: "LubriTech Nordic", category: "Smörjmedel", fortnoxSupplierNo: "10048" },
  { id: "sup-3", name: "Maskin & Driftgrossisten", category: "Reservdelar", fortnoxSupplierNo: "10111" }
];

const defaultLeads: Lead[] = [
  { company: "Nordtrafik Service AB", contact: "Anders Holm", segment: "Transport", status: "Ny" },
  { company: "Stålverk Mekaniska", contact: "Maria Eng", segment: "Verkstad", status: "Kontaktad" }
];

const defaultCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Mälarfrakt AB",
    orgNumber: "556123-1111",
    city: "Västerås",
    segment: "Transport",
    revenue: "45 MSEK",
    employees: "23",
    paymentTerms: "30 dagar",
    email: "info@malarfrakt.se"
  },
  {
    id: "cust-2",
    name: "Söder Verkstad",
    orgNumber: "556123-2222",
    city: "Nykvarn",
    segment: "Verkstad",
    revenue: "12 MSEK",
    employees: "9",
    paymentTerms: "20 dagar",
    email: "order@soderverkstad.se"
  }
];

const defaultOrders: Order[] = [
  { id: "ord-1", customer: "Mälarfrakt AB", supplier: "LubriTech Nordic", text: "Motorolja 5W30 20L", status: "Utkast" },
  { id: "ord-2", customer: "Söder Verkstad", supplier: "SKF Distributionspartner", text: "Kullager 6205", status: "Skickad" }
];

const defaultActivities: Activity[] = [
  { text: "Ring Anders Holm", type: "Samtal" },
  { text: "Skicka offert till Söder Verkstad", type: "Mail" }
];

const defaultSyncQueue: SyncItem[] = [
  { id: "sync-1", customerName: "Mälarfrakt AB", field: "E-post", oldValue: "gammal@malarfrakt.se", newValue: "info@malarfrakt.se", status: "Pending" },
  { id: "sync-2", customerName: "Söder Verkstad", field: "Betalvillkor", oldValue: "30 dagar", newValue: "20 dagar", status: "Pending" }
];

const defaultAdmin: User = {
  id: "u-admin",
  name: "Admin",
  email: "admin@sodertornsteam.se",
  password: "admin123",
  role: "admin",
  permissions: {
    dashboard: true,
    leads: true,
    customers: true,
    orders: true,
    activities: true,
    sync: true,
    integrations: true,
    admin: true
  },
  widgets: {
    stats: true,
    recentLeads: true,
    syncQueue: true,
    quickActions: true,
    integrations: true,
    ai: true
  }
};

const defaultEmployee: User = {
  id: "u-employee",
  name: "Säljare",
  email: "salj@sodertornsteam.se",
  password: "1234",
  role: "employee",
  permissions: {
    dashboard: true,
    leads: true,
    customers: true,
    orders: true,
    activities: true,
    sync: false,
    integrations: false,
    admin: false
  },
  widgets: {
    stats: true,
    recentLeads: true,
    syncQueue: false,
    quickActions: true,
    integrations: false,
    ai: true
  }
};

export default function Page() {
  const [users, setUsers] = useState<User[]>([defaultAdmin, defaultEmployee]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [tab, setTab] = useState<SectionKey>("dashboard");

  const [leads, setLeads] = useState<Lead[]>(defaultLeads);
  const [customers, setCustomers] = useState<Customer[]>(defaultCustomers);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [suppliers] = useState<Supplier[]>(defaultSuppliers);
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>(defaultSyncQueue);

  const [email, setEmail] = useState("admin@sodertornsteam.se");
  const [password, setPassword] = useState("admin123");
  const [loginMessage, setLoginMessage] = useState("");

  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadContact, setNewLeadContact] = useState("");
  const [newLeadSegment, setNewLeadSegment] = useState("Transport");

  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupMessage, setLookupMessage] = useState("");

  const [newOrderCustomer, setNewOrderCustomer] = useState(defaultCustomers[0]?.name || "");
  const [newOrderSupplier, setNewOrderSupplier] = useState(defaultSuppliers[0]?.name || "");
  const [newOrderText, setNewOrderText] = useState("");

  const [invoiceMessage, setInvoiceMessage] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [fortnoxMessage, setFortnoxMessage] = useState("");

  const [activityText, setActivityText] = useState("");
  const [activityType, setActivityType] = useState<Activity["type"]>("Notering");

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  const [integrationInfo, setIntegrationInfo] = useState<Record<string, string>>({
    fortnox: "",
    office365: "",
    teams: "",
    abr: ""
  });

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "employee">("employee");
  const [adminMessage, setAdminMessage] = useState("");

  const currentUser = useMemo(
    () => users.find((x) => x.id === currentUserId) || null,
    [users, currentUserId]
  );

  useEffect(() => {
    const raw = localStorage.getItem("crm_sharp_state");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.users) setUsers(parsed.users);
      if (parsed.currentUserId) setCurrentUserId(parsed.currentUserId);
      if (parsed.leads) setLeads(parsed.leads);
      if (parsed.customers) setCustomers(parsed.customers);
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.activities) setActivities(parsed.activities);
      if (parsed.syncQueue) setSyncQueue(parsed.syncQueue);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "crm_sharp_state",
      JSON.stringify({
        users,
        currentUserId,
        leads,
        customers,
        orders,
        activities,
        syncQueue
      })
    );
  }, [users, currentUserId, leads, customers, orders, activities, syncQueue]);

  useEffect(() => {
    if (!currentUser) return;
    if (!currentUser.permissions[tab]) {
      const firstAllowed = (Object.keys(sectionLabels) as SectionKey[]).find((key) => currentUser.permissions[key]);
      if (firstAllowed) setTab(firstAllowed);
    }
  }, [currentUser, tab]);

  function login() {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) {
      setLoginMessage("Fel e-post eller lösenord.");
      return;
    }
    setCurrentUserId(found.id);
    setLoginMessage(`Inloggad som ${found.name}`);
  }

  function logout() {
    setCurrentUserId("");
    setLoginMessage("");
  }

  function addLead() {
    if (!newLeadCompany.trim() || !newLeadContact.trim()) return;
    setLeads([
      { company: newLeadCompany.trim(), contact: newLeadContact.trim(), segment: newLeadSegment, status: "Ny" },
      ...leads
    ]);
    setActivities([{ text: `Nytt lead tillagt: ${newLeadCompany.trim()}`, type: "Notering" }, ...activities]);
    setNewLeadCompany("");
    setNewLeadContact("");
  }

  async function lookupCompany() {
    setLookupMessage("Söker...");
    const res = await fetch("/api/company-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: lookupQuery })
    });
    const json = await res.json();
    if (!res.ok) {
      setLookupMessage(json.error || "Fel");
      return;
    }
    setCustomers([json.company, ...customers]);
    setActivities([{ text: `Företag hämtat och tillagt: ${json.company.name}`, type: "Notering" }, ...activities]);
    setLookupMessage(`Tillagd som kund: ${json.company.name}`);
  }

  function addActivity() {
    if (!activityText.trim()) return;
    setActivities([{ text: activityText.trim(), type: activityType }, ...activities]);
    setActivityText("");
  }

  async function createFortnoxOrder() {
    if (!newOrderCustomer || !newOrderSupplier || !newOrderText.trim()) return;
    setOrderMessage("Skickar...");
    const res = await fetch("/api/fortnox/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: newOrderCustomer,
        supplier: newOrderSupplier,
        text: newOrderText
      })
    });
    const json = await res.json();
    if (!res.ok) {
      setOrderMessage(json.error || "Fel");
      return;
    }
    const newOrder: Order = {
      id: "ord-" + Date.now(),
      customer: newOrderCustomer,
      supplier: newOrderSupplier,
      text: newOrderText,
      status: "Skickad"
    };
    setOrders([newOrder, ...orders]);
    setActivities([{ text: `Order skickad till ${newOrderSupplier} för ${newOrderCustomer}`, type: "Notering" }, ...activities]);
    setNewOrderText("");
    setOrderMessage(json.message);
  }

  async function createInvoice(order: Order) {
    setInvoiceMessage("Fakturerar...");
    const res = await fetch("/api/fortnox/create-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order })
    });
    const json = await res.json();
    if (!res.ok) {
      setInvoiceMessage(json.error || "Fel");
      return;
    }
    setOrders((prev) =>
      prev.map((x) => (x.id === order.id ? { ...x, status: "Fakturerad" } : x))
    );
    setActivities([{ text: `Faktura skapad för order ${order.id}`, type: "Notering" }, ...activities]);
    setInvoiceMessage(json.message);
  }

  async function sendLatestCustomerToFortnox() {
    if (!customers.length) return;
    setFortnoxMessage("Skickar...");
    const res = await fetch("/api/fortnox/send-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer: customers[0] })
    });
    const json = await res.json();
    setFortnoxMessage(res.ok ? json.message : json.error || "Fel");
  }

  function approveSync(id: string) {
    setSyncQueue((prev) => prev.map((x) => (x.id === id ? { ...x, status: "Approved" } : x)));
  }

  function rejectSync(id: string) {
    setSyncQueue((prev) => prev.map((x) => (x.id === id ? { ...x, status: "Rejected" } : x)));
  }

  async function askAI() {
    setAiAnswer("Tänker...");
    const res = await fetch("/api/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: aiQuestion,
        leads,
        customers,
        orders,
        activities
      })
    });
    const json = await res.json();
    setAiAnswer(res.ok ? json.answer : json.error || "Fel");
  }

  async function loadIntegration(provider: "fortnox" | "office365" | "teams" | "abr") {
    const endpoint =
      provider === "fortnox"
        ? "/api/integrations/fortnox/status"
        : provider === "office365"
        ? "/api/integrations/office365/status"
        : provider === "teams"
        ? "/api/integrations/teams/status"
        : "/api/integrations/abr/status";
    const res = await fetch(endpoint);
    const json = await res.json();
    setIntegrationInfo((prev) => ({ ...prev, [provider]: json.message || JSON.stringify(json) }));
  }

  function createUser() {
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      setAdminMessage("Fyll i namn, e-post och lösenord.");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === newUserEmail.trim().toLowerCase())) {
      setAdminMessage("Den e-posten finns redan.");
      return;
    }

    const isAdmin = newUserRole === "admin";
    const newUser: User = {
      id: "u-" + Date.now(),
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      password: newUserPassword,
      role: newUserRole,
      permissions: {
        dashboard: true,
        leads: true,
        customers: true,
        orders: true,
        activities: true,
        sync: isAdmin,
        integrations: isAdmin,
        admin: isAdmin
      },
      widgets: {
        stats: true,
        recentLeads: true,
        syncQueue: isAdmin,
        quickActions: true,
        integrations: isAdmin,
        ai: true
      }
    };

    setUsers([newUser, ...users]);
    setAdminMessage("Användare skapad.");
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserRole("employee");
  }

  function toggleSectionPermission(userId: string, section: SectionKey) {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId || u.role === "admin") return u;
        return { ...u, permissions: { ...u.permissions, [section]: !u.permissions[section] } };
      })
    );
  }

  function toggleWidget(userId: string, widget: WidgetKey) {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        return { ...u, widgets: { ...u.widgets, [widget]: !u.widgets[widget] } };
      })
    );
  }

  function setRole(userId: string, role: "admin" | "employee") {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        if (role === "admin") {
          return {
            ...u,
            role,
            permissions: {
              dashboard: true,
              leads: true,
              customers: true,
              orders: true,
              activities: true,
              sync: true,
              integrations: true,
              admin: true
            },
            widgets: {
              stats: true,
              recentLeads: true,
              syncQueue: true,
              quickActions: true,
              integrations: true,
              ai: true
            }
          };
        }
        return {
          ...u,
          role,
          permissions: {
            ...u.permissions,
            sync: false,
            integrations: false,
            admin: false
          },
          widgets: {
            ...u.widgets,
            syncQueue: false,
            integrations: false
          }
        };
      })
    );
  }

  const shell: React.CSSProperties = { maxWidth: 1240, margin: "0 auto", padding: 24, color: "#281414" };
  const hero: React.CSSProperties = { background: "linear-gradient(180deg,#5d0f18 0%,#861e2b 100%)", color: "white", borderRadius: 18, padding: 24, marginBottom: 18 };
  const card: React.CSSProperties = { background: "white", border: "1px solid #decbcd", borderRadius: 16, padding: 18, marginBottom: 16, boxShadow: "0 10px 25px rgba(93,15,24,0.06)" };
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
  const soft: React.CSSProperties = { background: "#fff2f3", color: "#7b1823", border: "1px solid #d8b4b9", borderRadius: 12, padding: "10px 16px", cursor: "pointer", fontWeight: 700 };

  if (!currentUser) {
    return (
      <div style={shell}>
        <div style={hero}>
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <Image src="/sodertorns-team-logo.svg" alt="Södertörns Team" width={240} height={82} />
            <div>
              <h1 style={{ margin: 0 }}>Södertörns Team</h1>
              <p>Adminstyrd dashboard med behörigheter, order, fakturering och integrationsförberedelse.</p>
            </div>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Logga in</h2>
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
    );
  }

  const allowedSections = (Object.keys(sectionLabels) as SectionKey[]).filter((x) => currentUser.permissions[x]);
  const widgets = currentUser.widgets;

  return (
    <div style={shell}>
      <div style={hero}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <Image src="/sodertorns-team-logo.svg" alt="Södertörns Team" width={240} height={82} />
            <div>
              <h1 style={{ margin: 0 }}>Södertörns Team</h1>
              <p style={{ marginBottom: 0 }}>Inloggad som {currentUser.name} ({currentUser.role})</p>
            </div>
          </div>
          <button style={soft} onClick={logout}>Logga ut</button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        {allowedSections.map((section) => (
          <button key={section} style={nav(tab === section)} onClick={() => setTab(section)}>
            {sectionLabels[section]}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div>
          {widgets.stats && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              <div style={card}><strong>Leads</strong><div>{leads.length}</div></div>
              <div style={card}><strong>Kunder</strong><div>{customers.length}</div></div>
              <div style={card}><strong>Order</strong><div>{orders.length}</div></div>
              <div style={card}><strong>Aktiviteter</strong><div>{activities.length}</div></div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
            {widgets.quickActions && (
              <div style={card}>
                <h2 style={{ marginTop: 0 }}>Snabbknappar</h2>
                <button style={primary} onClick={() => setTab("leads")}>Nytt lead</button>{" "}
                <button style={soft} onClick={() => setTab("orders")}>Ny order</button>{" "}
                <button style={soft} onClick={() => setTab("customers")}>Ny kund</button>
              </div>
            )}

            {widgets.ai && (
              <div style={card}>
                <h2 style={{ marginTop: 0 }}>AI-assistent</h2>
                <input style={input} value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} placeholder="Fråga om kund, offert eller säljsteg" />
                <br />
                <button style={primary} onClick={askAI}>Fråga</button>
                <p style={{ whiteSpace: "pre-wrap" }}>{aiAnswer}</p>
              </div>
            )}
          </div>

          {widgets.recentLeads && (
            <div style={card}>
              <h2 style={{ marginTop: 0 }}>Senaste leads</h2>
              <ul>{leads.slice(0, 5).map((lead, i) => <li key={i}>{lead.company} - {lead.contact} - {lead.status}</li>)}</ul>
            </div>
          )}

          {widgets.syncQueue && (
            <div style={card}>
              <h2 style={{ marginTop: 0 }}>Synk-kö</h2>
              <ul>{syncQueue.filter((x) => x.status === "Pending").map((item) => <li key={item.id}>{item.customerName}: {item.field} {item.oldValue} → {item.newValue}</li>)}</ul>
            </div>
          )}

          {widgets.integrations && (
            <div style={card}>
              <h2 style={{ marginTop: 0 }}>Integrationsstatus</h2>
              <button style={soft} onClick={() => loadIntegration("fortnox")}>Fortnox</button>{" "}
              <button style={soft} onClick={() => loadIntegration("office365")}>Office 365</button>{" "}
              <button style={soft} onClick={() => loadIntegration("teams")}>Teams</button>{" "}
              <button style={soft} onClick={() => loadIntegration("abr")}>ABR</button>
              <ul>
                <li>Fortnox: {integrationInfo.fortnox}</li>
                <li>Office 365: {integrationInfo.office365}</li>
                <li>Teams: {integrationInfo.teams}</li>
                <li>ABR: {integrationInfo.abr}</li>
              </ul>
            </div>
          )}
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
          <ul>{leads.map((lead, i) => <li key={i}>{lead.company} - {lead.contact} - {lead.segment} - {lead.status}</li>)}</ul>
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
          <p>Välj kund och leverantör. Ordern skickas som Fortnox-order i nästa steg och kan faktureras därifrån.</p>
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
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                {order.customer} - {order.supplier} - {order.text} - {order.status}
                {" "}
                {order.status !== "Fakturerad" && (
                  <button style={soft} onClick={() => createInvoice(order)}>Fakturera</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "activities" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Aktiviteter</h2>
          <select style={input} value={activityType} onChange={(e) => setActivityType(e.target.value as Activity["type"])}>
            <option>Samtal</option>
            <option>Mail</option>
            <option>Möte</option>
            <option>Notering</option>
          </select>
          <br />
          <input style={input} placeholder="Ny aktivitet" value={activityText} onChange={(e) => setActivityText(e.target.value)} />
          <br />
          <button style={primary} onClick={addActivity}>Lägg till aktivitet</button>
          <ul>{activities.map((activity, i) => <li key={i}>{activity.type} - {activity.text}</li>)}</ul>
        </div>
      )}

      {tab === "sync" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Synk-kö till Fortnox</h2>
          <p>Ny kundinfo går först hit för kontroll. Sedan godkänner admin innan Fortnox uppdateras.</p>
          <ul>
            {syncQueue.map((item) => (
              <li key={item.id}>
                {item.customerName} - {item.field}: {item.oldValue} → {item.newValue} - {item.status}
                {" "}
                {item.status === "Pending" && (
                  <>
                    <button style={soft} onClick={() => approveSync(item.id)}>Godkänn</button>{" "}
                    <button style={soft} onClick={() => rejectSync(item.id)}>Avvisa</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "integrations" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Fortnox</h2>
            <p>Kunder, order och fakturor.</p>
            <button style={primary} onClick={() => loadIntegration("fortnox")}>Ladda status</button>
            <p>{integrationInfo.fortnox}</p>
          </div>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Office 365</h2>
            <p>Mail, kalender och kontakter.</p>
            <button style={primary} onClick={() => loadIntegration("office365")}>Ladda status</button>
            <p>{integrationInfo.office365}</p>
          </div>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Teams</h2>
            <p>Möten, notiser och samarbete.</p>
            <button style={primary} onClick={() => loadIntegration("teams")}>Ladda status</button>
            <p>{integrationInfo.teams}</p>
          </div>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>ABR</h2>
            <p>Förberedd plats för tredje datakopplingen.</p>
            <button style={primary} onClick={() => loadIntegration("abr")}>Ladda status</button>
            <p>{integrationInfo.abr}</p>
          </div>
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
                      <input
                        type="checkbox"
                        checked={user.permissions[section]}
                        disabled={user.role === "admin"}
                        onChange={() => toggleSectionPermission(user.id, section)}
                      /> {sectionLabels[section]}
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: 8 }}>
                  <strong>Widgets:</strong><br />
                  {(Object.keys(widgetLabels) as WidgetKey[]).map((widget) => (
                    <label key={widget} style={{ display: "inline-block", marginRight: 12, marginBottom: 8 }}>
                      <input
                        type="checkbox"
                        checked={user.widgets[widget]}
                        onChange={() => toggleWidget(user.id, widget)}
                      /> {widgetLabels[widget]}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
