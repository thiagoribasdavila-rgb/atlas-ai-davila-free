import { supabase } from "@/lib/supabase";

export type LeadStatus = "novo" | "contato" | "qualificado" | "fechado";

export interface CreateLeadDTO {
  nome: string;
  telefone?: string;
  email?: string;
  origem?: string;
}

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  origem: string;
  status: LeadStatus;
  created_at: string;
}

//
// 🔥 CREATE LEAD
//
export async function createLead(data: CreateLeadDTO) {
  const { data: lead, error } = await supabase
    .from("leads")
    .insert([
      {
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        origem: data.origem || "site",
        status: "novo",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("❌ createLead error:", error.message);
    throw new Error("Erro ao criar lead");
  }

  return lead;
}

//
// 📥 GET LEADS (LISTA COMPLETA)
//
export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ getLeads error:", error.message);
    throw new Error("Erro ao buscar leads");
  }

  return data || [];
}

//
// 🎯 UPDATE STATUS DO LEAD
//
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

  if (error) {
    console.error("❌ updateLeadStatus error:", error.message);
    throw new Error("Erro ao atualizar status");
  }

  return data;
}

//
// ✏️ UPDATE LEAD COMPLETO
//
export async function updateLead(
  id: string,
  updates: Partial<CreateLeadDTO & { status: LeadStatus }>
) {
  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("❌ updateLead error:", error.message);
    throw new Error("Erro ao atualizar lead");
  }

  return data;
}

//
// 🗑 DELETE LEAD
//
export async function deleteLead(id: string) {
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("❌ deleteLead error:", error.message);
    throw new Error("Erro ao deletar lead");
  }

  return true;
}

//
// 🔎 GET LEAD POR ID
//
export async function getLeadById(id: string) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ getLeadById error:", error.message);
    throw new Error("Erro ao buscar lead");
  }

  return data;
}
