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

  // 🔐 LOGIN CHECK
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
    };

    checkUser();
  }, []);

  // 📥 LOAD LEADS
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

  // ➕ CREATE LEAD (AUTO)
  async function handleCreateLead() {
    if (!user) return;

    const { data } = await supabase
      .from("leads")
      .insert([
        {
          nome,
          telefone,
          email,
          origem,
          status: "novo",
          user_id: user.id,
          score: 0,
        },
      ])
      .select()
      .single();

    if (!data) return;

    setNome("");
    setTelefone("");
    setEmail("");

    fetchLeads();
  }

  // 🔁 UPDATE STATUS
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
      <h1>🏢 CRM D’Avila DASHBOARD</h1>

      {/* 📊 KPIs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={box}>Total: {total}</div>
        <div style={box}>Novo: {novo}</div>
        <div style={box}>Contato: {contato}</div>
        <div style={box}>Proposta: {proposta}</div>
        <div style={box}>Fechado: {fechado}</div>
      </div>

      {/* ➕ FORM */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
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

      {/* 📦 KANBAN */}
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

                  <p style={{ fontSize: 12 }}>
                    Score: {lead.score || 0}
                  </p>

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

const box = {
  flex: 1,
  padding: 10,
  background: "#eee",
  borderRadius: 8,
  textAlign: "center",
};
