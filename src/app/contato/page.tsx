import { Metadata } from 'next';
import { client } from '@/lib/sanity';
import { PRODUTOS_CONTATO_QUERY } from '@/lib/queries';
import { ContatoForm } from '@/components/contato/ContatoForm';
import AtendimentoStatus from '@/components/contato/AtendimentoStatus';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

export const revalidate = 3600; // Revalida a cada 1 hora (ISR)

export const metadata: Metadata = {
  title: 'Contato e Solicitação de Orçamento | Lajeadense Vidros',
  description: 'Fale com a Lajeadense Vidros. Preencha o formulário para solicitar orçamentos de vidros temperados, laminados, termoacústicos e polarizados, ou confira nossa localização em Lajeado / RS.',
  alternates: { canonical: 'https://lajeadensevidros.com.br/contato' },
};

export default async function ContatoPage() {
  // Busca lista simplificada de produtos do Sanity
  const produtos = await client.fetch(PRODUTOS_CONTATO_QUERY);

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white pt-28 pb-16 md:pt-36 md:pb-24 px-4 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho da Página */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-[2px] bg-[#C8102E]"></div>
            <span 
              className="text-xs font-semibold tracking-widest text-[#C8102E] uppercase font-display"
            >
              Fale Conosco
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display uppercase tracking-tight">
            Contato & Orçamentos
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl font-body leading-relaxed">
            Nossa equipe técnica comercial está pronta para atender seu projeto arquitetônico, corporativo ou residencial. Tire dúvidas ou peça sua cotação.
          </p>
        </div>

        {/* Grid Principal de 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-start">
          
          {/* Coluna da Esquerda: Informações e Mapa */}
          <div className="space-y-8 order-2 lg:order-1">
            
            {/* Bloco de Informações de Contato */}
            <div className="bg-[#111111]/80 border border-[#222222] rounded-3xl p-6 md:p-8 space-y-6">
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider border-b border-[#222222] pb-3">
                Informações de Contato
              </h3>
              
              <ul className="space-y-5">
                {/* Endereço */}
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8102E]/10 border border-[#C8102E]/20 flex items-center justify-center text-[#C8102E] shrink-0">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>
                  <div className="font-body text-neutral-300 text-sm leading-relaxed">
                    <strong className="text-white block font-medium mb-0.5">Endereço Principal</strong>
                    Rod. BR 386, Nº 8495 — Bairro Imigrante<br />
                    Lajeado / RS — CEP: 95.911-814
                  </div>
                </li>

                {/* Telefone */}
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8102E]/10 border border-[#C8102E]/20 flex items-center justify-center text-[#C8102E] shrink-0">
                    <Phone size={20} strokeWidth={1.5} />
                  </div>
                  <div className="font-body text-neutral-300 text-sm">
                    <strong className="text-white block font-medium mb-0.5">Telefone Geral</strong>
                    <a href="tel:+555137144799" className="hover:text-white transition-colors text-lg font-semibold text-white">
                      (51) 3714-4799
                    </a>
                  </div>
                </li>

                {/* WhatsApp */}
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8102E]/10 border border-[#C8102E]/20 flex items-center justify-center text-[#C8102E] shrink-0">
                    <MessageCircle size={20} strokeWidth={1.5} />
                  </div>
                  <div className="font-body text-neutral-300 text-sm">
                    <strong className="text-white block font-medium mb-0.5">WhatsApp</strong>
                    <a href="https://wa.me/555194086098" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-lg font-semibold text-white">
                      (51) 9408-6098
                    </a>
                  </div>
                </li>

                {/* E-mails */}
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8102E]/10 border border-[#C8102E]/20 flex items-center justify-center text-[#C8102E] shrink-0">
                    <Mail size={20} strokeWidth={1.5} />
                  </div>
                  <div className="font-body text-neutral-300 text-sm space-y-1">
                    <strong className="text-white block font-medium mb-0.5">Canais de E-mail</strong>
                    <div className="flex flex-col gap-1">
                      <a href="mailto:atendimento@lajeadense.com.br" className="hover:text-white transition-colors">
                        atendimento@lajeadense.com.br
                      </a>
                      <a href="mailto:comercial@lajeadense.com.br" className="hover:text-white transition-colors">
                        comercial@lajeadense.com.br
                      </a>
                    </div>
                  </div>
                </li>

                {/* Horário e Atendimento Status */}
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8102E]/10 border border-[#C8102E]/20 flex items-center justify-center text-[#C8102E] shrink-0">
                    <Clock size={20} strokeWidth={1.5} />
                  </div>
                  <div className="font-body text-neutral-300 text-sm space-y-3">
                    <div>
                      <strong className="text-white block font-medium mb-0.5">Horário de Funcionamento</strong>
                      Segunda a Sexta: 7h30 às 12h00 e 13h30 às 17h40
                    </div>
                    {/* Status em tempo real */}
                    <AtendimentoStatus />
                  </div>
                </li>
              </ul>

              {/* Redes Sociais */}
              <div className="pt-4 border-t border-[#222222] flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-display font-medium mr-2">
                  Siga-nos:
                </span>
                <a 
                  href="https://web.facebook.com/lajeadensevidros/?locale=pt_BR&_rdc=1&_rdr" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center hover:bg-[#C8102E] hover:border-[#C8102E] text-white transition-all duration-200"
                >
                  <Facebook size={16} strokeWidth={1.5} />
                </a>
                <a 
                  href="https://www.instagram.com/lajeadensevidros/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center hover:bg-[#C8102E] hover:border-[#C8102E] text-white transition-all duration-200"
                >
                  <Instagram size={16} strokeWidth={1.5} />
                </a>
                <a 
                  href="https://www.youtube.com/@lajeadensevidros633" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center hover:bg-[#C8102E] hover:border-[#C8102E] text-white transition-all duration-200"
                >
                  <Youtube size={16} strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Google Maps Iframe */}
            <div className="bg-[#111111]/80 border border-[#222222] rounded-3xl overflow-hidden p-2 shadow-lg">
              <iframe 
                src="https://maps.google.com/maps?q=Lajeadense+Vidros+BR+386+8495+Lajeado+RS&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="320"
                style={{ border: 0, borderRadius: '1.25rem' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da Lajeadense Vidros"
              />
            </div>

          </div>

          {/* Coluna da Direita: Formulário */}
          <div className="order-1 lg:order-2">
            <ContatoForm produtos={produtos} />
          </div>

        </div>
      </div>
    </main>
  );
}
