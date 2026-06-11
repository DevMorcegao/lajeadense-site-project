import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Lajeadense Vidros',
  description: 'Saiba como a Lajeadense Vidros coleta, utiliza e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).',
  alternates: { canonical: 'https://lajeadensevidros.com.br/politica-de-privacidade' },
};

export default function PoliticaDePrivacidadePage() {
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
            Política de Privacidade
          </h1>
          <p className="text-neutral-500 text-sm font-body">
            Última atualização: junho de 2025 · Em conformidade com a LGPD (Lei nº 13.709/2018)
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none font-body space-y-8 text-[#3A3A3A] text-sm md:text-base leading-relaxed">

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              1. Quem Somos (Controlador dos Dados)
            </h2>
            <p>
              A <strong>Lajeadense Vidros Ltda.</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 89.848.923/0001-01, com sede na Rod. BR 386, Nº 8495, Bairro Imigrante, Lajeado/RS, CEP 95.911-814, é a <strong>Controladora</strong> dos dados pessoais coletados por meio deste site, nos termos da Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018).
            </p>
            <p className="mt-3">
              Para contato com nosso encarregado (DPO) ou para exercício de direitos, utilize o e-mail:{' '}
              <a href="mailto:lajeadense@lajeadense.com.br" className="text-[#C8102E] hover:underline">
                lajeadense@lajeadense.com.br
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              2. Quais Dados Coletamos
            </h2>
            <p>Coletamos os seguintes dados pessoais por meio do formulário de contato/orçamento:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Nome completo</strong> — para identificação do solicitante;</li>
              <li><strong>Endereço de e-mail</strong> — para envio de resposta e proposta comercial;</li>
              <li><strong>Número de telefone / WhatsApp</strong> — para contato rápido da equipe comercial;</li>
              <li><strong>Mensagem e descrição do projeto</strong> — para elaboração do orçamento.</li>
            </ul>
            <p className="mt-3">
              Também podemos coletar dados de navegação de forma anônima e agregada (páginas visitadas, tempo de sessão) por meio de ferramentas de análise, sem identificação individual.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              3. Finalidade e Base Legal do Tratamento
            </h2>
            <p>Tratamos seus dados pessoais para as seguintes finalidades, com as respectivas bases legais previstas na LGPD:</p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0D0D0D] text-white">
                    <th className="text-left p-3 font-display font-semibold uppercase tracking-wider text-xs">Finalidade</th>
                    <th className="text-left p-3 font-display font-semibold uppercase tracking-wider text-xs">Base Legal (LGPD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr className="bg-white">
                    <td className="p-3">Atender à solicitação de orçamento ou contato iniciada pelo titular</td>
                    <td className="p-3">Art. 7º, V — Execução de contrato ou procedimentos preliminares</td>
                  </tr>
                  <tr className="bg-neutral-50">
                    <td className="p-3">Envio de proposta comercial personalizada</td>
                    <td className="p-3">Art. 7º, V — Execução de contrato ou procedimentos preliminares</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3">Cumprimento de obrigações legais e fiscais</td>
                    <td className="p-3">Art. 7º, II — Cumprimento de obrigação legal ou regulatória</td>
                  </tr>
                  <tr className="bg-neutral-50">
                    <td className="p-3">Melhoria dos serviços e análise de desempenho do site (dados anônimos)</td>
                    <td className="p-3">Art. 7º, IX — Legítimo interesse do controlador</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              4. Compartilhamento de Dados
            </h2>
            <p>
              A Lajeadense Vidros <strong>não vende, aluga nem cede</strong> seus dados pessoais a terceiros para fins comerciais. Podemos compartilhar dados com:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Prestadores de serviço de TI</strong> (hospedagem, serviço de envio de e-mail) — que atuam como operadores sob contrato de confidencialidade e somente nos limites necessários para a prestação do serviço;</li>
              <li><strong>Autoridades públicas</strong> — quando exigido por lei, ordem judicial ou regulamentação aplicável.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              5. Prazo de Retenção dos Dados
            </h2>
            <p>
              Conservamos seus dados pessoais pelo tempo necessário para cumprir as finalidades para as quais foram coletados, observando os seguintes critérios:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Dados de orçamentos não convertidos em contrato: até <strong>2 anos</strong> após o último contato;</li>
              <li>Dados de contratos firmados: pelo prazo legal aplicável (mínimo de <strong>5 anos</strong>), em conformidade com o Código Civil e legislação tributária;</li>
              <li>Dados de navegação anônima: até <strong>26 meses</strong>.</li>
            </ul>
            <p className="mt-3">
              Após o vencimento dos prazos, os dados serão eliminados ou anonimizados.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              6. Seus Direitos como Titular
            </h2>
            <p>
              A LGPD garante a você, titular dos dados, os seguintes direitos, que podem ser exercidos a qualquer momento por meio do e-mail{' '}
              <a href="mailto:lajeadense@lajeadense.com.br" className="text-[#C8102E] hover:underline">
                lajeadense@lajeadense.com.br
              </a>:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Confirmação e acesso</strong> — confirmar se tratamos seus dados e obter cópia;</li>
              <li><strong>Correção</strong> — solicitar a correção de dados incompletos, inexatos ou desatualizados;</li>
              <li><strong>Eliminação</strong> — solicitar a exclusão de dados desnecessários ou tratados em desconformidade com a LGPD;</li>
              <li><strong>Portabilidade</strong> — solicitar a transferência de seus dados a outro fornecedor de serviço;</li>
              <li><strong>Revogação do consentimento</strong> — quando o tratamento for baseado no consentimento, retirar sua autorização a qualquer momento;</li>
              <li><strong>Oposição</strong> — opor-se ao tratamento realizado com fundamento em legítimo interesse;</li>
              <li><strong>Informação sobre compartilhamento</strong> — ser informado sobre com quais entidades seus dados são compartilhados.</li>
            </ul>
            <p className="mt-3">
              Responderemos às solicitações no prazo de até <strong>15 dias úteis</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              7. Cookies e Tecnologias Similares
            </h2>
            <p>
              Atualmente, este site utiliza apenas cookies técnicos estritamente necessários para o funcionamento das páginas (como o controle de limite de envio de formulários via localStorage). Não utilizamos cookies de rastreamento comportamental ou de publicidade. Caso isso mude no futuro, esta política será atualizada e o usuário será informado.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              8. Segurança dos Dados
            </h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, perda acidental, destruição ou alteração. Nosso site utiliza protocolo HTTPS (TLS) para criptografar a transmissão de dados entre seu navegador e nossos servidores. Os dados recebidos via formulário são transmitidos diretamente para nosso e-mail corporativo por meio de serviço de envio seguro.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              9. Alterações nesta Política
            </h2>
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças nas nossas práticas ou na legislação vigente. A data de &quot;última atualização&quot; no topo desta página indica quando a versão mais recente foi publicada. Recomendamos que você consulte esta página regularmente.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl uppercase text-[#0D0D0D] mb-3 tracking-tight">
              10. Contato e Reclamações
            </h2>
            <p>
              Para questões relacionadas a esta Política de Privacidade ou para exercer seus direitos como titular, entre em contato:
            </p>
            <ul className="list-none pl-0 mt-3 space-y-1">
              <li><strong>E-mail:</strong> lajeadense@lajeadense.com.br</li>
              <li><strong>Telefone:</strong> (51) 3714-4799</li>
              <li><strong>Endereço:</strong> Rod. BR 386, Nº 8495, Bairro Imigrante, Lajeado/RS — CEP: 95.911-814</li>
            </ul>
            <p className="mt-4">
              Caso entenda que seus direitos não foram atendidos de forma satisfatória, você tem o direito de apresentar reclamação à{' '}
              <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong>, em{' '}
              <a href="https://www.gov.br/anpd" target="_blank" rel="noreferrer" className="text-[#C8102E] hover:underline">
                www.gov.br/anpd
              </a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
