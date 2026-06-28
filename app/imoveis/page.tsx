"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { properties } from "@/lib/properties";
import { routes } from "@/lib/appRoutes";

export default function ImoveisPage() {
  const router = useRouter();

  const [user, setUser] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Todos");
  const [maxPrice, setMaxPrice] = useState(5000000);

  // 🔐 login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(storedUser);
  }, []);

  if (!user) return null;

  // 🔍 filtro
  const filtered = properties.filter((p) => {
    return (
      (type === "Todos" || p.type === type) &&
      p.price <= maxPrice &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // 📊 salvar lead
  function saveLead(propertyId: string) {
    const leads = JSON.parse(localStorage.getItem("leads") || "[]");

    leads.push({
      id: crypto.randomUUID(),
      email: user,
      propertyId,
      date: new Date().toISOString(),
    });

    localStorage.setItem("leads", JSON.stringify(leads));
  }

  // 📲 WHATSAPP AUTOMÁTICO
  function openWhatsApp(property: any) {
    saveLead(property.id);

    const message = `Olá! Tenho interesse no imóvel: ${property.title} - ${property.location}`;

    const phone = "5511999999999"; // 🔥 trocar para seu número

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }

  // 🧭 ver imóvel
  function goTo(id: string) {
    router.push(routes.imovel(id));
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {/* HEADER */}
      <h1>Imóveis disponíveis</h1>

      <p style={{ color: "#666" }}>Logado como: {user}</p>

      {/* FILTROS */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={input}
        >
          <option value="Todos">Todos</option>
          <option value="Apartamento">Apartamento</option>
          <option value="Cobertura">Cobertura</option>
          <option value="Studio">Studio</option>
        </select>

        <input
          type="range"
          min={300000}
          max={5000000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />

        <span>Até R$ {maxPrice.toLocaleString("pt-BR")}</span>
      </div>

      {/* LISTA */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 15,
          marginTop: 20,
        }}
      >
        {filtered.map((p) => (
          <div key={p.id} style={card}>
            <h3 onClick={() => goTo(p.id)}>{p.title}</h3>

            <p>{p.location}</p>
            <p style={{ fontSize: 12 }}>{p.type}</p>

            <strong>
              R$ {p.price.toLocaleString("pt-BR")}
            </strong>

            {/* 💥 BOTÃO WHATSAPP */}
            <button
              onClick={() => openWhatsApp(p)}
              style={whatsappBtn}
            >
              Falar no WhatsApp
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🎨 estilos
const input = {
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6,
};

const card = {
  padding: 15,
  border: "1px solid #e5e5e5",
  borderRadius: 10,
};

const whatsappBtn = {
  marginTop: 10,
  padding: "8px 10px",
  background: "#25D366",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
