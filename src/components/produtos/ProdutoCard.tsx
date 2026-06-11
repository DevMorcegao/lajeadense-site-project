'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import { ProdutoCard as ProdutoCardType } from '@/lib/types'

const CATEGORIA_LABELS: Record<string, string> = {
  seguranca: 'Segurança',
  conforto: 'Conforto',
  estetica: 'Estética',
  amplitude: 'Amplitude',
}

export function ProdutoCard({ produto }: { produto: ProdutoCardType }) {
  const imagemUrl = urlFor(produto.imagemCapa)
    .width(600)
    .height(450)
    .format('webp')
    .quality(85)
    .url()

  return (
    <Link href={`/produtos/${produto.slug}`} className="block h-full group/card">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-surface-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 h-full flex flex-col border border-transparent hover:border-action-primary/10"
      >
        {/* Imagem — quinas retas obrigatórias (radius-none no container, radius-xl no card) */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imagemUrl}
            alt={
              !produto.imagemCapa?.alt || produto.imagemCapa.alt.toLowerCase() === 'teste'
                ? `${produto.nome} - Lajeadense Vidros`
                : produto.imagemCapa.alt
            }
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
          {/* Tag de categoria — slide-in no hover */}
          <span className="absolute top-4 left-4 z-10 bg-action-primary text-text-on-brand text-xs font-semibold px-3 py-1 rounded-sm opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300">
            {CATEGORIA_LABELS[produto.categoria]}
          </span>
        </div>

        {/* Linha vermelha de corte — elemento técnico */}
        <div className="h-0.5 bg-action-primary" />

        {/* Conteúdo */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-display text-2xl font-bold text-text-primary uppercase tracking-tight group-hover/card:text-action-primary transition-colors duration-300">
            {produto.nome}
          </h3>
          <p className="mt-2 text-sm text-text-secondary line-clamp-2 font-body">
            {produto.tagline}
          </p>

          {/* Badges de norma */}
          {produto.normasResumidas?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {produto.normasResumidas.map(norma => (
                <span
                  key={norma.codigo}
                  className="bg-surface-subtle text-text-muted text-xs px-2 py-1 rounded-sm border border-border-subtle"
                >
                  {norma.codigo}
                </span>
              ))}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-grow" />

          <div className="mt-6 h-px bg-border-subtle" />

          {/* Botão único elegante de largura total */}
          <div className="mt-4">
            <span className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-action-secondary text-text-primary border border-border-default text-xs font-bold uppercase tracking-wider rounded-md group-hover/card:bg-action-primary group-hover/card:text-text-on-brand group-hover/card:border-transparent transition-all duration-300">
              <span>Ver Detalhes Técnicos</span>
              <svg
                className="w-4 h-4 transform group-hover/card:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
