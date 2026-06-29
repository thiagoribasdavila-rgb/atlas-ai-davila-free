import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import LeadsBoard from "./components/LeadsBoard";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Você precisa estar logado</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>CRM D’Avila</h1>
      <LeadsBoard />
    </div>
  );
}
