import Link from "next/link";

export default function Home() {
  return (
    <main className="hero">
      <div className="container">
        <div className="badge">D&apos;AVILA IMÓVEIS • ATLAS AI</div>
        <h1>Plataforma imobiliária com CRM, portal e IA sem depender do AI Gateway.</h1>
        <p>Começamos gratuito: portal, dashboard, funil comercial e assistente em modo simulado. Depois conectamos Supabase, OpenAI API, WhatsApp e Meta Leads.</p>
        <div className="actions">
          <Link className="btn primary" href="/dashboard">Dashboard</Link>
          <Link className="btn secondary" href="/crm">CRM</Link>
          <Link className="btn secondary" href="/imoveis">Imóveis</Link>
          <Link className="btn secondary" href="/assistente">Assistente IA</Link>
        </div>
        <section className="grid three cards">
          <div className="card"><h2>Portal estilo QuintoAndar</h2><p>Busca de imóveis, empreendimentos e geração de leads.</p></div>
          <div className="card"><h2>CRM estilo RD Station</h2><p>Kanban, funil, WhatsApp e follow-up para corretores.</p></div>
          <div className="card"><h2>IA controlada</h2><p>Sem cartão na Vercel. Ativamos IA real depois via OpenAI API com limite baixo.</p></div>
        </section>
      </div>
    </main>
  );
}
