import { supabase } from "@/lib/supabase";

export async function createLead({
  nome,
  telefone,
  email,
  origem = "site",
}: any) {
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        nome,
        telefone,
        email,
        origem,
        user_id: user.data.user?.id,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
