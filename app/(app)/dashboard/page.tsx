export default function Dashboard() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard CRM</h1>

      <p style={styles.subtitle}>
        Visão geral de leads, imóveis e pipeline
      </p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2>📊 Leads</h2>
          <p>Resumo de contatos captados</p>
        </div>

        <div style={styles.card}>
          <h2>🏠 Imóveis</h2>
          <p>Gestão de propriedades ativas</p>
        </div>

        <div style={styles.card}>
          <h2>📈 Pipeline</h2>
          <p>Etapas de conversão de clientes</p>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    padding: 30,
    fontFamily: "Arial, sans-serif",
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 5,
  },

  subtitle: {
    color: "#666",
    marginBottom: 25,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
  },

  card: {
    padding: 20,
    borderRadius: 12,
    background: "#f5f5f5",
    border: "1px solid #ddd",
  },
};
