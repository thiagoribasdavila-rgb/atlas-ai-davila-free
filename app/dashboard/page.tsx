"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  email: string;
  propertyId: string;
  date: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [user, setUser] = useState<string | null>(null);

  // 🔐 proteção de acesso
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(storedUser);

    loadLeads();
  }, []);

  // 📊 carregar leads (simulado localStorage)
  function loadLeads() {
    const data = localStorage.getItem("leads");

    if (data) {
      setLeads(JSON.parse(data));
    }
  }

  // 🚪 logout
  function logout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  // 🧠 limpar leads
  function clearLeads() {
    localStorage.removeItem("leads");
    setLeads([]);
  }

  if (!user) return null;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h1>Dashboard de Leads</h1>
          <p style={{ color: "#666" }}>
            Usuário: {user}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => router.push("/imoveis")}
            style={{
              padding: "8px 12px",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Imóveis
          </button>

          <button
            onClick={logout}
            style={{
              padding: "8px 12px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div style={box}>
          <h3>Total de Leads</h3>
          <p style={{ fontSize: 22 }}>{leads.length}</p>
        </div>

        <div style={box}>
          <h3>Imóveis Ativos</h3>
          <p style={{ fontSize: 22 }}>
            {new Set(leads.map((l) => l.propertyId)).size}
          </p>
        </div>

        <div style={box}>
          <h3>Último Lead</h3>
          <p style={{ fontSize: 14 }}>
            {leads[0]?.date || "Nenhum"}
          </p>
        </div>
      </div>

      {/* LEADS LIST */}
      <div>
        <h2>Leads recentes</h2>

        <button
          onClick={clearLeads}
          style={{
            marginBottom: 10,
            padding: "6px 10px",
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Limpar leads
        </button>

        {leads.length === 0 ? (
          <p>Nenhum lead registrado</p>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} style={leadBox}>
              <p><strong>Email:</strong> {lead.email}</p>
              <p><strong>Imóvel:</strong> {lead.propertyId}</p>
              <p><strong>Data:</strong> {lead.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 🎨 estilos simples
const box = {
  padding: 15,
  border: "1px solid #ddd",
  borderRadius: 10,
};

const leadBox = {
  padding: 10,
  border: "1px solid #eee",
  marginBottom: 10,
  borderRadius: 8,
};
