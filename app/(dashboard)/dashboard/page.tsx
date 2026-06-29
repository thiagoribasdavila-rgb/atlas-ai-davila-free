"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { classifyLeadAI } from "@/lib/classifyLeadAI";

type Lead = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  origem: string;
  status: string;
  user_id: string;
  assigned_index: number;
};

const colunas = ["novo", "contato", "proposta", "fechado"];

export default function Dashboard() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [origem, setOrigem] = useState("site");

  // =========================
  // LOGIN CHECK
  // =========================
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  // =========================
  // FETCH LEADS
  // =========================
  async function fetchLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("id", { ascending: false });

    setLeads(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  // =========================
  // MULTI CORRETORES (ROUND ROBIN)
  // =========================
  async function getCorretores() {
    const { data } = await supabase.auth.admin.listUsers();

    return data?.users || [];
  }

  // =========================
  // CREATE LEAD (COM IA + DISTRIBUIÇÃO)
  // =========================
  async function handleCreateLead() {
    const corretores = await getCorretores();

    const index = Math.floor(Math.random() * corretores.length);

    await supabase.from("leads").insert([
      {
        nome,
        telefone,
        email,
        origem,
        status: "novo",
        user_id: corretores[index]?.id,
        assigned_index: index,
      },
    ]);

    setNome("");
    setTelefone("");
    setEmail("");

    fetchLeads();
  }

  // =========================
  // MOVE KANBAN
  // =========================
  async function moveLead(id: string, status: string) {
    await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    fetchLeads();
  }

  // =========================
  // IA CLASSIFICAÇÃO (OPCIONAL)
  // =========================
  async function runAI(lead: Lead) {
    const novoStatus = await classifyLeadAI(lead);

    if (novoStatus) {
      await supabase
        .from("leads")
        .update({ status: novoStatus })
        .eq("id", lead.id);

      fetchLeads();
    }
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div style={{ padding: 20 }}>
      <h1>CRM D’Avila</h1>

      <p>Sistema online funcionando ✔</p>

      {/* ================= FORM ================= */}
      <div style={{ marginTop: 20 }}>
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

        <button onClick={handleCreateLead}>
          Enviar
        </button>
      </div>

      {/* ================= KANBAN ================= */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 40,
        }}
      >
        {colunas.map((coluna) => (
          <div
            key={coluna}
            style={{
              flex: 1,
              background: "#f5f5f5",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <h3>{coluna.toUpperCase()}</h3>

            {leads
              .filter((lead) => lead.status === coluna)
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

                  {/* MOVE LEAD */}
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      moveLead(lead.id, e.target.value)
                    }
                  >
                    {colunas.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {/* IA BUTTON */}
                  <button
                    onClick={() => runAI(lead)}
                    style={{ marginTop: 5 }}
                  >
                    IA classificar
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
