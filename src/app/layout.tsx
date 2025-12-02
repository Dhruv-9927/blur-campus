import type { Metadata } from "next";
import { Inter, Roboto_Mono, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans", // Keeping variable name to avoid breaking css
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono", // Keeping variable name to avoid breaking css
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlurCampus",
  description: "Connect with students on your campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} ${playfair.variable} ${dancingScript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
