"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { properties } from "@/lib/properties";
import { routes } from "@/lib/appRoutes";

export default function ImoveisPage() {
  const router = useRouter();

  const [user, setUser] = useState<string | null>(null);

  // 🔐 proteção de acesso
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(storedUser);
  }, []);

  // 🚪 logout
  function logout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  // 🚀 navegação segura (evita duplicação)
  function goToProperty(id: string) {
    const route = routes.imovel(id);

    const current = window.location.pathname;

    // evita abrir mesma página
    if (current === route) return;

    router.push(route);
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
          <h1 style={{ margin: 0 }}>Imóveis disponíveis</h1>
          <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
            Bem-vindo, {user}
          </p>
        </div>

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

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {properties.map((p) => (
          <div
            key={p.id}
            onClick={() => goToProperty(p.id)}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 12,
              padding: 16,
              cursor: "pointer",
              transition: "0.2s",
              background: "#fff",
            }}
          >
            <h2 style={{ fontSize: 16, marginBottom: 8 }}>
              {p.title}
            </h2>

            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
              📍 {p.location}
            </p>

            <p style={{ margin: "6px 0", fontSize: 12, color: "#999" }}>
              {p.type}
            </p>

            <strong style={{ display: "block", marginTop: 10 }}>
              R$ {p.price.toLocaleString("pt-BR")}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
