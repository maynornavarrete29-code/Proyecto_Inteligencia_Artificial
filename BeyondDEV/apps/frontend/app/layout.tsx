// app/layout.tsx
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
//import { Inter, Orbitron } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});
/*
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});
*/

export const metadata: Metadata = {
  title: 'BeyondDev | Beyond code, Beyond limit',
  description:
    'BeyondDev es un grupo especializado de desarrolladores web y móvil. Creamos páginas web, aplicaciones móviles y sistemas de información avanzados.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${outfit.variable} dark scroll-smooth`}>
      <body className="bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-amber-500 selection:text-black overflow-x-hidden">
        {/* Glow Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-[128px]" />
          <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[140px]" />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}