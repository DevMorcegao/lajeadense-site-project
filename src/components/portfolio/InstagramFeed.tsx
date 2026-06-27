import { Instagram, ArrowUpRight } from 'lucide-react'
import { InstagramGrid } from './InstagramGrid'

export interface InstagramPost {
  id: string
  mediaUrl: string
  thumbnailUrl?: string // URL da capa do vídeo/Reel
  mediaType: string // "VIDEO", "IMAGE", etc.
  permalink: string
  caption: string
  timestamp: string
}

// Posts fictícios de alta qualidade visual para fallback (segurança visual e integridade de design)
const FALLBACK_POSTS: InstagramPost[] = [
  {
    id: 'fb-1',
    mediaUrl: '/images/sobre/lajeadense-vidros-sobre-img1.webp',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/lajeadensevidros',
    caption: 'Fachada de alto padrão executada com vidro duplo termoacústico Duoglass. Conforto térmico e atenuação acústica em harmonia com o design contemporâneo. 💎🏢 #lajeadensevidros #arquitetura #vidrosdedestaque',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'fb-2',
    mediaUrl: '/images/sobre/lajeadense-vidros-sobre-img2.webp',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/lajeadensevidros',
    caption: 'Guarda-corpo autoportante com nosso sistema autoportante Wallglass. Transparência, sofisticação e máxima segurança atendendo rigorosamente à NBR 14718. 📐✨ #guardacorpo #wallglass #segurança',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'fb-3',
    mediaUrl: '/images/sobre/lajeadense-vidros-sobre-img3.webp',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/lajeadensevidros',
    caption: 'Vidro Multilaminado Fortglass sob medida para coberturas e áreas de alta segurança. Mais proteção e aproveitamento de luz natural para o seu projeto comercial ou residencial. 🔒☀️ #fortglass #arquitetura',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'fb-4',
    mediaUrl: '/images/sobre/lajeadense-vidros-sobre-img4.webp',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/lajeadensevidros',
    caption: 'Tecnologia em ação! Nosso vidro polarizado inteligente permitindo alternar entre privacidade opaca e transparência cristalina com apenas um clique. Inovação e luxo para divisórias e fachadas. 🔌✨ #vidropolarizado #tecnologia',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'fb-5',
    mediaUrl: '/images/sobre/lajeadense-vidros-sobre-img5.webp',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/lajeadensevidros',
    caption: 'Qualidade que atravessa gerações. Há mais de 60 anos, a Lajeadense Vidros desenvolve soluções com inovação tecnológica para o mercado da construção civil do RS. 🤝🏢 #tradição #qualidade #vidro',
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'fb-6',
    mediaUrl: '/images/sobre/lajeadense-vidros-sobre-img6.webp',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/lajeadensevidros',
    caption: 'O design minimalista do vidro temperado Lajeadense em divisórias corporativas. Amplitude visual e isolamento de ambientes corporativos com requinte técnico. 🏢💼 #vidrotemperado #corporativo',
    timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
]

async function getInstagramPosts(): Promise<InstagramPost[]> {
  const feedUrl = process.env.NEXT_PUBLIC_BEHOLD_FEED_URL || process.env.BEHOLD_FEED_URL

  if (!feedUrl) {
    console.log('Behold Instagram Feed URL não está configurada. Usando fallback de segurança.')
    return FALLBACK_POSTS
  }

  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 10800 }, // Caching de 3 horas (ISR)
    })

    if (!res.ok) {
      throw new Error(`Erro na API do Behold: ${res.status}`)
    }

    const data = await res.json()
    
    // O Behold retorna os posts encapsulados em um objeto { posts: [...] } ou diretamente como array.
    // Extraímos com segurança para evitar erros de compilação/execução.
    const postsArray = Array.isArray(data) ? data : (data.posts || [])
    
    return postsArray.slice(0, 8).map((post: any) => ({
      id: post.id,
      mediaUrl: post.mediaUrl || post.media_url,
      thumbnailUrl: post.thumbnailUrl || post.thumbnail_url || '',
      mediaType: post.mediaType || post.media_type || 'IMAGE',
      permalink: post.permalink,
      caption: post.caption || '',
      timestamp: post.timestamp,
    }))
  } catch (error) {
    console.error('Falha ao buscar feed do Instagram via Behold. Usando fallback.', error)
    return FALLBACK_POSTS
  }
}

export async function InstagramFeed() {
  const posts = await getInstagramPosts()

  return (
    <section className="bg-action-strong py-20 px-4 md:px-16 border-t border-border-default/10">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Instagram size={18} className="text-action-primary" />
              <span className="text-xs font-semibold tracking-widest text-action-primary uppercase font-display">
                Mídia Social
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-on-dark font-display uppercase tracking-tight">
              Siga-nos no Instagram
            </h2>
            <p className="text-text-on-dark/60 font-body text-base mt-2 max-w-xl">
              Acompanhe nossos bastidores, lançamentos de novos produtos e obras de destaque executadas por todo o Brasil.
            </p>
          </div>

          <a
            href="https://instagram.com/lajeadensevidros"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center justify-center gap-2 bg-transparent text-text-on-dark border border-text-on-dark/20 py-3 px-6 rounded-[8px] font-semibold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-white/10 hover:border-white/40 cursor-pointer"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            @lajeadensevidros
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Grid de Postagens Interativo (com Lightbox e Suporte a Vídeos/Reels) */}
        <InstagramGrid posts={posts} />
      </div>
    </section>
  )
}
