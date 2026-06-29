"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function Dashboard() {
  const router = useRouter();

  const [leads, setLeads] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const statusList = ["novo", "contato", "qualificado", "proposta", "fechado"];

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [origem, setOrigem] = useState("site");

  // 🔐 USER
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
      setUser(data.user);
    };
    check();
  }, []);

  // 📥 LEADS
  async function fetchLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    setLeads(data || []);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  // ➕ CREATE
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

  // 🔥 DRAG SENSOR
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // 🔁 DROP
  async function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over) return;

    const leadId = active.id;
    const newStatus = over.id;

    await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);

    fetchLeads();
  }

  // 📊 FILTER
  const getLeadsByStatus = (status: string) =>
    leads.filter((l) => l.status === status);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📊 CRM D'Avila - Kanban Drag & Drop</h1>

      {/* FORM */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <select value={origem} onChange={(e) => setOrigem(e.target.value)}>
          <option value="site">Site</option>
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <button onClick={handleCreateLead}>➕ Criar Lead</button>
      </div>

      {/* KANBAN */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          {statusList.map((status) => (
            <div
              key={status}
              id={status}
              style={{
                flex: 1,
                minHeight: 500,
                background: "#f5f5f5",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <h3>{status.toUpperCase()}</h3>

              <SortableContext
                items={getLeadsByStatus(status).map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {getLeadsByStatus(status).map((lead) => (
                  <div
                    key={lead.id}
                    id={lead.id}
                    style={{
                      background: "white",
                      padding: 10,
                      marginBottom: 10,
                      borderRadius: 8,
                      cursor: "grab",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <strong>{lead.nome}</strong>
                    <p>{lead.telefone}</p>
                    <small>{lead.email}</small>
                  </div>
                ))}
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
