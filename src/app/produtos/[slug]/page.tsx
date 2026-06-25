import { client, urlFor } from '@/lib/sanity'
import { PRODUTO_QUERY, PRODUTOS_SLUGS_QUERY } from '@/lib/queries'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProdutoDetalheView } from '@/components/produtos/ProdutoDetalheView'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(PRODUTOS_SLUGS_QUERY)
    return slugs.map((item: { slug: string }) => ({ slug: item.slug }))
  } catch (err) {
    return []
  }
}

const isPlaceholder = (val?: string) => !val || val.trim() === '' || val.toLowerCase() === 'teste';

const DEFAULT_SEO: Record<string, { title: string; description: string }> = {
  'duo-glass-pinazio-vidro-duplo-termoacustico-com-grid-decorativo': {
    title: 'Vidro Duplo com Pinázio | Duo Glass | Lajeadense Vidros',
    description: 'Vidro duplo termoacústico Duo Glass com pinázio decorativo. Isolamento térmico, acústico e estética clássica para esquadrias de alto padrão.'
  },
  'duoglass-pinazio-vidro-duplo-termoacustico-com-grid-decorativo': {
    title: 'Vidro Duplo com Pinázio | Duoglass | Lajeadense Vidros',
    description: 'Vidro duplo termoacústico Duoglass com pinázio decorativo. Isolamento térmico, acústico e estética clássica para esquadrias de alto padrão.'
  },
  'duo-glass-vidro-duplo-termoacustico': {
    title: 'Vidro Duplo Termoacústico | Duo Glass | Lajeadense Vidros',
    description: 'Vidro duplo Duo Glass com isolamento térmico e acústico superior. Conforto e eficiência energética para residências e empresas no RS.'
  },
  'duoglass-vidro-duplo-termoacustico': {
    title: 'Vidro Duplo Termoacústico | Duoglass | Lajeadense Vidros',
    description: 'Vidro duplo Duoglass com isolamento térmico e acústico superior. Conforto e eficiência energética para residências e empresas no RS.'
  },
  'espelhos': {
    title: 'Espelhos de Alta Qualidade e Definição | Lajeadense Vidros',
    description: 'Espelhos lapidados, bisotados e sob medida. Reflexo perfeito, durabilidade e sofisticação para banheiros, salas e projetos corporativos.'
  },
  'vidro-temperado': {
    title: 'Vidro Temperado para Box e Divisórias | Lajeadense Vidros',
    description: 'Vidro temperado de alta resistência e segurança. Ideal para box de banheiro, portas, janelas e divisórias. Conheça as soluções da Lajeadense.'
  },
  'vidro-de-protecao-solar-linha-habitat-by-cebrace': {
    title: 'Vidro de Proteção Solar Linha Habitat | Lajeadense Vidros',
    description: 'Vidros de proteção solar Cebrace Habitat. Conforto térmico inteligente, redução de calor e bloqueio UV para residências modernas.'
  },
  'vidro-jumbo': {
    title: 'Vidro Jumbo: Grandes Vãos e Amplitude | Lajeadense Vidros',
    description: 'Vidros em tamanho Jumbo para projetos que demandam máxima amplitude e sofisticação. Ideal para fachadas comerciais e residenciais de alto padrão.'
  },
  'vidro-extra-clear': {
    title: 'Vidro Extra Clear de Alta Transparência | Lajeadense Vidros',
    description: 'Vidro Extra Clear com baixíssimo teor de ferro. Transparência pura, máxima passagem de luz e fidelidade de cores para projetos premium.'
  },
  'vidro-polarizado-vidro-inteligente': {
    title: 'Vidro Polarizado Inteligente (Privacy Glass) | Lajeadense',
    description: 'Vidro polarizado inteligente que alterna entre opaco e transparente com um toque. Privacidade, conforto e tecnologia para salas e fachadas.'
  },
  'fort-glass-vidro-multilaminado': {
    title: 'Fort Glass: Vidro Multilaminado de Segurança | Lajeadense',
    description: 'Vidro multilaminado Fort Glass para máxima segurança física e estrutural. Alta resistência a impactos para pisos, visores de piscina e blindagem.'
  },
  'fortglass-vidro-multilaminado': {
    title: 'Fortglass: Vidro Multilaminado de Segurança | Lajeadense',
    description: 'Vidro multilaminado Fortglass para máxima segurança física e estrutural. Alta resistência a impactos para pisos, visores de piscina e blindagem.'
  },
  'vidro-pintado': {
    title: 'Vidro Pintado para Revestimento e Design | Lajeadense',
    description: 'Vidros pintados com cores modernas e durabilidade. Perfeito para revestimento de paredes, divisórias, portas de armário e tampo de mesa.'
  },
  'vidro-laminado': {
    title: 'Vidro Laminado: Segurança e Controle Acústico | Lajeadense',
    description: 'Vidro laminado de alta segurança. Proteção contra estilhaços, atenuação acústica e filtragem de raios UV para coberturas e fachadas.'
  },
  'wall-glass-guarda-corpo': {
    title: 'Wall Glass: Guarda-corpo e Corrimão de Vidro | Lajeadense',
    description: 'Sistema de guarda-corpo Wall Glass com fixação oculta. Transparência elegante, design minimalista e total segurança certificada pela ABNT.'
  },
  'wallglass-guarda-corpo': {
    title: 'Wallglass: Guarda-corpo e Corrimão de Vidro | Lajeadense',
    description: 'Sistema de guarda-corpo Wallglass com fixação oculta. Transparência elegante, design minimalista e total segurança certificada pela ABNT.'
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const produto = await client.fetch(PRODUTO_QUERY, { slug })
  
  if (!produto) return {}
  
  const defaults = DEFAULT_SEO[slug]
  const title = isPlaceholder(produto.seo?.metaTitle)
    ? (defaults?.title || `${produto.nome} | Lajeadense Vidros`)
    : produto.seo.metaTitle
    
  const description = isPlaceholder(produto.seo?.metaDescription)
    ? (defaults?.description || produto.tagline)
    : produto.seo.metaDescription
  
  const images = []
  if (produto.imagemCapa) {
    images.push({
      url: urlFor(produto.imagemCapa).width(1200).height(630).url(),
      width: 1200,
      height: 630,
      alt: isPlaceholder(produto.imagemCapa?.alt) ? `${produto.nome} - Lajeadense Vidros` : produto.imagemCapa.alt,
    })
  }

  return {
    title,
    description,
    alternates: { canonical: `https://lajeadensevidros.com.br/produtos/${slug}` },
    openGraph: {
      title,
      description,
      images,
      type: 'website',
      locale: 'pt_BR',
    },
  }
}

export default async function PaginaProduto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const produto = await client.fetch(PRODUTO_QUERY, { slug })

  if (!produto) notFound()

  return <ProdutoDetalheView produto={produto} />
}
