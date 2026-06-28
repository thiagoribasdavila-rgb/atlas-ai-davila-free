"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setLeads(data || []);
    }

    setLoading(false);
  }

  const total = leads.length;
  const novos = leads.filter((l) => l.status === "novo").length;
  const quentes = leads.filter((l) => l.status === "quente").length;
  const fechados = leads.filter((l) => l.status === "fechado").length;

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>
        📊 CRM Dashboard
      </h1>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <Card title="Total Leads" value={total} />
        <Card title="Novos" value={novos} />
        <Card title="Quentes" value={quentes} />
        <Card title="Fechados" value={fechados} />
      </div>

      {/* Leads list */}
      <div style={{ marginTop: 40 }}>
        <h2>📋 Últimos Leads</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div style={{ marginTop: 10 }}>
            {leads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  padding: 15,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <strong>{lead.nome || "Sem nome"}</strong>
                <p>📞 {lead.telefone}</p>
                <p>📍 Status: {lead.status}</p>
                <p>🏠 Interesse: {lead.interesse}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        borderRadius: 12,
        background: "#111",
        color: "#fff",
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 24, marginTop: 10 }}>{value}</p>
    </div>
  );
}
