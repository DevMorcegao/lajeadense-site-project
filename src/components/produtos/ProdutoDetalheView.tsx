'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { PortableText } from '@portabletext/react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import { ProdutoDetalhe } from '@/lib/types'
import { ArrowLeft, CheckCircle2, FileText, Layout, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { DIAGRAMAS, DiagramaGenerico } from '../diagramas'

// Carregamento dinâmico — Three.js não funciona no servidor
const Viewer3D = dynamic(
  () => import('./Viewer3D').then(mod => mod.Viewer3D),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full bg-surface-section animate-pulse flex items-center justify-center"
        style={{ aspectRatio: '16/10' }}
      >
        <span className="text-text-muted font-body text-sm">Preparando experiência 3D...</span>
      </div>
    )
  }
)

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-base text-text-secondary leading-relaxed mb-4 font-body">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-display text-2xl font-bold text-text-primary uppercase mt-8 mb-3">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-display text-xl font-bold text-text-primary uppercase mt-6 mb-3">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-text-secondary font-body">{children}</ul>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-text-primary">{children}</strong>
    ),
  },
}

const CATEGORIA_LABELS: Record<string, string> = {
  seguranca: 'Segurança',
  conforto: 'Conforto',
  estetica: 'Estética',
  amplitude: 'Amplitude',
}

interface ProdutoDetalheViewProps {
  produto: ProdutoDetalhe
}

