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

  const statusList = ["novo", "contato", "qualificado", "proposta", "fechado"];

  // 🔐 LOGIN
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

  // 🤖 IA SIMPLES (CLASSIFICA LEAD)
  function classifyLead(lead: any) {
    const text = `${lead.nome} ${lead.email} ${lead.telefone}`.toLowerCase();

    if (text.includes("urgente") || text.includes("agora") || text.includes("comprar")) {
      return "quente";
    }

    if (text.includes("preço") || text.includes("valor") || text.includes("interesse")) {
      return "morno";
    }

    return "frio";
  }

  // 📥 LEADS
  async function fetchLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("id", { ascending: false });

    const enriched = (data || []).map((lead) => ({
      ...lead,
      ai_status: classifyLead(lead),
    }));

    setLeads(enriched);
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

  // 🔁 STATUS
  async function updateStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);

    fetchLeads();
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🤖 CRM D'Avila - IA Inteligente</h1>

      {/* FORM */}
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
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <strong>{lead.nome}</strong>
                  <p>{lead.telefone}</p>
                  <small>{lead.email}</small>

                  {/* 🤖 IA STATUS */}
                  <p>
                    IA:{" "}
                    <b
                      style={{
                        color:
                          lead.ai_status === "quente"
                            ? "red"
                            : lead.ai_status === "morno"
                            ? "orange"
                            : "gray",
                      }}
                    >
                      {lead.ai_status}
                    </b>
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
