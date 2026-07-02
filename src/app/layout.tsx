import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import { TourWrapper } from "@/components/TourWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Painel | Fritz Materiais Elétricos",
  description: "Painel gerencial da Fritz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* A mágica da barra de progresso no topo! */}
        <NextTopLoader 
          color="#51831b" 
          height={4} 
          showSpinner={false} 
          shadow="0 0 10px #51831b,0 0 5px #51831b"
        />
        
        {/* Envolvendo toda a aplicação com o TourWrapper */}
        <TourWrapper>
          {children}
        </TourWrapper>
      </body>
    </html>
  );
}