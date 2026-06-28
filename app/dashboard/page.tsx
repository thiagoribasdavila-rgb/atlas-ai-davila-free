"use client";

import { useEffect, useState } from "react";
import { getLeads, updateLeadStatus, Lead } from "@/lib/leads";
import { nextStatus } from "@/lib/pipeline";

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(getLeads());
  }, []);

  function moveLead(id: string, current: any) {
    updateLeadStatus(id, nextStatus(current));
    setLeads(getLeads());
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM Dashboard</h1>

      <div style={{ display: "grid", gap: 10 }}>
        {leads.map((lead) => (
          <div
            key={lead.id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <h3>{lead.name}</h3>
            <p>{lead.phone}</p>
            <p>Interesse: {lead.interest}</p>
            <strong>Status: {lead.status}</strong>

            <br />

            <button onClick={() => moveLead(lead.id, lead.status)}>
              Avançar etapa →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
