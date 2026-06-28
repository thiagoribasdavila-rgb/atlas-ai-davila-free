import { properties } from "@/lib/properties";

export default function ImovelDetalhe({
  params,
}: {
  params: { id: string };
}) {
  const imovel = properties.find((p) => p.id === params.id);

  if (!imovel) return <p>Imóvel não encontrado</p>;

  return (
    <div>
      <h1>{imovel.title}</h1>
      <p>{imovel.location}</p>
      <h2>R$ {imovel.price}</h2>
    </div>
  );
}
