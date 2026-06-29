"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  // FORM
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [origem, setOrigem] = useState("site");

  // LEADS
  const [leads, setLeads] = useState<any[]>([]);

  // 🔐 LOGIN CHECK
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
    };
    checkUser();
  }, []);

  // 📥 BUSCAR LEADS (MULTI CORRETOR)
  async function fetchLeads() {
    const { data: userData } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", userData.user?.id);

    setLeads(data || []);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  // ➕ CRIAR LEAD (COM USUÁRIO)
  async function handleCreateLead() {
    const { data: userData } = await supabase.auth.getUser();

    await supabase.from("leads").insert([
      {
        nome,
        telefone,
        email,
        origem,
        status: "novo",
        user_id: userData.user?.id,
      },
    ]);

    setNome("");
    setTelefone("");
    setEmail("");

    fetchLeads();
  }

  // 🔁 MUDAR STATUS (KANBAN SIMPLES)
  async function updateStatus(id: string, status: string) {
    await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    fetchLeads();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM D'Avila</h1>

      {/* FORM LEAD */}
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

        <button onClick={handleCreateLead}>Criar Lead</button>
      </div>

      {/* KANBAN SIMPLES */}
      <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
        {["novo", "contato", "qualificado", "proposta", "fechado"].map(
          (status) => (
            <div
              key={status}
              style={{
                flex: 1,
                background: "#f5f5f5",
                padding: 10,
                borderRadius: 10,
                minHeight: 300,
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
                      <option value="novo">Novo</option>
                      <option value="contato">Contato</option>
                      <option value="qualificado">Qualificado</option>
                      <option value="proposta">Proposta</option>
                      <option value="fechado">Fechado</option>
                    </select>
                  </div>
                ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
