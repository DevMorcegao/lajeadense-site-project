import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',  // data fixa — não usar 'latest'
  useCdn: true,              // CDN para leitura (mais rápido) — true em produção
})

// Helper para gerar URLs de imagem otimizadas
const builder = imageUrlBuilder(client)
export function urlFor(source: any) {
  return builder.image(source).auto('format')
}
