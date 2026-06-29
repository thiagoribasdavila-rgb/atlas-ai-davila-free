import { supabase } from "@/lib/supabase";

export type LeadStatus = "novo" | "contato" | "qualificado" | "fechado";

export interface Lead {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  origem?: string;
  status: LeadStatus;
  created_at: string;
}

/* =========================
   LISTAR LEADS
========================= */
export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

/* =========================
   CRIAR LEAD
========================= */
export async function createLead(payload: {
  nome: string;
  telefone?: string;
  email?: string;
  origem?: string;
}) {
  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        nome: payload.nome,
        telefone: payload.telefone,
        email: payload.email,
        origem: payload.origem || "site",
        status: "novo",
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/* =========================
   ATUALIZAR STATUS
========================= */
export async function updateLeadStatus(
  id: string,
  status: LeadStatus
) {
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/* =========================
   DELETAR LEAD
========================= */
export async function deleteLead(id: string) {
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
