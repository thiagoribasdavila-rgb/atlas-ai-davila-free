import { supabase } from "@/lib/supabase";

export type LeadStatus =
  | "novo"
  | "contato"
  | "qualificado"
  | "fechado";

//
// 📥 GET LEADS (POR USUÁRIO)
//
export async function getLeads() {
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.data.user?.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

//
// ➕ CREATE LEAD (COM USER_ID)
//
export async function createLead(data: {
  nome: string;
  telefone?: string;
  email?: string;
  origem?: string;
}) {
  const user = await supabase.auth.getUser();

  const { data: lead, error } = await supabase
    .from("leads")
    .insert([
      {
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        origem: data.origem || "site",
        status: "novo",
        user_id: user.data.user?.id,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return lead;
}

//
// 🔄 UPDATE STATUS
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

  if (error) throw new Error(error.message);
  return data;
}
