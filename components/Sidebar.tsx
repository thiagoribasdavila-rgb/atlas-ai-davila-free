export default function Sidebar() {
  return (
    <aside style={{
      width: 250,
      background: "#111",
      color: "#fff",
      minHeight: "100vh",
      padding: 20
    }}>
      <h2>CRM Imobiliário</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>Dashboard</li>
        <li>Leads</li>
        <li>Imóveis</li>
        <li>Pipeline</li>
      </ul>
    </aside>
  );
}
