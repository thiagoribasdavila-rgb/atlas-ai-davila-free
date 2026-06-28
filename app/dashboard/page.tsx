"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    const allLeads = JSON.parse(localStorage.getItem("leads") || "[]");

    // 🔥 filtra só leads do corretor logado
    const myLeads = allLeads.filter(
      (l: any) => l.userId === parsed.id
    );

    setLeads(myLeads);
  }, []);

  if (!user) return null;

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard do Corretor</h1>

      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>

      <h2>Meus Leads</h2>

      {leads.length === 0 && <p>Sem leads ainda</p>}

      {leads.map((l) => (
        <div key={l.id} style={card}>
          <p>Imóvel: {l.propertyId}</p>
          <p>Data: {l.date}</p>
        </div>
      ))}
    </div>
  );
}

const card = {
  padding: 10,
  border: "1px solid #ddd",
  marginBottom: 10,
  borderRadius: 8,
};
