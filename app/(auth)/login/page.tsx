"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        placeholder="senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </div>
  );
}
