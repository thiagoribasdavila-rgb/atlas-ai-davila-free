"use client";

import { properties } from "@/lib/properties";
import Link from "next/link";
import { navigateOnce } from "@/lib/navigation";
import { useRouter } from "next/navigation";

export default function ImoveisPage() {
  const router = useRouter();

  function handleClick(id: string) {
    const route = `/imoveis/${id}`;

    if (!navigateOnce(route)) return;

    router.push(route);
  }

  return (
    <div>
      <h1>Imóveis disponíveis</h1>

      {properties.map((p) => (
        <div
          key={p.id}
          onClick={() => handleClick(p.id)}
          style={{
            padding: 10,
            border: "1px solid #ccc",
            margin: 10,
            cursor: "pointer",
          }}
        >
          <h2>{p.title}</h2>
          <p>{p.location}</p>
          <strong>R$ {p.price}</strong>
        </div>
      ))}
    </div>
  );
}
