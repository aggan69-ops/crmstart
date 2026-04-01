const BASE_URL = process.env.FORTNOX_BASE_URL || "https://api.fortnox.se/3";

function getHeaders() {
  const accessToken = process.env.FORTNOX_ACCESS_TOKEN;
  const clientSecret = process.env.FORTNOX_CLIENT_SECRET;
  if (!accessToken || !clientSecret) throw new Error("Fortnox-miljövariabler saknas");
  return {
    "Access-Token": accessToken,
    "Client-Secret": clientSecret,
    "Content-Type": "application/json",
    Accept: "application/json"
  };
}

export function hasFortnoxCredentials() {
  return Boolean(process.env.FORTNOX_ACCESS_TOKEN && process.env.FORTNOX_CLIENT_SECRET);
}

export async function fortnoxCreateCustomer(customer: { name: string; orgNumber?: string; city?: string; email?: string; }) {
  const response = await fetch(`${BASE_URL}/customers`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      Customer: {
        Name: customer.name,
        OrganisationNumber: customer.orgNumber || "",
        City: customer.city || "",
        Email: customer.email || ""
      }
    }),
    cache: "no-store"
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Fortnox customer error ${response.status}: ${text}`);
  return text;
}

export async function fortnoxCreateOrder(order: { customer: string; supplier: string; text: string; }) {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      Order: {
        CustomerNumber: order.customer,
        YourReference: order.supplier,
        Comments: order.text
      }
    }),
    cache: "no-store"
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Fortnox order error ${response.status}: ${text}`);
  return text;
}

export async function fortnoxCreateInvoice(input: { customer: string; text: string; }) {
  const response = await fetch(`${BASE_URL}/invoices`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      Invoice: {
        CustomerNumber: input.customer,
        Comments: input.text
      }
    }),
    cache: "no-store"
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Fortnox invoice error ${response.status}: ${text}`);
  return text;
}
