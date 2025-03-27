import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDFMaster - Outils PDF en ligne gratuits",
  description: "Compressez, chiffrez, déchiffrez, signez et convertissez vos fichiers PDF en ligne gratuitement avec PDFMaster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8362325364175470"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">PDFMaster</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="hover:underline">Accueil</a></li>
                <li><a href="/compression" className="hover:underline">Compression</a></li>
                <li><a href="/chiffrement" className="hover:underline">Chiffrement</a></li>
                <li><a href="/dechiffrement" className="hover:underline">Déchiffrement</a></li>
                <li><a href="/signature" className="hover:underline">Signature</a></li>
                <li><a href="/conversion" className="hover:underline">Conversion</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4 min-h-screen">{children}</main>
        <footer className="bg-gray-100 p-4 text-center">
          <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} PDFMaster - Tous droits réservés</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
