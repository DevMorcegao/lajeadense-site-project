// lib/types.ts

export type ProdutoCard = {
  _id: string
  nome: string
  slug: string
  categoria: 'seguranca' | 'conforto' | 'estetica' | 'amplitude'
  tagline: string
  imagemCapa: SanityImage
  normasResumidas: { codigo: string }[]
}

export type ProdutoDetalhe = ProdutoCard & {
  descricaoCompleta: any[]   // Texto Portável (rich text do Sanity)
  especificacoes: { label: string; valor: string }[]
  normasABNT: { codigo: string; descricao: string }[]
  aplicacoes: string[]
  galeria: SanityImage[]
  modelo3dUrl: string
  seo: {
    metaTitle: string
    metaDescription: string
  }
}

export type SanityImage = {
  asset: { url: string; _id: string }
  alt: string
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}
