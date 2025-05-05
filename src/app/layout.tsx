import { Inter, Nova_Square } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { FuriaLogo } from '@/components/FuriaLogo';
import Link from 'next/link';
import { AuthProvider } from '@/contexts/AuthContext';


const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const novaSquare = Nova_Square({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-title'
});

export const metadata = {
  title: 'FURIA',
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
      <AuthProvider >
        <Navbar />
        <ParticlesBackground />
        <main className="min-h-screen pt-0 pb-0">
          {children}
          
        </main>

        {/* Footer opcional */}
        <footer className="w-full bg-stone-950/90 backdrop-blur-lg border-t border-cyan-400/20 py-6 relative overflow-hidden">
  {/* Efeito de gradiente sutil no fundo */}
  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-500/5 pointer-events-none" />
  
  {/* Efeitos de brilho nas bordas */}
  <div className="absolute inset-0 border-t border-cyan-400/10 shadow-[0_-5px_30px_-10px_rgba(0,240,255,0.2)] pointer-events-none" />
  
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      {/* Logo e copyright */}
      <div className="flex items-center gap-3">
        <FuriaLogo className="h-6 text-pink-400" />
        <span className="text-sm font-medium text-stone-300">
          © {new Date().getFullYear()} FURIA Esports
        </span>
      </div>
      
      {/* Links rápidos */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        <Link 
          href="#" 
          className="text-xs md:text-sm font-medium text-stone-400 hover:text-cyan-300 transition-colors hover:drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]"
        >
          Termos de Uso
        </Link>
        <Link 
          href="#" 
          className="text-xs md:text-sm font-medium text-stone-400 hover:text-pink-300 transition-colors hover:drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]"
        >
          Política de Privacidade
        </Link>
        <Link 
          href="#" 
          className="text-xs md:text-sm font-medium text-stone-400 hover:text-purple-300 transition-colors hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]"
        >
          Contato
        </Link>
        <Link 
          href="#" 
          className="text-xs md:text-sm font-medium text-stone-400 hover:text-lime-300 transition-colors hover:drop-shadow-[0_0_5px_rgba(132,204,22,0.5)]"
        >
          Trabalhe Conosco
        </Link>
      </div>
      
      {/* Redes sociais */}
      <div className="flex items-center gap-4">
        <Link href="#" className="text-stone-400 hover:text-cyan-400 transition-colors">
          <span className="sr-only">Twitter</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </Link>
        <Link href="#" className="text-stone-400 hover:text-pink-400 transition-colors">
          <span className="sr-only">Instagram</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        </Link>
        <Link href="#" className="text-stone-400 hover:text-purple-400 transition-colors">
          <span className="sr-only">Twitch</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
          </svg>
        </Link>
      </div>
    </div>
    
    {/* Mensagem adicional com efeito */}
    <div className="mt-6 text-center">
      <p className="text-xs text-stone-500 font-mono">
        <span className="text-cyan-400/80">#VAMOFURIA</span> - Powered by{' '}
        <span className="text-pink-400/80">CyberFuria Technology</span>
      </p>
    </div>
  </div>
</footer>
</AuthProvider>
      </body>
    </html>
  );
}