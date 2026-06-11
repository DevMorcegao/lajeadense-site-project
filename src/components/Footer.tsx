"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';

const LEGAL_LINKS = (
  <>
    <Link href="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link>
    <Link href="/politica-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
  </>
);

export function Footer() {
  const pathname = usePathname();
  const isContatoPage = pathname === '/contato';

  // Footer minimalista exclusivo da página de Contato
  if (isContatoPage) {
    return (
      <footer className="bg-[#0D0D0D] text-white border-t border-[#1A1A1A] py-6">
        <div className="container mx-auto px-4 md:px-16 max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Lajeadense Vidros. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS}
          </div>
        </div>
      </footer>
    );
  }

  // Footer completo para todas as outras páginas
  return (
    <footer className="bg-action-strong text-white pt-16 pb-6 mt-auto">
      <div className="container mx-auto px-4 md:px-16 max-w-[1400px]">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <span className="font-display font-bold text-3xl tracking-wide uppercase">Lajeadense Vidros</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed pr-4">
              Desenvolvendo soluções em vidro com precisão técnica e segurança para projetos arquitetônicos e construção civil desde 1958.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://web.facebook.com/lajeadensevidros/?locale=pt_BR&_rdc=1&_rdr" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center hover:bg-action-primary text-white transition-colors">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href="https://www.instagram.com/lajeadensevidros/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center hover:bg-action-primary text-white transition-colors">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="https://www.youtube.com/@lajeadensevidros633" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center hover:bg-action-primary text-white transition-colors">
                <Youtube size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Contact Col */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display font-bold text-xl tracking-wide uppercase border-b border-[#1F1F1F] pb-3 text-action-primary">Contato</h3>
            <ul className="flex flex-col gap-4 text-sm text-muted">
              <li className="flex items-start gap-3">
                <Phone size={18} className="shrink-0 text-white" strokeWidth={1.5} />
                <span className="text-white font-medium">(51) 3714-4799</span>
              </li>
              <li className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-white" strokeWidth={1.5} />
                  <span>E-mails:</span>
                </div>
                <div className="flex flex-col pl-7 space-y-2">
                  <a href="mailto:atendimento@lajeadense.com.br" className="hover:text-white transition-colors">atendimento@lajeadense.com.br</a>
                  <a href="mailto:lajeadense@lajeadense.com.br" className="hover:text-white transition-colors">lajeadense@lajeadense.com.br</a>
                  <a href="mailto:comercial@lajeadense.com.br" className="hover:text-white transition-colors">comercial@lajeadense.com.br</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Address Col */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display font-bold text-xl tracking-wide uppercase border-b border-[#1F1F1F] pb-3 text-action-primary">Endereço</h3>
            <ul className="flex flex-col gap-4 text-sm text-muted">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 text-white mt-1" strokeWidth={1.5} />
                <span className="leading-relaxed">
                  Rod. BR 386, Nº 8495<br />
                  Bairro Imigrante<br />
                  Lajeado / RS<br />
                  CEP: 95.911-814
                </span>
              </li>
            </ul>
          </div>

          {/* Hours Col */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display font-bold text-xl tracking-wide uppercase border-b border-[#1F1F1F] pb-3 text-action-primary">Atendimento</h3>
            <ul className="flex flex-col gap-4 text-sm text-muted">
              <li className="flex items-start gap-3">
                <Clock size={18} className="shrink-0 text-white mt-0.5" strokeWidth={1.5} />
                <span className="leading-relaxed">
                  <strong className="text-white block font-medium mb-1">Segunda a Sexta</strong>
                  7h30 às 12h00<br />
                  13h30 às 17h40
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#1F1F1F] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} Lajeadense Vidros. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS}
          </div>
        </div>
      </div>
    </footer>
  );
}
