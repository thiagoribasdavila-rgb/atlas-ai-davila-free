import { supabase } from "@/lib/supabase";

export async function getLeads(userId: string) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getLeads error:", error);
    return [];
  }

  return data;
}

export async function createLead(lead: {
  nome: string;
  telefone?: string;
  email?: string;
  origem?: string;
  user_id: string;
}) {
  const { data, error } = await supabase
    .from("leads")
    .insert([lead])
    .select()
    .single();

  if (error) {
    console.error("createLead error:", error);
    return null;
  }

  return data;
}

export async function updateLeadStage(id: string, status: string) {
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateLeadStage error:", error);
    return null;
  }

  return data;
}
