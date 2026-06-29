"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [origem, setOrigem] = useState("site");

  const statusList = [
    "novo",
    "contato",
    "qualificado",
    "proposta",
    "fechado",
  ];

  // AUTH
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
      setUser(data.user);
    };
    check();
  }, []);

  // LOAD LEADS
  async function fetchLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("id", { ascending: false });

    setLeads(data || []);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  // CREATE LEAD
  async function handleCreateLead() {
    if (!user) return;

    const { data } = await supabase.from("leads").insert([
      {
        nome,
        telefone,
        email,
        origem,
        status: "novo",
        user_id: user.id,
      },
    ]);

    // 📲 WHATSAPP AUTOMÁTICO
    window.open(
      `https://wa.me/5511999999999?text=Novo%20lead:%20${nome}%20-%20${telefone}`
    );

    setNome("");
    setTelefone("");
    setEmail("");

    fetchLeads();
  }

  // UPDATE STATUS
  async function updateStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);
    fetchLeads();
  }

  const sensors = useSensors(useSensor(PointerSensor));

  function onDragEnd(event: any) {
    const { active, over } = event;

    if (!over) return;

    updateStatus(active.id, over.id);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM D'Avila PRO</h1>

      {/* FORM */}
      <div style={{ display: "flex", gap: 10 }}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <select value={origem} onChange={(e) => setOrigem(e.target.value)}>
          <option value="site">Site</option>
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <button onClick={handleCreateLead}>Criar Lead</button>
      </div>

      {/* KANBAN DRAG */}
      <DndContext sensors={sensors} onDragEnd={onDragEnd} collisionDetection={closestCenter}>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          {statusList.map((status) => (
            <div
              key={status}
              id={status}
              style={{
                flex: 1,
                minHeight: 500,
                background: "#f4f4f4",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <h3>{status.toUpperCase()}</h3>

              {leads
                .filter((l) => l.status === status)
                .map((lead) => (
                  <div
                    key={lead.id}
                    id={lead.id}
                    style={{
                      background: "white",
                      padding: 10,
                      marginBottom: 10,
                      borderRadius: 8,
                      cursor: "grab",
                    }}
                  >
                    <b>{lead.nome}</b>
                    <p>{lead.telefone}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
