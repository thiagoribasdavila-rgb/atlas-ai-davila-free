"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const colunas = [
  "novo",
  "contato",
  "qualificado",
  "proposta",
  "fechado",
];

export default function Dashboard() {
  const router = useRouter();

  const [leads, setLeads] = useState<any[]>([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [origem, setOrigem] = useState("site");

  // 🔐 login check
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
    };
    checkUser();
  }, []);

  // 📥 buscar leads
  async function fetchLeads() {
    const { data } = await supabase.from("leads").select("*");
    setLeads(data || []);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  // ➕ criar lead
  async function handleCreateLead() {
    await supabase.from("leads").insert([
      {
        nome,
        telefone,
        email,
        origem,
        status: "novo",
      },
    ]);

    setNome("");
    setTelefone("");
    setEmail("");

    fetchLeads();
  }

  // 🔁 mover card
  async function moveLead(id: string, status: string) {
    await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    fetchLeads();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM D'Avila — Kanban</h1>

      {/* FORM */}
      <div style={{ display: "flex", gap: 10 }}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <select value={origem} onChange={(e) => setOrigem(e.target.value)}>
          <option value="site">Site</option>
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <button onClick={handleCreateLead}>Criar Lead</button>
      </div>

      <hr />

      {/* KANBAN */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        {colunas.map((coluna) => (
          <div
            key={coluna}
            style={{
              flex: 1,
              background: "#f4f4f4",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <h3>{coluna.toUpperCase()}</h3>

            {leads
              .filter((l) => l.status === coluna)
              .map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    background: "white",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 8,
                  }}
                >
                  <strong>{lead.nome}</strong>
                  <p>{lead.telefone}</p>

                  {/* mover */}
                  <select
                    value={lead.status}
                    onChange={(e) => moveLead(lead.id, e.target.value)}
                  >
                    {colunas.map((c) => (
                      <option key={c} value={c}>
                        {c}
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
