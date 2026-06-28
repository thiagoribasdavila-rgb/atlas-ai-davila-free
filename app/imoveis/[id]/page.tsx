"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProperties } from "@/lib/properties";
import { navigateOnce } from "@/lib/navigation";

export default function ImovelDetalhe() {
  const { id } = useParams();
  const router = useRouter();

  const [imovel, setImovel] = useState<any>(null);

  useEffect(() => {
    const data = getProperties();
    const found = data.find((i) => i.id === id);
    setImovel(found);
  }, [id]);

  if (!imovel) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigateOnce(router, "/imoveis")}>
        ← voltar
      </button>

      <h1>{imovel.title}</h1>
      <p>{imovel.location}</p>
      <h2>R$ {imovel.price}</h2>
    </div>
  );
}
