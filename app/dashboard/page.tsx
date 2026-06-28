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

  const [user, setUser] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  // 🔐 proteção login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(storedUser);

    loadLeads();
  }, []);

  function loadLeads() {
    const data = localStorage.getItem("leads");
    if (data) setLeads(JSON.parse(data));
  }

  function logout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  // 🧠 agrupamento por imóvel
  const grouped = leads.reduce((acc: any, lead) => {
    acc[lead.propertyId] = acc[lead.propertyId] || [];
    acc[lead.propertyId].push(lead);
    return acc;
  }, {});

  if (!user) return null;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1>CRM Imobiliário</h1>
          <p style={{ color: "#666" }}>
            Usuário: {user}
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            padding: "8px 12px",
            background: "black",
            color: "#fff",
            borderRadius: 6,
            border: "none",
          }}
        >
          Sair
        </button>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginTop: 20,
        }}
      >
        <div style={box}>
          <h3>Total de Leads</h3>
          <p>{leads.length}</p>
        </div>

        <div style={box}>
          <h3>Imóveis ativos</h3>
          <p>{Object.keys(grouped).length}</p>
        </div>

        <div style={box}>
          <h3>Conversão</h3>
          <p>{leads.length > 0 ? "Alta" : "Sem dados"}</p>
        </div>
      </div>

      {/* LEADS POR IMÓVEL */}
      <div style={{ marginTop: 30 }}>
        <h2>Leads por imóvel</h2>

        {Object.keys(grouped).length === 0 && (
          <p>Nenhum lead registrado ainda</p>
        )}

        {Object.entries(grouped).map(([propertyId, items]: any) => (
          <div key={propertyId} style={card}>
            <h3>Imóvel ID: {propertyId}</h3>

            <p style={{ fontSize: 12, color: "#666" }}>
              Total de leads: {items.length}
            </p>

            {/* classificação simples */}
            <p>
              Status:{" "}
              <strong>
                {items.length > 5
                  ? "🔥 Quente"
                  : items.length > 2
                  ? "⚡ Médio"
                  : "❄ Frio"}
              </strong>
            </p>

            <button
              onClick={() => router.push(`/imoveis/${propertyId}`)}
              style={{
                marginTop: 10,
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #ddd",
                background: "#fff",
              }}
            >
              Ver imóvel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🎨 estilos
const box = {
  padding: 15,
  border: "1px solid #ddd",
  borderRadius: 10,
};

const card = {
  marginTop: 15,
  padding: 15,
  border: "1px solid #e5e5e5",
  borderRadius: 10,
};
