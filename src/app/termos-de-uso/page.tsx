import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso | Lajeadense Vidros',
  description: 'Leia os Termos de Uso do site da Lajeadense Vidros. Conheça as condições para utilização de nosso site e serviços.',
  alternates: { canonical: 'https://lajeadensevidros.com.br/termos-de-uso' },
};

export default function TermosDeUsoPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F2] pt-28 pb-16 md:pt-36 md:pb-24 px-4 md:px-16">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-[2px] bg-[#C8102E]" />
            <span className="text-xs font-semibold tracking-widest text-[#C8102E] uppercase font-display">
              Legal
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0D0D0D] mb-4 font-display uppercase tracking-tight">
            Termos de Uso
          </h1>
          <p className="text-neutral-500 text-sm font-body">
            Última atualização: junho de 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none font-body space-y-8 text-[#3A3A3A] text-sm md:text-base leading-relaxed">

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao acessar e utilizar o site da <strong>Lajeadense Vidros Ltda.</strong> (CNPJ: 89.848.923/0001-01), localizada na Rod. BR 386, Nº 8495, Bairro Imigrante, Lajeado/RS, CEP: 95.911-814, você declara ter lido, compreendido e concordado integralmente com estes Termos de Uso. Caso não concorde com qualquer disposição aqui prevista, recomendamos que não utilize o site.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              2. Objeto do Site
            </h2>
            <p>
              O site da Lajeadense Vidros tem caráter institucional e informativo, destinando-se a apresentar nossos produtos, serviços e informações de contato para clientes e parceiros comerciais. A solicitação de orçamentos por meio dos formulários disponíveis no site não representa confirmação de pedido ou contrato de fornecimento, constituindo apenas o início do processo comercial.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              3. Uso Permitido
            </h2>
            <p>
              O uso deste site é autorizado exclusivamente para fins lícitos e pessoais. Ao acessá-lo, o usuário se compromete a:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Não praticar atos que violem leis, regulamentos ou direitos de terceiros;</li>
              <li>Não tentar obter acesso não autorizado a sistemas, dados ou servidores;</li>
              <li>Não utilizar meios automatizados (bots, scrapers) para coletar informações sem autorização prévia e expressa da Lajeadense Vidros;</li>
              <li>Fornecer informações verdadeiras e precisas ao preencher formulários de contato ou orçamento;</li>
              <li>Não reproduzir, distribuir ou modificar o conteúdo deste site sem autorização expressa e por escrito.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              4. Propriedade Intelectual
            </h2>
            <p>
              Todo o conteúdo disponível neste site — incluindo, mas não se limitando a, textos, imagens, logotipos, fotografias, vídeos, projetos e layout — é de propriedade exclusiva da Lajeadense Vidros ou de terceiros que nos concederam licença de uso, sendo protegido pela legislação brasileira de direitos autorais (Lei nº 9.610/1998) e de propriedade industrial (Lei nº 9.279/1996). É vedada qualquer reprodução, total ou parcial, sem autorização prévia e por escrito.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              5. Orçamentos e Contratação
            </h2>
            <p>
              As solicitações de orçamento realizadas por meio do formulário de contato ou por outros canais digitais são analisadas pela equipe comercial da Lajeadense Vidros. Os preços, prazos e condições apresentados em qualquer proposta têm validade específica indicada no respectivo documento e podem ser alterados sem aviso prévio. A confirmação do fornecimento de produtos ou serviços somente se faz mediante assinatura de contrato ou emissão de pedido formal pelas partes.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              6. Responsabilidades e Limitações
            </h2>
            <p>
              A Lajeadense Vidros empenha todos os esforços razoáveis para manter as informações do site atualizadas e precisas, mas não garante a exatidão, completude ou atualidade de todo o conteúdo. Não nos responsabilizamos por:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Danos decorrentes de interrupções, falhas técnicas ou indisponibilidade temporária do site;</li>
              <li>Eventuais erros de digitação ou imprecisões em informações de produtos;</li>
              <li>Conteúdo de sites de terceiros vinculados por meio de links externos.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              7. Links Externos
            </h2>
            <p>
              Este site pode conter links para sites de terceiros (redes sociais, parceiros, etc.). Esses links são fornecidos apenas para conveniência do usuário. A Lajeadense Vidros não tem controle sobre o conteúdo desses sites externos e não se responsabiliza por suas práticas de privacidade, conteúdo ou funcionamento.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              8. Privacidade e Proteção de Dados
            </h2>
            <p>
              O tratamento de dados pessoais coletados por meio deste site é regido pela nossa{' '}
              <a href="/politica-de-privacidade" className="text-[#C8102E] hover:underline font-medium">
                Política de Privacidade
              </a>
              , em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD). Recomendamos a leitura atenta desse documento.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              9. Alterações nos Termos
            </h2>
            <p>
              A Lajeadense Vidros reserva-se o direito de modificar estes Termos de Uso a qualquer momento, sem aviso prévio. As alterações entrarão em vigor imediatamente após a publicação da versão atualizada nesta página. O uso continuado do site após qualquer modificação implica na aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              10. Foro e Legislação Aplicável
            </h2>
            <p>
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer litígio decorrente da utilização deste site será submetido ao foro da Comarca de Lajeado/RS, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              11. Contato
            </h2>
            <p>
              Para dúvidas, solicitações ou reclamações relacionadas a estes Termos de Uso, entre em contato conosco:
            </p>
            <ul className="list-none pl-0 mt-3 space-y-1">
              <li><strong>E-mail:</strong> atendimento@lajeadense.com.br</li>
              <li><strong>Telefone:</strong> (51) 3714-4799</li>
              <li><strong>Endereço:</strong> Rod. BR 386, Nº 8495, Bairro Imigrante, Lajeado/RS — CEP: 95.911-814</li>
            </ul>
          </section>

        </div>
      </div>
    </main>
  );
}
