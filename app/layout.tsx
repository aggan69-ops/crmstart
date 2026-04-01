export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body style={{ margin: 0, background: "#f6f7f9", fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}