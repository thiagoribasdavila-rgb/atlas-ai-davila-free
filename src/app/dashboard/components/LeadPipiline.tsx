"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LeadModal from "./LeadModal";
import { updateLeadStage } from "@/services/leadsService";

const STAGES = [
  { key: "novo", label: "🟡 Novo" },
  { key: "contato", label: "🔵 Em contato" },
  { key: "qualificado", label: "🟣 Qualificado" },
  { key: "proposta", label: "🟢 Proposta" },
  { key: "fechado", label: "🔴 Fechado" },
];

export default function LeadPipeline({ userId }: any) {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  useEffect(() => {
    loadLeads();
  }, [userId]);

  async function loadLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setLeads(data || []);
  }

  async function handleDrop(leadId: string, newStage: string) {
    await updateLeadStage(leadId, newStage);
    loadLeads();
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

      <LeadModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={loadLeads}
      />
    </div>
  );
}
