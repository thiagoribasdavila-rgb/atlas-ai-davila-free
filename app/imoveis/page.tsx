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

  // 🔐 proteção login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(storedUser);
  }, []);

  if (!user) return null;

  // 🔍 filtro inteligente
  const filtered = properties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());

    const matchType =
      type === "Todos" || p.type === type;

    const matchPrice = p.price <= maxPrice;

    return matchSearch && matchType && matchPrice;
  });

  function goTo(id: string) {
    router.push(routes.imovel(id));

    // 📊 registra lead simples (base CRM futuro)
    const leads = JSON.parse(localStorage.getItem("leads") || "[]");

    leads.push({
      id: crypto.randomUUID(),
      email: user,
      propertyId: id,
      date: new Date().toISOString(),
    });

    localStorage.setItem("leads", JSON.stringify(leads));
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {/* HEADER */}
      <h1>Imóveis disponíveis</h1>

      <p style={{ color: "#666" }}>
        Logado como: {user}
      </p>

      {/* FILTROS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {/* busca */}
        <input
          placeholder="Buscar imóvel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        {/* tipo */}
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

        {/* preço */}
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
        }}
      >
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => goTo(p.id)}
            style={card}
          >
            <h3>{p.title}</h3>

            <p style={{ color: "#666" }}>{p.location}</p>

            <p style={{ fontSize: 12 }}>{p.type}</p>

            <strong>
              R$ {p.price.toLocaleString("pt-BR")}
            </strong>
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
  cursor: "pointer",
};
