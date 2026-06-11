import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { PORTFOLIO_PRODUTOS_QUERY } from '@/lib/queries'
import { PortfolioGrid, PortfolioProduct } from '@/components/portfolio/PortfolioGrid'

// Revalidação a cada 3 horas (Incremental Static Regeneration - ISR)
export const revalidate = 10800

export const metadata: Metadata = {
  title: 'Portfólio de Obras e Projetos | Lajeadense Vidros',
  description: 'Galeria completa de projetos e soluções inovadoras em vidro da Lajeadense Vidros: Duo Glass, Wall Glass, laminados, temperados e mais. Confira fotos reais de obras executadas.',
  alternates: { canonical: 'https://lajeadensevidros.com.br/portfolio' },
}

export default async function PortfolioPage() {
  // Busca todos os produtos ativos do Sanity que tenham fotos na galeria
  const produtos: PortfolioProduct[] = await client.fetch(PORTFOLIO_PRODUTOS_QUERY)

  return (
    <main className="min-h-screen bg-surface-page">
      {/* Hero Section Institucional */}
      <section className="bg-action-strong pt-28 pb-16 md:pt-36 md:pb-16 px-4 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-[2px] bg-action-primary"></div>
            <span className="text-xs font-semibold tracking-widest text-action-primary uppercase font-display">
              Galeria Real
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-on-dark mb-4 font-display uppercase tracking-tight">
            Nosso Portfólio de Obras
          </h1>
          <p className="text-lg text-text-on-dark/70 max-w-2xl font-body">
            Explore a aplicação prática e técnica de nossas soluções vidreiras em projetos residenciais, comerciais e corporativos de alto padrão.
          </p>
        </div>
      </section>

      {/* Grid Interativo com Filtros e Lightbox */}
      <PortfolioGrid produtos={produtos} />
    </main>
  )
}
