import { Inter, Nova_Square } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ParticlesBackground } from '@/components/ParticlesBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const novaSquare = Nova_Square({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-title'
});

export const metadata = {
  title: 'Fur.IA',
  description: 'Os melhores momentos da FURIA Esports', 
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${novaSquare.variable}`}>
      <body>
      <ParticlesBackground />
        <Navbar />
        <main className="min-h-screen pt-0 pb-0"> {/* Ajuste o padding-top conforme altura da navbar */}
          {children}
        </main>
        
        {/* Footer opcional */}
        <footer className="bg-stone-900/50 border-t border-amber-400/20 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-stone-200 text-sm">
            © {new Date().getFullYear()} FURIA Esports - Todos os direitos reservados
          </div>
        </footer>
      </body>
    </html>
  );
}