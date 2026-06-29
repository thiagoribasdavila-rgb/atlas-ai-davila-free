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

  // 🔐 AUTH CHECK
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

  // ➕ CREATE LEAD
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

  // 🔁 UPDATE STATUS
  async function updateStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);

    fetchLeads();
  }

  // 📊 KPIs
  const count = (status: string) =>
    leads.filter((l) => l.status === status).length;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🏢 CRM D'Avila Dashboard</h1>

      {/* KPI CARDS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {statusList.map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              padding: 15,
              background: "#f4f4f4",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <h3>{s.toUpperCase()}</h3>
            <h2>{count(s)}</h2>
          </div>
        ))}
      </div>

      {/* FORM */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
