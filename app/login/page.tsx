"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleLogin() {
    if (!email) return;

    localStorage.setItem("user", email);

    router.push("/imoveis");
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h1>Entrar na plataforma</h1>

      <input
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: 10,
          width: 250,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          padding: 10,
          width: 250,
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Entrar
      </button>
    </div>
  );
}
