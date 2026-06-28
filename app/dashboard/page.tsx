"use client";

import { useEffect, useState } from "react";
import { getLeads, Lead } from "@/lib/leads";

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(getLeads());
  }, []);

  const total = leads.length;
  const novos = leads.filter((l) => l.status === "novo").length;
  const fechados = leads.filter((l) => l.status === "fechado").length;

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM PRO Dashboard</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <div>Total Leads: {total}</div>
        <div>Novos: {novos}</div>
        <div>Fechados: {fechados}</div>
      </div>
    </div>
  );
}
