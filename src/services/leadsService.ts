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
  const { error } = await supabase
    .from("leads")
    .update({ stage })
    .eq("id", id);

  if (error) console.error(error);
}

export async function updateLead(id: string, payload: any) {
  const { error } = await supabase
    .from("leads")
    .update({
      ...payload,
      updated_at: new Date(),
    })
    .eq("id", id);

  if (error) console.error(error);
}
