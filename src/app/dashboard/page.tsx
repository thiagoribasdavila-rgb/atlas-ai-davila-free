import LeadsBoard from "./components/LeadsBoard";

export default function DashboardPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        CRM D’Avila
      </h1>

      <p style={{ marginBottom: 20, color: "#666" }}>
        Sistema online funcionando ✔
      </p>

      <LeadsBoard />
    </div>
  );
}
