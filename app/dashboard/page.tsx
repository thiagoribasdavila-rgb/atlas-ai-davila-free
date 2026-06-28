"use client";

import { useEffect } from "react";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) router.push("/login");
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard CRM PRO</h1>

      <p>Bem-vindo ao sistema imobiliário</p>
    </div>
  );
}
