import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "Arial" }}>
      {/* HERO */}
      <section
        style={{
          padding: "80px 20px",
          textAlign: "center",
          background: "#0f172a",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>
          Encontre imóveis com inteligência
        </h1>

        <p style={{ fontSize: 18, opacity: 0.8 }}>
          Plataforma moderna de compra, venda e investimento imobiliário
        </p>

        <Link href="/imoveis">
          <button
            style={{
              marginTop: 20,
              padding: "12px 24px",
              fontSize: 16,
              background: "#22c55e",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Explorar imóveis
          </button>
        </Link>
      </section>

      {/* BENEFÍCIOS */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          padding: 40,
        }}
      >
        <div>
          <h3>🏠 Curadoria inteligente</h3>
          <p>Imóveis selecionados para moradia e investimento.</p>
        </div>

        <div>
          <h3>📊 Dados reais de mercado</h3>
          <p>Preço, localização e potencial de valorização.</p>
        </div>

        <div>
          <h3>⚡ Experiência rápida</h3>
          <p>Navegação simples, sem burocracia.</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        style={{
          padding: 60,
          textAlign: "center",
          background: "#f3f4f6",
        }}
      >
        <h2>Comece a explorar agora</h2>

        <Link href="/imoveis">
          <button
            style={{
              marginTop: 15,
              padding: "12px 24px",
              background: "#000",
              color: "#fff",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Ver imóveis
          </button>
        </Link>
      </section>
    </div>
  );
}
