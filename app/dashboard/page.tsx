"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const stages = ["novo", "contato", "quente", "proposta", "fechado"];

export default function Dashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
      return;
    }

    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);

    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    setLeads(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    loadLeads();
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📊 Funil de Vendas CRM</h1>

      {loading && <p>Carregando...</p>}

      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          marginTop: 20,
        }}
      >
        {stages.map((stage) => (
          <div
            key={stage}
            style={{
              minWidth: 250,
              background: "#f4f4f4",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <h3 style={{ textTransform: "capitalize" }}>
              {stage}
            </h3>

            {leads
              .filter((l) => l.status === stage)
              .map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    background: "#fff",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 8,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <strong>{lead.nome || "Sem nome"}</strong>
                  <p style={{ fontSize: 12 }}>{lead.telefone}</p>
                  <p style={{ fontSize: 12 }}>
                    🏠 {lead.interesse || "Sem interesse"}
                  </p>

                  <div style={{ display: "flex", gap: 5 }}>
                    {stages.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(lead.id, s)}
                        style={{
                          fontSize: 10,
                          padding: 4,
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
