"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  status: string;
  user_id: string;
};

type User = {
  id: string;
  email: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // CHECK ADMIN LOGIN
  // =========================
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      }
    };

    check();
  }, [router]);

  // =========================
  // FETCH ALL LEADS
  // =========================
  async function fetchLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("id", { ascending: false });

    setLeads(data || []);
  }

  // =========================
  // FETCH USERS (CORRETORES)
  // =========================
  async function fetchUsers() {
    const { data } = await supabase.auth.admin.listUsers();

    setUsers(data?.users || []);
  }

  useEffect(() => {
    fetchLeads();
    fetchUsers();
    setLoading(false);
  }, []);

  // =========================
  // KPIs
  // =========================
  const totalLeads = leads.length;

  const porStatus = {
    novo: leads.filter((l) => l.status === "novo").length,
    contato: leads.filter((l) => l.status === "contato").length,
    proposta: leads.filter((l) => l.status === "proposta").length,
    fechado: leads.filter((l) => l.status === "fechado").length,
  };

  // =========================
  // RANKING CORRETORES
  // =========================
  function getRanking(userId: string) {
    return leads.filter((l) => l.user_id === userId).length;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>ADMIN CRM D’AVILA</h1>

      {/* ================= KPI ================= */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div>Total Leads: {totalLeads}</div>
        <div>Novo: {porStatus.novo}</div>
        <div>Contato: {porStatus.contato}</div>
        <div>Proposta: {porStatus.proposta}</div>
        <div>Fechado: {porStatus.fechado}</div>
      </div>

      {/* ================= RANKING ================= */}
      <h2 style={{ marginTop: 40 }}>Ranking Corretores</h2>

      <div>
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              padding: 10,
              marginBottom: 10,
              background: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            <p><b>{u.email}</b></p>
            <p>Leads: {getRanking(u.id)}</p>
          </div>
        ))}
      </div>

      {/* ================= LEADS TABLE ================= */}
      <h2 style={{ marginTop: 40 }}>Todos os Leads</h2>

      <table width="100%" border={1}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Corretor</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.nome}</td>
              <td>{lead.telefone}</td>
              <td>{lead.status}</td>
              <td>{lead.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
