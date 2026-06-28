// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Atlas CRM",
  description: "CRM Imobiliário",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#0b0b0b", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