export function ProdutoDetalheView({ produto }: ProdutoDetalheViewProps) {
  const Diagrama = DIAGRAMAS[produto.slug] || DiagramaGenerico

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const nextLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (produto.galeria) {
      setLightboxIndex((prev) => (prev + 1) % produto.galeria.length)
    }
  }

  const prevLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (produto.galeria) {
      setLightboxIndex((prev) => (prev - 1 + produto.galeria.length) % produto.galeria.length)
    }
  }

  return (
    <article className="min-h-screen bg-surface-page pt-[72px] md:pt-[104px]">
      {/* Breadcrumb */}
      <nav className="sticky top-[72px] md:top-[80px] z-30 border-b border-border-subtle bg-surface-page/95 backdrop-blur-md px-4 md:px-16 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/produtos"
            className="flex items-center gap-2 text-text-muted hover:text-action-primary transition-colors text-xs font-medium font-body shrink-0 truncate"
          >
            <ArrowLeft size={14} strokeWidth={1.5} className="shrink-0" />
            <span className="truncate">Voltar para Produtos</span>
          </Link>
          <div className="hidden md:flex items-center text-xs text-text-muted font-body truncate">
            <Link href="/" className="hover:text-text-primary transition-colors">Início</Link>
            <span className="mx-2">/</span>
            <Link href="/produtos" className="hover:text-text-primary transition-colors">Produtos</Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary font-medium">{produto.nome}</span>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal c/ Controle de Overflow */}
      <div className="w-full overflow-x-hidden">
        {/* Split Layout 40/60 */}
        <div className="grid lg:grid-cols-[2fr_3fr] min-h-screen items-start w-full">

        {/* Coluna Esquerda — Conteúdo técnico, scroll normal */}
        <div className="px-4 py-8 md:px-12 lg:pl-16 lg:pr-12 lg:py-16 space-y-10 min-w-0">

          {/* Header do produto */}
          <header>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-[2px] w-8 bg-action-primary shrink-0"></span>
              <span className="text-xs font-semibold text-action-primary uppercase tracking-widest font-display truncate">
                {CATEGORIA_LABELS[produto.categoria] || produto.categoria}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary font-display uppercase leading-[0.95] mb-4 break-words">
              {produto.nome}
            </h1>
            <p className="text-lg text-text-secondary font-body break-words">
              {produto.tagline}
            </p>
          </header>

          {/* Descrição completa */}
          <div className="border-t border-border-subtle pt-8">
            <PortableText value={produto.descricaoCompleta} components={portableTextComponents} />
          </div>

          {/* Diagrama Técnico SVG (obrigatório) */}
          <div className="bg-surface-subtle rounded-lg p-6 md:p-8 border border-border-subtle w-full max-w-full overflow-hidden">
            <h3 className="font-display font-bold text-xl uppercase mb-6 flex items-center gap-3 break-words">
              <Layout size={18} strokeWidth={1.5} className="text-action-primary shrink-0" />
              Detalhamento de Composição
            </h3>
            <Diagrama />
          </div>

          {/* Especificações Técnicas */}
          {produto.especificacoes && produto.especificacoes.length > 0 && (
            <div className="bg-surface-subtle rounded-lg p-6 md:p-8 border border-border-subtle">
              <h3 className="font-display font-bold text-xl uppercase mb-6 flex items-center gap-3 break-words">
                <FileText size={18} strokeWidth={1.5} className="text-action-primary shrink-0" />
                Especificações Técnicas
              </h3>
              <dl className="grid grid-cols-1 gap-6 w-full">
                {produto.especificacoes.map((spec, i) => (
                  <div key={i} className="border-b border-border-subtle pb-3 min-w-0">
                    <dt className="text-xs uppercase text-text-muted font-semibold tracking-wide mb-1 break-words">
                      {spec.label}
                    </dt>
                    <dd className="text-sm text-text-primary font-medium font-body break-words">
                      {spec.valor}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Aplicações Típicas */}
          {produto.aplicacoes && produto.aplicacoes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-[2px] w-6 bg-action-primary shrink-0"></span>
                <h3 className="font-display font-bold text-lg uppercase tracking-wide break-words">
                  Aplicações Recomendadas
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {produto.aplicacoes.map((app, i) => (
                  <span
                    key={i}
                    className="bg-surface-subtle text-text-secondary text-xs px-4 py-2 rounded-sm border border-border-subtle font-medium font-body break-words max-w-full"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certificações e Normas ABNT */}
          {produto.normasABNT && produto.normasABNT.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-[2px] w-6 bg-action-primary shrink-0"></span>
                <h3 className="font-display font-bold text-lg uppercase tracking-wide break-words">
                  Certificações e Normas
                </h3>
              </div>
              <div className="space-y-3">
                {produto.normasABNT.map((norma, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckCircle2 size={16} strokeWidth={1.5} className="text-action-primary shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary font-body break-words">{norma.codigo}</p>
                      <p className="text-xs text-text-secondary font-body break-words">{norma.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Separador */}
          <div className="h-px bg-border-subtle" />

          {/* Botões de Ação (CTAs) */}
          <div className="flex flex-col gap-3 w-full">
            <Link
              href={`/contato?produto=${produto.slug}`}
              className="inline-flex items-center justify-center w-full py-4 px-2 text-sm font-semibold uppercase tracking-wide transition-all duration-200 break-words max-w-full"
              style={{
                backgroundColor: "#C8102E",
                color: "#FFFFFF",
                borderRadius: "8px",
                boxShadow: "0 2px 12px rgba(200,16,46,0.35)",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#A50D25";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#C8102E";
              }}
            >
              Solicitar Orçamento
            </Link>
          </div>
        </div>

        {/* Coluna Direita — Mídia */}
        <div className="p-2 flex flex-col gap-2 min-w-0">
          {/* Visualizador 3D */}
          {produto.modelo3dUrl ? (
            <div className="rounded-sm overflow-hidden">
              <Viewer3D modelUrl={produto.modelo3dUrl} isConfigurable={produto.slug === 'vidro-pintado'} isPolarizable={produto.slug === 'vidro-polarizado-vidro-inteligente'} isExtraClear={produto.slug === 'vidro-extra-clear'} />
            </div>
          ) : (
            <div className="relative aspect-[16/10] bg-surface-section overflow-hidden rounded-sm">
              <Image
                src={urlFor(produto.imagemCapa).width(1200).height(750).url()}
                alt={
                  !produto.imagemCapa?.alt || produto.imagemCapa.alt.toLowerCase() === 'teste'
                    ? `${produto.nome} - Lajeadense Vidros`
                    : produto.imagemCapa.alt
                }
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Galeria */}
          {produto.galeria && produto.galeria.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {produto.galeria.map((foto, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(idx)}
                  className="relative overflow-hidden cursor-pointer rounded-sm aspect-square group"
                >
                  <Image
                    src={urlFor(foto).width(400).height(400).url()}
                    alt={
                      !foto.alt || foto.alt.toLowerCase() === 'teste'
                        ? `${produto.nome} - Detalhe do produto em obra (${idx + 1}) - Lajeadense Vidros`
                        : foto.alt
                    }
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay sutil para indicar expansão */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal do Lightbox */}
      <AnimatePresence>
        {lightboxOpen && produto.galeria && produto.galeria.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2 cursor-pointer"
            >
              <X size={32} strokeWidth={1.5} />
            </button>

            {/* Controles de navegação */}
            {produto.galeria.length > 1 && (
              <>
                <button
                  onClick={prevLightboxImage}
                  className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors p-4 z-50 cursor-pointer"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={48} strokeWidth={1} />
                </button>

                <button
                  onClick={nextLightboxImage}
                  className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors p-4 z-50 cursor-pointer"
                  aria-label="Próxima"
                >
                  <ChevronRight size={48} strokeWidth={1} />
                </button>
              </>
            )}

            {/* Imagem Atual */}
            <div className="relative w-full max-w-5xl h-[80vh] px-4 md:px-12" onClick={(e) => e.stopPropagation()}>
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image
                  src={urlFor(produto.galeria[lightboxIndex]).width(1600).url()}
                  alt={
                    !produto.galeria[lightboxIndex].alt || produto.galeria[lightboxIndex].alt.toLowerCase() === 'teste'
                      ? `${produto.nome} - Detalhe da foto ${lightboxIndex + 1} - Lajeadense Vidros`
                      : produto.galeria[lightboxIndex].alt
                  }
                  fill
                  className="object-contain"
                  unoptimized
                />
              </motion.div>
              <div className="absolute bottom-[-40px] left-0 right-0 text-center text-white/70 font-body text-sm">
                {lightboxIndex + 1} / {produto.galeria.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Final — seção escura full width focada em portfólio */}
      <section className="py-20 bg-action-strong px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-on-dark font-display uppercase mb-6">
            Quer ver este produto aplicado em projetos reais?
          </h2>
          <p className="text-text-on-dark/70 font-body mb-8">
            Explore nossa galeria de obras e inspire-se com a aplicação de nossos vidros de alta performance na arquitetura moderna.
          </p>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold uppercase tracking-wide border transition-all duration-200"
            style={{
              color: "#FFFFFF",
              borderColor: "rgba(255,255,255,0.4)",
              borderRadius: "8px",
              backgroundColor: "transparent",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
          >
            Ver Portfólio de Obras
          </Link>
        </div>
      </section>


      </div>

      {/* Modal do Lightbox */}
    </article>
  )
}
