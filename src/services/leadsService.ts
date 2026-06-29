import { supabase } from "@/lib/supabase";

export async function getLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function updateLeadStage(id: string, stage: string) {
  const { data, error } = await supabase
    .from("leads")
    .update({ stage })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Erro update stage:", error);
    return null;
  }

  return data;
}
