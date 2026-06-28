export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: 250 }}>Sidebar</aside>

      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
