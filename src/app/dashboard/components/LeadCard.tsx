export default function LeadCard({
  lead,
  onMove,
}: {
  lead: any;
  onMove: (id: string, status: string) => void;
}) {
  return (
    <div
      style={{
        background: "white",
        padding: 12,
        marginTop: 10,
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <strong>{lead.nome}</strong>

      <p style={{ fontSize: 12 }}>{lead.telefone}</p>
      <p style={{ fontSize: 12 }}>{lead.email}</p>

      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <button onClick={() => onMove(lead.id, "contato")}>
          📞
        </button>

        <button onClick={() => onMove(lead.id, "qualificado")}>
          🎯
        </button>

        <button onClick={() => onMove(lead.id, "fechado")}>
          🏁
        </button>
      </div>
    </div>
  );
}
