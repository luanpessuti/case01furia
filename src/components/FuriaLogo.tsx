export function FuriaLogo({ className }: { className?: string }) {
    return (
      <div>
        <img
          src="/images/furiaLogo.png"
          alt="FURIA Logo"
          className={className}
        />
      </div>
    );
  }
  
  // Alternativa simplificada (usando imagem):
  // export function FuriaLogo({ className }: { className?: string }) {
  //   return <img src="/furia-logo.svg" alt="FURIA Logo" className={className} />;
  // }