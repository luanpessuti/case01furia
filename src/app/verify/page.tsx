'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FuriaLogo } from '@/components/FuriaLogo';

export default function VerifyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState<File[]>([]);
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    instagram: '',
    twitch: '',
    steam: '',
    faceit: '',
    youtube: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return Math.random() > 0.3;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocuments([e.target.files[0]]);
    }
  };

  const submitVerification = async () => {
    if (!user) return;

    try {
      const verified = await handleVerify();
      if (verified) {
        const response = await fetch('/api/users/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            socialLinks
          })
        });

        if (!response.ok) throw new Error('Falha na verificação');
        router.push('/profile');
      } else {
        alert('Verificação falhou. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro durante a verificação.');
    }
  };

  if (!isMounted || !user) {
    return (
      <div className="min-h-screen z-50 bg-stone-950 flex items-center justify-center">
        <div className="animate-pulse text-cyan-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-50 bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-900/80 border border-cyan-400/30 rounded-xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <FuriaLogo className="h-10 text-pink-500" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">
            VERIFICAÇÃO DE CONTA
          </h1>
        </div>

        {/* Progresso */}
        <div className="flex mb-6">
          <div className={`flex-1 border-t-2 ${step >= 1 ? 'border-cyan-400' : 'border-stone-700'} pt-1`}>
            <p className={`text-xs ${step >= 1 ? 'text-cyan-400' : 'text-stone-500'}`}>Documento</p>
          </div>
          <div className={`flex-1 border-t-2 ${step >= 2 ? 'border-cyan-400' : 'border-stone-700'} pt-1`}>
            <p className={`text-xs ${step >= 2 ? 'text-cyan-400' : 'text-stone-500'}`}>Redes Sociais</p>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            {/* Seção de Dados Pessoais */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-cyan-300">Dados Pessoais</h2>

              <div className="grid grid-cols-2 gap-4">
                {/* Data de Nascimento */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-stone-400 mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                {/* CPF */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-stone-400 mb-1">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                {/* CEP */}
                <div className="col-span-2 sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-400 mb-1">CEP</label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="00000-000"
                      className="flex-1 p-2.5 bg-stone-800 border border-stone-700 rounded-l text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                    <button
                      className="px-3 bg-stone-700 border border-l-0 border-stone-700 rounded-r text-stone-300 hover:bg-stone-600 transition-colors"
                      type="button"
                    >
                      Buscar
                    </button>
                  </div>
                </div>

                {/* Cidade */}
                <div className="col-span-2 sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-400 mb-1">Cidade</label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                {/* Rua */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-400 mb-1">Rua</label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                {/* Bairro e Número */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-stone-400 mb-1">Bairro</label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-stone-400 mb-1">Número</label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Seção de Documento (mantida) */}
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-cyan-300">Documento de Identificação</h2>
              <p className="text-sm text-stone-400">
                Envie uma foto ou scan do seu RG, CNH ou passaporte
              </p>

              <label className="flex flex-col gap-2">
                <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-cyan-400/30 rounded-lg cursor-pointer hover:border-cyan-400 transition-colors p-4">
                  {documents.length > 0 ? (
                    <>
                      <svg className="w-10 h-10 text-cyan-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-cyan-400 text-center">{documents[0].name}</span>
                      <span className="text-stone-400 text-xs mt-1">Clique para alterar</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-stone-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-stone-400 text-center">Arraste ou clique para selecionar</span>
                      <span className="text-stone-500 text-xs mt-1">Formatos: JPG, PNG, PDF</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={() => documents.length > 0 && setStep(2)}
              className={`w-full py-3 rounded-lg font-medium transition-all ${documents.length > 0
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              disabled={documents.length === 0 || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </span>
              ) : (
                'Continuar'
              )}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-pink-300">Suas Redes Sociais</h2>
              <p className="text-sm text-stone-400">
                Adicione seus perfis para ajudar na verificação
              </p>

              <div className="grid grid-cols-1 gap-4">
                {/* Twitter */}
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Twitter/X</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-stone-700 bg-stone-800 text-stone-400 text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      placeholder="seuuser"
                      value={socialLinks.twitter}
                      onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                      className="flex-1 p-2.5 bg-stone-800 border border-stone-700 rounded-r text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                {/* Instagram */}
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Instagram</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-stone-700 bg-stone-800 text-stone-400 text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      placeholder="seuuser"
                      value={socialLinks.instagram}
                      onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                      className="flex-1 p-2.5 bg-stone-800 border border-stone-700 rounded-r text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                {/* Twitch */}
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Twitch</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-stone-700 bg-stone-800 text-stone-400 text-sm">
                      twitch.tv/
                    </span>
                    <input
                      type="text"
                      placeholder="seuuser"
                      value={socialLinks.twitch}
                      onChange={(e) => setSocialLinks({ ...socialLinks, twitch: e.target.value })}
                      className="flex-1 p-2.5 bg-stone-800 border border-stone-700 rounded-r text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                {/* Steam */}
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Steam</label>
                  <input
                    type="text"
                    placeholder="Link do perfil Steam"
                    value={socialLinks.steam}
                    onChange={(e) => setSocialLinks({ ...socialLinks, steam: e.target.value })}
                    className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                {/* YouTube */}
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">YouTube</label>
                  <input
                    type="text"
                    placeholder="Link do canal YouTube"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded text-stone-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg text-stone-300 transition-all hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
              >
                Voltar
              </button>
              <button
                onClick={submitVerification}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-500 hover:to-pink-500 rounded-lg text-white font-medium disabled:opacity-50 transition-all hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </span>
                ) : (
                  'Finalizar Verificação'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}