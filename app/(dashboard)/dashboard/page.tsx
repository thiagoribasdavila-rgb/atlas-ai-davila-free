"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [leads, setLeads] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [origem, setOrigem] = useState("site");

  const statusList = ["novo", "contato", "qualificado", "proposta", "fechado"];

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
      .order("created_at", { ascending: false });

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
      },
    ]);

    setNome("");
    setTelefone("");
    setEmail("");

    fetchLeads();
  }

  // 🔁 MUDAR STATUS
  async function updateStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);

    fetchLeads();
  }

  // 📊 KPIs
  const countByStatus = (status: string) =>
    leads.filter((l) => l.status === status).length;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {/* HEADER */}
      <h1>📊 CRM D'Avila Painel</h1>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {statusList.map((s) => (
          <div
            key={s}
            style={{
              padding: 10,
              background: "#f2f2f2",
              borderRadius: 10,
              minWidth: 120,
            }}
          >
            <strong>{s.toUpperCase()}</strong>
            <p>{countByStatus(s)}</p>
          </div>
        ))}
      </div>

      {/* FORM */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select value={origem} onChange={(e) => setOrigem(e.target.value)}>
          <option value="site">Site</option>
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <button onClick={handleCreateLead}>➕ Criar Lead</button>
      </div>

      {/* KANBAN */}
      <div style={{ display: "flex", gap: 15, marginTop: 30 }}>
        {statusList.map((status) => (
          <div
            key={status}
            style={{
              flex: 1,
              background: "#fafafa",
              padding: 10,
              borderRadius: 12,
              minHeight: 400,
            }}
          >
            <h3>{status.toUpperCase()}</h3>

            {leads
              .filter((l) => l.status === status)
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
                  <strong>{lead.nome}</strong>
                  <p>{lead.telefone}</p>
                  <p style={{ fontSize: 12 }}>{lead.email}</p>

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
