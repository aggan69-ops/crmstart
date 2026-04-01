"use client";

import { useState } from "react";

type Lead = {
  company: string;
  contact: string;
};

export default function LeadsPage() {
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [leads, setLeads] = useState<Lead[]>([
    { company: "Nordtrafik Service AB", contact: "Anders Holm" },
    { company: "Stålverk Mekaniska", contact: "Maria Eng" }
  ]);

  function addLead() {
    if (!company.trim() || !contact.trim()) return;
    setLeads([{ company: company.trim(), contact: contact.trim() }, ...leads]);
    setCompany("");
    setContact("");
  }

  return (
    <div>
      <h1>Leads</h1>
      <p>Enkel lista. Inget extra.</p>

      <div>
        <input
          placeholder="Företag"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div>
        <input
          placeholder="Kontakt"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>

      <div>
        <button onClick={addLead}>Lägg till lead</button>
      </div>

      <hr />

      <ul>
        {leads.map((lead, index) => (
          <li key={index}>
            {lead.company} - {lead.contact}
          </li>
        ))}
      </ul>

      <p>
        <a href="/">Tillbaka</a>
      </p>
    </div>
  );
}