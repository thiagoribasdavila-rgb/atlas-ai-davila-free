"use client";

import { useState, useEffect } from "react";
import { updateLead } from "@/services/leadsService";

export default function LeadModal({
  lead,
  onClose,
  onUpdate,
}: any) {
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    setForm(lead);
  }, [lead]);

  if (!lead || !form) return null;

  async function handleSave() {
    await updateLead(lead.id, form);
    onUpdate();
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          width: 420,
        }}
      >
        <h2>👤 Lead</h2>

        <input
          value={form.nome || ""}
          onChange={(e) =>
            setForm({ ...form, nome: e.target.value })
          }
          placeholder="Nome"
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          value={form.telefone || ""}
          onChange={(e) =>
            setForm({ ...form, telefone: e.target.value })
          }
          placeholder="Telefone"
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          value={form.email || ""}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          placeholder="Email"
          style={{ width: "100%", marginBottom: 10 }}
        />

        <select
          value={form.stage}
          onChange={(e) =>
            setForm({ ...form, stage: e.target.value })
          }
          style={{ width: "100%", marginBottom: 10 }}
        >
          <option value="novo">Novo</option>
          <option value="contato">Contato</option>
          <option value="qualificado">Qualificado</option>
          <option value="proposta">Proposta</option>
          <option value="fechado">Fechado</option>
        </select>

        <textarea
          value={form.observacoes || ""}
          onChange={(e) =>
            setForm({ ...form, observacoes: e.target.value })
          }
          placeholder="Observações do lead..."
          style={{ width: "100%", height: 120 }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
