import { supabase } from "@/lib/supabase";

export async function createLead({
  nome,
  telefone,
  email,
  origem = "site",
}: any) {
  const { data, error } = await supabase
    .from("leads")
    .insert([{ nome, telefone, email, origem }])
    .select();

  if (error) {
    console.error("Erro createLead:", error);
    return null;
  }

  return data;
}

export async function getLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro getLeads:", error);
    return [];
  }

  return data;
}
