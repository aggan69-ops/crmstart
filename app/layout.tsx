export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body style={{ margin: 0, background: "#f6f1f1" }}>{children}</body>
    </html>
  );
}
