"use client";

import { useEffect, useState } from "react";
import { getLeads, updateLeadStage } from "@/services/leadsService";
import LeadModal from "./LeadModal";

const STAGES = [
  { key: "novo", label: "🟡 Novo" },
  { key: "contato", label: "🔵 Em contato" },
  { key: "qualificado", label: "🟣 Qualificado" },
  { key: "proposta", label: "🟢 Proposta" },
  { key: "fechado", label: "🔴 Fechado" },
];

export default function LeadPipeline() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getLeads();
    setLeads(data);
  }

  async function handleDrop(leadId: string, newStage: string) {
    await updateLeadStage(leadId, newStage);
    load();
  }

  return (
    <div style={{ display: "flex", gap: 16, padding: 20 }}>
      
      {STAGES.map((stage) => (
        <div
          key={stage.key}
          style={{
            flex: 1,
            background: "#f4f4f4",
            padding: 12,
            borderRadius: 8,
            minHeight: 500,
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const leadId = e.dataTransfer.getData("leadId");
            handleDrop(leadId, stage.key);
          }}
        >
          <h3>{stage.label}</h3>

          {leads
            .filter((l) => l.stage === stage.key)
            .map((lead) => (
              <div
                key={lead.id}
                draggable
                onClick={() => setSelectedLead(lead)}
                onDragStart={(e) =>
                  e.dataTransfer.setData("leadId", lead.id)
                }
                style={{
                  background: "white",
                  padding: 10,
                  marginBottom: 8,
                  borderRadius: 6,
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                <strong>{lead.nome}</strong>
                <br />
                <small>{lead.telefone}</small>
              </div>
            ))}
        </div>
      ))}

      {/* MODAL */}
      <LeadModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={load}
      />
    </div>
  );
}
