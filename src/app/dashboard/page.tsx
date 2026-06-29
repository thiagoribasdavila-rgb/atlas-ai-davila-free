import { supabase } from "@/lib/supabase";

export default async function DashboardPage() {
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: 24 }}>
      <h1>CRM D'Avila</h1>

      <h3>Total de leads: {leads?.length || 0}</h3>

      <ul>
        {leads?.map((lead: any) => (
          <li key={lead.id}>
            {lead.nome} - {lead.telefone} - {lead.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
