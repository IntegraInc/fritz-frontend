import { useEffect } from "react";
import { Button } from "@/components/tailgrids/core/button";

type ErrorModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
};

export function ErrorModal({ isOpen, title = "Acesso Negado", message, onClose }: ErrorModalProps) {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose} // 1. O clique no fundo escuro fecha o modal
      className="fixed inset-0 z-[60] flex items-center justify-center bg-fritz-stone-950/40 backdrop-blur-sm p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()} // 2. O clique no cartão branco é ignorado
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border-2 border-red-100 bg-white p-8 text-center shadow-2xl shadow-red-900/10 duration-200 animate-in fade-in zoom-in"
      >
        <div className="absolute left-0 top-0 h-1.5 w-full bg-red-400" />

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 ring-4 ring-red-50/70">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>

        <h2 className="mb-2 text-xl font-bold text-fritz-stone-950">{title}</h2>
        <p className="mb-8 text-sm leading-relaxed text-fritz-stone-500">{message}</p>

        <Button
          onClick={onClose}
          className="w-full border-transparent bg-red-50 py-3 font-bold text-red-600 shadow-sm transition-colors hover:bg-red-100 focus:ring-red-200"
        >
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}