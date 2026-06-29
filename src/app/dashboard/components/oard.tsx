"use client";

import { useEffect, useState } from "react";
import { getLeads, updateLeadStatus } from "@/services/leadsService";
import LeadCard from "./LeadCard";

const columns = ["novo", "contato", "qualificado", "fechado"] as const;

export default function LeadsBoard() {
  const [leads, setLeads] = useState<any[]>([]);

  async function load() {
    const data = await getLeads();
    setLeads(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function move(id: string, status: any) {
    await updateLeadStatus(id, status);
    await load();
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginTop: 20,
      }}
    >
      {columns.map((col) => (
        <div
          key={col}
          style={{
            background: "#f4f4f4",
            padding: 12,
            borderRadius: 10,
            minHeight: 500,
          }}
        >
          <h3 style={{ textTransform: "capitalize" }}>
            {col}
          </h3>

          {leads
            .filter((l) => l.status === col)
            .map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onMove={move}
              />
            ))}
        </div>
      ))}
    </div>
  );
}
