import { supabase } from "@/lib/supabase";

export async function updateLead(id: string, payload: any) {
  const { data, error } = await supabase
    .from("leads")
    .update({
      ...payload,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Erro updateLead:", error);
    return null;
  }

  return data;
}
