"use client";

import { useEffect, useState } from "react";

type Lead = { company: string; contact: string };
type Customer = { name: string; city: string };
type Order = { customer: string; text: string };
type Activity = { text: string };

const defaultLeads: Lead[] = [
  { company: "Nordtrafik Service AB", contact: "Anders Holm" },
  { company: "Stålverk Mekaniska", contact: "Maria Eng" }
];

const defaultCustomers: Customer[] = [
  { name: "Mälarfrakt AB", city: "Västerås" },
  { name: "Söder Verkstad", city: "Nykvarn" }
];

const defaultOrders: Order[] = [
  { customer: "Mälarfrakt AB", text: "Order 1" },
  { customer: "Söder Verkstad", text: "Order 2" }
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

  const [leadCompany, setLeadCompany] = useState("");
  const [leadContact, setLeadContact] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerCity, setCustomerCity] = useState("");

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

  useEffect(() => {
    localStorage.setItem("crm_leads", JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem("crm_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("crm_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("crm_activities", JSON.stringify(activities));
  }, [activities]);

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

  function resetAll() {
    localStorage.removeItem("crm_leads");
    localStorage.removeItem("crm_customers");
    localStorage.removeItem("crm_orders");
    localStorage.removeItem("crm_activities");
    setLeads(defaultLeads);
    setCustomers(defaultCustomers);
    setOrders(defaultOrders);
    setActivities(defaultActivities);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>CRM</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab("home")}>Hem</button>{" "}
        <button onClick={() => setTab("leads")}>Leads</button>{" "}
        <button onClick={() => setTab("customers")}>Kunder</button>{" "}
        <button onClick={() => setTab("orders")}>Order</button>{" "}
        <button onClick={() => setTab("activities")}>Aktiviteter</button>{" "}
        <button onClick={() => setTab("settings")}>Inställningar</button>
      </div>

      {tab === "home" && (
        <div>
          <p>Enkel färdig CRM-version.</p>
          <ul>
            <li>Leads: {leads.length}</li>
            <li>Kunder: {customers.length}</li>
            <li>Order: {orders.length}</li>
            <li>Aktiviteter: {activities.length}</li>
          </ul>
        </div>
      )}

      {tab === "leads" && (
        <div>
          <h2>Leads</h2>
          <div>
            <input
              placeholder="Företag"
              value={leadCompany}
              onChange={(e) => setLeadCompany(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="Kontakt"
              value={leadContact}
              onChange={(e) => setLeadContact(e.target.value)}
            />
          </div>
          <div>
            <button onClick={addLead}>Lägg till lead</button>
          </div>
          <ul>
            {leads.map((lead, i) => (
              <li key={i}>{lead.company} - {lead.contact}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "customers" && (
        <div>
          <h2>Kunder</h2>
          <div>
            <input
              placeholder="Kundnamn"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="Stad"
              value={customerCity}
              onChange={(e) => setCustomerCity(e.target.value)}
            />
          </div>
          <div>
            <button onClick={addCustomer}>Lägg till kund</button>
          </div>
          <ul>
            {customers.map((customer, i) => (
              <li key={i}>{customer.name} - {customer.city}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "orders" && (
        <div>
          <h2>Order</h2>
          <div>
            <input
              placeholder="Kund"
              value={orderCustomer}
              onChange={(e) => setOrderCustomer(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="Ordertext"
              value={orderText}
              onChange={(e) => setOrderText(e.target.value)}
            />
          </div>
          <div>
            <button onClick={addOrder}>Lägg till order</button>
          </div>
          <ul>
            {orders.map((order, i) => (
              <li key={i}>{order.customer} - {order.text}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "activities" && (
        <div>
          <h2>Aktiviteter</h2>
          <div>
            <input
              placeholder="Aktivitet"
              value={activityText}
              onChange={(e) => setActivityText(e.target.value)}
            />
          </div>
          <div>
            <button onClick={addActivity}>Lägg till aktivitet</button>
          </div>
          <ul>
            {activities.map((activity, i) => (
              <li key={i}>{activity.text}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "settings" && (
        <div>
          <h2>Inställningar</h2>
          <button onClick={resetAll}>Återställ allt</button>
        </div>
      )}
    </div>
  );
}