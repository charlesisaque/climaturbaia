import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClimaTUR Baia | Inteligência Climática & Turismo Resiliente",
  description: "Plataforma avançada de IA climática, monitoramento de desastres da Defesa Civil e turismo seguro para as Smart Cities do Estado da Bahia.",
  keywords: ["Bahia", "Clima", "Defesa Civil", "Turismo", "Inteligência Artificial", "Sensor Grid", "Smart Cities"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyber-cyan">
        {children}
      </body>
    </html>
  );
}
