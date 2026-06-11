import { client } from '@/lib/sanity'
import { PRODUTOS_QUERY } from '@/lib/queries'
import { ProdutosGrid } from '@/components/produtos/ProdutosGrid'
import { ProdutosCTA } from '@/components/produtos/ProdutosCTA'
import { Metadata } from 'next'

// Revalida a página a cada 60 segundos (ISR)
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Linha de Produtos | Lajeadense Vidros',
  description: 'Conheça a linha completa de vidros da Lajeadense: temperado, laminado, termoacústico, polarizado e mais. Soluções técnicas para arquitetos e construtoras no RS.',
  alternates: { canonical: 'https://lajeadensevidros.com.br/produtos' },
}

export default async function ProdutosPage() {
  const produtos = await client.fetch(PRODUTOS_QUERY)
  
  return (
    <main className="min-h-screen bg-surface-page">
      {/* Hero Compacto */}
      <section className="bg-action-strong pt-28 pb-16 md:pt-36 md:pb-16 px-4 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-[2px] bg-action-primary"></div>
            <span className="text-xs font-semibold tracking-widest text-action-primary uppercase font-display">
              Linha Completa
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-on-dark mb-4 font-display uppercase tracking-tight">
            Nossa Linha de Produtos
          </h1>
          <p className="text-lg text-text-on-dark/70 max-w-2xl font-body">
            Soluções técnicas de alto desempenho para cada etapa do seu projeto arquitetônico e estrutural.
          </p>
        </div>
      </section>

      {/* Grid de Produtos com Filtro */}
      <ProdutosGrid produtosIniciais={produtos} />
      
      {/* CTA Final */}
      <ProdutosCTA />
    </main>
  )
}
