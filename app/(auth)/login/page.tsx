"use client";

import { useRouter } from "next/navigation";
import { setToken } from "@/lib/auth";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function handleLogin() {
    // simulação (depois conecta Supabase)
    if (email && pass) {
      setToken("logged");
      router.push("/dashboard");
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <input placeholder="email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="senha" type="password" onChange={e => setPass(e.target.value)} />

      <button onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
}

