"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function login() {
    if (!email || !name) return;

    const user = {
      name,
      email,
      id: crypto.randomUUID(),
    };

    localStorage.setItem("user", JSON.stringify(user));

    router.push("/imoveis");
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h1>Login do Corretor</h1>

      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={input}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
      />

      <button onClick={login} style={button}>
        Entrar no sistema
      </button>
    </div>
  );
}

const input = {
  padding: 10,
  width: 250,
  border: "1px solid #ddd",
  borderRadius: 6,
};

const button = {
  padding: 10,
  width: 250,
  background: "black",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
