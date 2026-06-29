"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { scoreLeadAI } from "@/lib/scoreLeadAI";

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

  // 📥 BUSCAR LEADS
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

  // 🤖 IA SCORE (PASSO 2 PRINCIPAL)
  async function handleScoreLead(lead: any) {
    const score = await scoreLeadAI(lead);

    await supabase
      .from("leads")
      .update({ score })
      .eq("id", lead.id);

    fetchLeads();
  }

  // 🔁 MUDAR STATUS
  async function updateStatus(id: string, status: string) {
    await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    fetchLeads();
  }

  // 📊 SCORE COLOR
  function getColor(score: number) {
    if (score >= 70) return "green";
    if (score >= 30) return "orange";
    return "red";
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🤖 CRM D'Avila - IA Dashboard</h1>

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

        <button onClick={handleCreateLead}>
          ➕ Criar Lead
        </button>
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
                  <p><b>{lead.nome}</b></p>
                  <p>{lead.telefone}</p>

                  {/* SCORE IA */}
                  <p>
                    Score:{" "}
                    <b style={{ color: getColor(lead.score || 0) }}>
                      {lead.score || 0}
                    </b>
                  </p>

                  {/* BOTÃO IA */}
                  <button
                    onClick={() => handleScoreLead(lead)}
                  >
                    🤖 Calcular IA
                  </button>

                  {/* STATUS */}
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
