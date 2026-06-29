"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [origem, setOrigem] = useState("site");

  const statusList = [
    "novo",
    "contato",
    "qualificado",
    "proposta",
    "fechado",
  ];

  // 🔐 LOGIN CHECK
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
    };

    checkUser();
  }, []);

  // 📥 BUSCAR LEADS (FILTRADO POR CORRETOR)
  async function fetchLeads() {
    const { data: userData } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", userData.user?.id)
      .order("id", { ascending: false });

    setLeads(data || []);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  // 🧠 MULTI CORRETOR (ROUND ROBIN SIMPLES)
  async function handleCreateLead() {
    if (!user) return;

    // pega todos leads para calcular distribuição
    const { count } = await supabase
      .from("leads")
      .select("*", { count: "exact",
