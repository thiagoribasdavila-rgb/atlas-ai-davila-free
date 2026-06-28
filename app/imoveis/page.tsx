"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { properties } from "@/lib/properties";

export default function ImoveisPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(stored));
  }, []);

  if (!user) return null;

  function saveLead(propertyId: string) {
    const leads = JSON.parse(localStorage.getItem("leads") || "[]");

    leads.push({
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      email: user.email,
      propertyId,
      date: new Date().toISOString(),
    });

    localStorage.setItem("leads", JSON.stringify(leads));
  }

  function openWhatsApp(property: any) {
    saveLead(property.id);

    const message = `Olá! Sou ${user.name}, tenho interesse no imóvel: ${property.title}`;

    const phone = "5511999999999";

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Imóveis</h1>

      <p>Corretor: {user.name}</p>

      <div style={{ display: "grid", gap: 10 }}>
        {properties.map((p) => (
          <div key={p.id} style={card}>
            <h3>{p.title}</h3>
            <p>{p.location}</p>

            <strong>R$ {p.price}</strong>

            <button onClick={() => openWhatsApp(p)} style={btn}>
              WhatsApp
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const card = {
  padding: 15,
  border: "1px solid #ddd",
  borderRadius: 10,
};

const btn = {
  marginTop: 10,
  padding: 8,
  background: "#25D366",
  color: "#fff",
  border: "none",
  borderRadius: 6,
};
