import { properties } from "@/lib/properties";
import Link from "next/link";

export default function ImoveisPage() {
  return (
    <div>
      <h1>Imóveis disponíveis</h1>

      {properties.map((p) => (
        <Link key={p.id} href={`/imoveis/${p.id}`}>
          <div style={{ padding: 10, border: "1px solid #ccc", margin: 10 }}>
            <h2>{p.title}</h2>
            <p>{p.location}</p>
            <strong>R$ {p.price}</strong>
          </div>
        </Link>
      ))}
    </div>
  );
}

