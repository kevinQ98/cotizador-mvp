import type { Metadata, Viewport } from "next";
import { Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Generador de Cotizaciones | Crea y personaliza tus cotizaciones",
  description:
    "Crea y personaliza cotizaciones en línea de forma rápida y sencilla. Descarga en PDF y personaliza con tu logo. ¡Optimiza tu negocio con esta herramienta!",
  keywords: [
    "cotizaciones online",
    "generador de cotizaciones",
    "cotización en PDF",
    "herramienta de cotizaciones",
    "presupuesto online",
  ],
  applicationName: "Generador de Cotizaciones",
  authors: [{ name: "qosmo", url: "https://www.instagram.com/qosmo__/" }],
  creator: "qosmo",
  openGraph: {
    title: "Generador de Cotizaciones | Personaliza y descarga en PDF",
    description:
      "Crea y personaliza cotizaciones en línea fácilmente. Descarga en PDF y mejora tu negocio con una herramienta intuitiva.",
    // url: "https://tu-dominio.com",
    siteName: "Generador de Cotizaciones",
    // images: [
    //   {
    //     url: "https://tu-dominio.com/preview.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Vista previa del Generador de Cotizaciones",
    //   },
    // ],
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Qosmo_",
    creator: "@Qosmo_",
    title: "Generador de Cotizaciones | Personaliza y descarga en PDF",
    description:
      "Crea y personaliza cotizaciones en línea fácilmente. Descarga en PDF y mejora tu negocio con una herramienta intuitiva.",
    // images: ["https://tu-dominio.com/preview.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    // apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: 'black',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`${lexend.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
