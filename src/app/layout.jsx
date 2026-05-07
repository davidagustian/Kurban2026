import "./globals.css";

export const metadata = {
  title: "Kurban Savings Manager",
  description: "Aplikasi manajemen tabungan kurban sekolah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
