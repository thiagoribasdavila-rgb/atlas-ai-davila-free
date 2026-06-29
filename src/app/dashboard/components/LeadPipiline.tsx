"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LeadPipeline from "@/components/LeadPipeline";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  if (!user) {
    return <div>Você precisa estar logado</div>;
  }

  return (
    <div>
      <h1 style={{ padding: 20 }}>CRM D'Avila</h1>
      <LeadPipeline userId={user.id} />
    </div>
  );
}
