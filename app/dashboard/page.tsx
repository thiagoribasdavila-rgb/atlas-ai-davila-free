"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const stages = ["novo", "contato", "quente", "proposta", "fechado"];

export default function Dashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
      return;
    }

    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);

    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    setLeads(data || []);
    setLoading(false);
  }

  async function updateLead(id: string, status: string) {
    await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);
  }

  function sendWhatsApp(lead: any, status: string) {
    const phone = lead.telefone;
    if (!phone) return;

    const messages: any = {
      novo: `Olá ${lead.nome}, vi seu interesse em ${lead.interesse}. Posso te ajudar?`,
      contato: `Oi ${lead.nome}, vamos avançar com seu atendimento?`,
      quente: `Tenho uma condição especial pra você, ${lead.nome}!`,
      proposta: `Estamos quase fechando seu imóvel!`,
      fechado: `Parabéns ${lead.nome}! 🎉 negócio concluído.`,
    };

    const msg = messages[status] || messages.novo;

    window.open(
      `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  function onDragEnd(result: any) {
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId;

    const lead = leads.find((l) => l.id === leadId);

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, status: newStatus } : l
      )
    );

    updateLead(leadId, newStatus);

    if (lead) sendWhatsApp(lead, newStatus);
  }

  const metrics = useMemo(() => {
    return {
      total: leads.length,
      novos: leads.filter((l) => l.status === "novo").length,
      quentes: leads.filter((l) => l.status === "quente").length,
      fechados: leads.filter((l) => l.status === "fechado").length,
    };
  }, [leads]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {/* HEADER */}
      <h1>📊 CRM IMOBILIÁRIO PRO</h1>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Card title="Total" value={metrics.total} />
        <Card title="Novos" value={metrics.novos} />
        <Card title="Quentes" value={metrics.quentes} />
        <Card title="Fechados" value={metrics.fechados} />
      </div>

      {/* FILTER */}
      <div style={{ marginBottom: 10 }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="novo">Novo</option>
          <option value="contato">Contato</option>
          <option value="quente">Quente</option>
          <option value="proposta">Proposta</option>
          <option value="fechado">Fechado</option>
        </select>
      </div>

      {loading && <p>Carregando leads...</p>}

      {/* FUNIL */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
          }}
        >
          {stages.map((stage) => (
            <Droppable droppableId={stage} key={stage}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minWidth: 260,
                    background: "#f4f4f4",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <h3>{stage.toUpperCase()}</h3>

                  {leads
                    .filter((l) =>
                      filter === "todos"
                        ? l.status === stage
                        : l.status === filter && l.status === stage
                    )
                    .map((lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              background: "#fff",
                              padding: 10,
                              marginBottom: 10,
                              borderRadius: 8,
                              boxShadow:
                                "0 2px 5px rgba(0,0,0,0.1)",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <strong>{lead.nome}</strong>
                            <p>📞 {lead.telefone}</p>
                            <p>🏠 {lead.interesse}</p>

                            <button
                              onClick={() =>
                                sendWhatsApp(lead, lead.status)
                              }
                              style={{
                                marginTop: 5,
                                fontSize: 12,
                              }}
                            >
                              WhatsApp
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

/* CARD KPI */
function Card({ title, value }: any) {
  return (
    <div
      style={{
        flex: 1,
        padding: 15,
        background: "#111",
        color: "#fff",
        borderRadius: 10,
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
