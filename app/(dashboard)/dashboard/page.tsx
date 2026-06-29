"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

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

  // 📥 carregar leads
  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setLeads(data || []);
  }

  // ➕ criar lead
  async function handleCreateLead() {
    const { error } = await supabase.from("leads").insert([
      {
        nome,
        telefone,
        email,
        origem: "dashboard",
        status: "novo",
      },
    ]);

    if (error) {
      console.log(error);
      alert("Erro ao salvar lead");
      return;
    }

    setNome("");
    setTelefone("");
    setEmail("");

    fetchLeads();
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>CRM D'Avila</h1>
      <p>Sistema online funcionando ✔</p>

      {/* FORMULÁRIO */}
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
          Enviar Lead
        </button>
      </div>

      {/* LISTA DE LEADS */}
      <div style={{ marginTop: 40 }}>
        <h2>Leads</h2>

        {leads.map((lead) => (
          <div
            key={lead.id}
            style={{
              padding: 10,
              border: "1px solid #ddd",
              marginBottom: 10,
            }}
          >
            <p><b>{lead.nome}</b></p>
            <p>{lead.telefone}</p>
            <p>{lead.email}</p>
            <p>Status: {lead.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
