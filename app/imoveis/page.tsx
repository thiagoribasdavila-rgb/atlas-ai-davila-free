"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { navigateOnce } from "@/lib/navigation";
import { getProperties } from "@/lib/properties";

export default function ImoveisPage() {
  const router = useRouter();
  const [imoveis, setImoveis] = useState<any[]>([]);

  useEffect(() => {
    const data = getProperties();
    setImoveis(data);
  }, []);

  function openImovel(id: string) {
    navigateOnce(router, `/imoveis/${id}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Imóveis</h1>

      <div style={{ display: "grid", gap: 12 }}>
        {imoveis.map((item) => (
          <div
            key={item.id}
            onClick={() => openImovel(item.id)}
            style={{
              padding: 12,
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.location}</p>
            <strong>R$ {item.price}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
