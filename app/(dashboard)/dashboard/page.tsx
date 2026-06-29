"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [origem, setOrigem] = useState("site");

  const [leads, setLeads] = useState<any[]>([]);

  // 🔐 LOGIN CHECK
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
    };
    checkUser();
  }, []);

  // 📥 BUSCAR LEADS (MULTI-CORRETOR)
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

  // ➕ CRIAR LEAD (COM DONO)
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

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM D'Avila</h1>

      {/* FORM */}
      <div style={{ display: "flex", gap: 10 }}>
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

      {/* LISTA */}
      <div style={{ marginTop: 20 }}>
        {leads.map((lead) => (
          <div
            key={lead.id}
            style={{
              padding: 10,
              marginBottom: 10,
              border: "1px solid #ddd",
            }}
          >
            <strong>{lead.nome}</strong>
            <p>{lead.telefone}</p>
            <p>{lead.email}</p>
            <small>Status: {lead.status}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
