"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const stages = [
  "novo",
  "contato",
  "qualificado",
  "proposta",
  "fechado",
  "perdido",
];

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("leads").select("*");
    setLeads(data || []);
  }

  async function moveLead(id: string, stage: string) {
    await supabase
      .from("leads")
      .update({ stage })
      .eq("id", id);

    load();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM Imobiliário - Funil</h1>

      <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
        {stages.map((stage) => (
          <div
            key={stage}
            style={{
              minWidth: 260,
              background: "#f4f4f4",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <h3>{stage.toUpperCase()}</h3>

            {leads
              .filter((l) => l.stage === stage)
              .map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    background: "white",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 8,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <b>{lead.nome}</b>
                  <p>{lead.telefone}</p>

                  <select
                    value={lead.stage}
                    onChange={(e) =>
                      moveLead(lead.id, e.target.value)
                    }
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
