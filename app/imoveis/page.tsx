"use client";

import { properties } from "@/lib/properties";
import { useRouter } from "next/navigation";
import { canNavigate } from "@/lib/navigation";
import { routes } from "@/lib/appRoutes";

export default function ImoveisPage() {
  const router = useRouter();

  function goTo(id: string) {
    const route = routes.imovel(id);

    if (!canNavigate(route)) return;

    router.push(route);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Imóveis</h1>

      {properties.map((p) => (
        <div
          key={p.id}
          onClick={() => goTo(p.id)}
          style={{
            padding: 15,
            border: "1px solid #ddd",
            marginBottom: 10,
            cursor: "pointer",
          }}
        >
          <h3>{p.title}</h3>
          <p>{p.location}</p>
          <strong>R$ {p.price}</strong>
        </div>
      ))}
    </div>
  );
}
