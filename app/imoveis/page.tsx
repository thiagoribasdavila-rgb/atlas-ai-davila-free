"use client";

import { useState } from "react";

export default function Imoveis() {
  const [imoveis] = useState([
    {
      id: "1",
      title: "Apartamento Jardins",
      price: 1200000,
      location: "Jardins - SP",
    },
  ]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Imóveis</h1>

      {imoveis.map((i) => (
        <div
          key={i.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <h3>{i.title}</h3>
          <p>{i.location}</p>
          <strong>R$ {i.price}</strong>
        </div>
      ))}
    </div>
  );
}
