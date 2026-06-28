"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [name, setName] = useState("");
  const router = useRouter();

  function handleLogin() {
    login(name);
    router.push("/dashboard");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>CRM Imobiliário</h1>

      <input
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
}
