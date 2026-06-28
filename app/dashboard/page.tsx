"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");
    loadLeads();
  }, []);

  async function loadLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    setLeads(data || []);
  }

  async function updateLeadStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);
  }

  function onDragEnd(result: any) {
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId;

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );

    updateLeadStatus(leadId, newStatus);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📊 CRM FUNIL DRAG & DROP</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
          {stages.map((stage) => (
            <Droppable droppableId={stage} key={stage}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minWidth: 250,
                    background: "#f4f4f4",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <h3 style={{ textTransform: "capitalize" }}>
                    {stage}
                  </h3>

                  {leads
                    .filter((l) => l.status === stage)
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
                                "0 1px 3px rgba(0,0,0,0.1)",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <strong>{lead.nome}</strong>
                            <p style={{ fontSize: 12 }}>
                              📞 {lead.telefone}
                            </p>
                            <p style={{ fontSize: 12 }}>
                              🏠 {lead.interesse}
                            </p>
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
