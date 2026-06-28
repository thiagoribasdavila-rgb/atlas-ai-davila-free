"use client";

import { useEffect, useState } from "react";
import { getLeads, Lead, updateLeadStatus } from "@/lib/leads";
import { pipelineOrder } from "@/lib/pipeline";

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(getLeads());
  }, []);

  function move(id: string, status: any) {
    const nextIndex =
      pipelineOrder.indexOf(status) + 1;

    const nextStatus =
      pipelineOrder[nextIndex] || status;

    updateLeadStatus(id, nextStatus);
    setLeads(getLeads());
  }

  function getByStatus(status: string) {
    return leads.filter((l) => l.status === status);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM Imobiliário</h1>

      <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
        {pipelineOrder.map((status) => (
          <div
            key={status}
            style={{
              minWidth: 220,
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <h3>{status.toUpperCase()}</h3>

            {getByStatus(status).map((lead) => (
              <div
                key={lead.id}
                style={{
                  padding: 10,
                  marginBottom: 10,
                  border: "1px solid #eee",
                  borderRadius: 8,
                }}
              >
                <strong>{lead.name}</strong>
                <p>{lead.phone}</p>

                <button onClick={() => move(lead.id, lead.status)}>
                  Avançar →
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
