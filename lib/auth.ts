import { supabase } from "./supabase";

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
    return null;
  }

  return data.user;
}

export async function logout() {
  await supabase.auth.signOut();
}
