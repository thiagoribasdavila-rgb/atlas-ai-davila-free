"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [origem, setOrigem] = useState("site");

  const statusList = ["novo", "contato", "proposta", "fechado"];

  // 🔐 LOGIN
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
    };

    check();
  }, []);

  // 📥 LEADS
  async function fetchLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("id", { ascending: false });

    setLeads(data || []);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  // ➕ CRIAR LEAD
  async function handleCreateLead() {
    if (!user) return;

    await supabase.from("leads").insert([
      {
        nome,
        telefone,
        email,
        origem,
        status: "novo",
        user_id: user.id,
        score: 0,
      },
    ]);

    setNome("");
    setTelefone("");
    setEmail("");

    fetchLeads();
  }

  // 🔁 STATUS
  async function updateStatus(id: string, status: string) {
    await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    fetchLeads();
  }

  // 📊 KPIs
  const total = leads.length;
  const novo = leads.filter(l => l.status === "novo").length;
  const contato = leads.filter(l => l.status === "contato").length;
  const proposta = leads.filter(l => l.status === "proposta").length;
  const fechado = leads.filter(l => l.status === "fechado").length;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🏢 CRM DASHBOARD</h1>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Card title="Total" value={total} />
        <Card title="Novo" value={novo} />
        <Card title="Contato" value={contato} />
        <Card title="Proposta" value={proposta} />
        <Card title="Fechado" value={fechado} />
      </div>

      {/* FORM */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <select value={origem} onChange={(e) => setOrigem(e.target.value)}>
          <option value="site">Site</option>
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <button onClick={handleCreateLead}>➕ Criar Lead</button>
      </div>

      {/* KANBAN */}
      <div style={{ display: "flex", gap: 10 }}>
        {statusList.map((status) => (
          <div
            key={status}
            style={{
              flex: 1,
              background: "#f4f4f4",
              padding: 10,
              borderRadius: 10,
              minHeight: 500,
            }}
          >
            <h3>{status.toUpperCase()}</h3>

            {leads
              .filter((lead) => lead.status === status)
              .map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    background: "#fff",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 8,
                  }}
                >
                  <b>{lead.nome}</b>
                  <p>{lead.telefone}</p>

                  <small>Score: {lead.score || 0}</small>

                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateStatus(lead.id, e.target.value)
                    }
                  >
                    {statusList.map((s) => (
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

// 📦 CARD KPI
function Card({ title, value }: any) {
  return (
    <div
      style={{
        flex: 1,
        background: "#eee",
        padding: 10,
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
