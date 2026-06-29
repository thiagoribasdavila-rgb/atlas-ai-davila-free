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

  // 🔐 check login
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      }
    };

    checkUser();
  }, []);

  // 📥 buscar leads
  useEffect(() => {
    const fetchLeads = async () => {
      const { data } = await supabase.from("leads").select("*");
      setLeads(data || []);
    };

    fetchLeads();
  }, []);

  // ➕ criar lead
  async function handleCreateLead() {
    const { error } = await supabase.from("leads").insert([
      {
        nome,
        telefone,
        email,
        origem,
        status: "novo",
      },
    ]);

    if (!error) {
      alert("Lead criado!");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM D'Avila</h1>

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

      <button onClick={handleCreateLead}>Enviar</button>

      <hr />

      <h2>Leads</h2>

      {leads.map((lead, i) => (
        <div key={i}>
          {lead.nome} - {lead.telefone} - {lead.status}
        </div>
      ))}
    </div>
  );
}
