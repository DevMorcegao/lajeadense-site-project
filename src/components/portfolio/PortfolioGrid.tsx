"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Maximize2, ExternalLink, Filter } from 'lucide-react'

export interface PortfolioProduct {
  nome: string
  slug: string
  categoria: string
  galeria?: Array<{
    asset: {
      url: string
      _id: string
    }
    alt: string
  }>
}

interface PortfolioGridProps {
  produtos: PortfolioProduct[]
}

interface PortfolioItem {
  id: string
  url: string
  alt: string
  productName: string
  productSlug: string
  category: string
}

const CATEGORIES = [
  { id: 'todos', label: 'Ver Todos' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'conforto', label: 'Conforto' },
  { id: 'estetica', label: 'Estética' },
  { id: 'amplitude', label: 'Amplitude' },
]

export function PortfolioGrid({ produtos }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState('todos')
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Achata e organiza todas as fotos das galerias em um array plano de itens
  const allItems: PortfolioItem[] = produtos.flatMap((prod) => {
    if (!prod.galeria) return []
    return prod.galeria.map((img, index) => {
      const isAltPlaceholder = !img.alt || img.alt.trim() === '' || img.alt.toLowerCase() === 'teste';
      return {
        id: `${prod.slug}-${index}-${img.asset._id || index}`,
        url: img.asset.url,
        alt: isAltPlaceholder ? `Projeto executado com ${prod.nome}` : img.alt,
        productName: prod.nome,
        productSlug: prod.slug,
        category: prod.categoria,
      }
    })
  })

  // Filtra as fotos com base na categoria selecionada
  const filteredItems = allItems.filter(
    (item) => activeFilter === 'todos' || item.category === activeFilter
  )

  // Distribui os itens filtrados em colunas para o scroll infinito alternado
  const numCols = activeFilter === 'todos' ? 4 : 2
  const columns: PortfolioItem[][] = Array.from({ length: numCols }, () => [])
  filteredItems.forEach((item, index) => {
    columns[index % numCols].push(item)
  })

  // Funções para controle de navegação do Lightbox
  const handlePrev = () => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev === 0 ? filteredItems.length - 1 : prev - 1) : null
    )
  }

  const handleNext = () => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev === filteredItems.length - 1 ? 0 : prev + 1) : null
    )
  }

  const handleClose = () => {
    setSelectedImageIndex(null)
  }

  // Evento de teclado para navegação no Lightbox
  useEffect(() => {
    if (selectedImageIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev === 0 ? filteredItems.length - 1 : prev - 1) : null
        )
      }
      if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev === filteredItems.length - 1 ? 0 : prev + 1) : null
        )
      }
      if (e.key === 'Escape') {
        setSelectedImageIndex(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex, filteredItems.length])

  const currentItem =
    selectedImageIndex !== null ? filteredItems[selectedImageIndex] : null

  return (
    <section className="py-12 px-4 md:px-16 max-w-7xl mx-auto">
      {/* Abas de Filtros */}
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center gap-2 mb-6 text-text-secondary/70">
          <Filter size={16} />
          <span className="text-sm font-semibold uppercase tracking-wider font-display">
            Filtrar por Categoria
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2 bg-surface-card p-1.5 rounded-full border border-border-default/40 shadow-sm max-w-2xl">
          {CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveFilter(cat.id)
                  setSelectedImageIndex(null)
                }}
                className={`relative px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-300 font-display cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-action-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid do Mosaico (Masonry com Scroll Infinito ou Estático) */}
      <div className="w-full mb-8">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scrollVertical {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          .scroll-track-normal {
            animation: scrollVertical 100s linear infinite;
          }
          .scroll-track-reverse {
            animation: scrollVertical 100s linear infinite reverse;
          }
        `}} />

        <AnimatePresence mode="wait">
          {activeFilter === 'todos' ? (
            <motion.div
              key="todos-infinite-scroll"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative h-auto sm:h-[1200px] overflow-visible sm:overflow-hidden w-full grid gap-6 grid-cols-1 sm:grid-cols-4"
            >
              {columns.map((columnItems, colIndex) => {
                if (columnItems.length === 0) return null;
                
                const isReverse = colIndex % 2 === 1;
                // Duplicando os itens apenas no desktop para o efeito de loop infinito
                const loopedItems = isMobile ? columnItems : [...columnItems, ...columnItems];

                return (
                  <div
                    key={`col-${colIndex}`}
                    className="h-auto sm:h-full overflow-visible sm:overflow-hidden relative min-w-0"
                  >
                    <div
                      className={`flex flex-col gap-6 ${
                        !isMobile ? (isReverse ? 'scroll-track-reverse' : 'scroll-track-normal') : ''
                      } hover:[animation-play-state:paused] transition-all`}
                      style={{
                        lineHeight: 0,
                      }}
                    >
                      {loopedItems.map((item, itemIdx) => {
                        const originalIndex = allItems.findIndex((x) => x.id === item.id);
                        // Diferentes proporções baseadas no index para o design Masonry
                        const aspectClass = originalIndex % 4 === 0 
                          ? 'aspect-[3/4]' 
                          : originalIndex % 4 === 1 
                            ? 'aspect-square' 
                            : originalIndex % 4 === 2 
                              ? 'aspect-[4/3]' 
                              : 'aspect-[16/10]';

                        return (
                          <div
                            key={`${item.id}-dup-${itemIdx}`}
                            onClick={() => {
                              const realIndex = filteredItems.findIndex((x) => x.id === item.id);
                              if (realIndex !== -1) {
                                setSelectedImageIndex(realIndex);
                              }
                            }}
                            className={`relative w-full ${aspectClass} rounded-xl overflow-hidden shadow-card border border-border-default/30 group cursor-pointer flex-shrink-0`}
                            style={{ marginBottom: '24px' }}
                          >
                            {/* Imagem de Fundo */}
                            <Image
                              src={item.url}
                              alt={item.alt}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Overlay Premium no Hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px] flex flex-col justify-between p-4 z-10">
                              {/* Tag Superior */}
                              <div className="self-end">
                                <span className="text-[10px] bg-action-primary text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] font-display">
                                  {CATEGORIES.find((c) => c.id === item.category)?.label || item.category}
                                </span>
                              </div>

                              {/* Info Inferior */}
                              <div className="flex items-end justify-between gap-2">
                                <div className="text-white max-w-[80%]">
                                  <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold font-display">
                                    Produto
                                  </p>
                                  <h3 className="text-sm font-bold uppercase font-display leading-tight tracking-wide truncate">
                                    {item.productName}
                                  </h3>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200">
                                  <Maximize2 size={14} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key={`category-${activeFilter}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="columns-1 sm:columns-4 gap-6 w-full h-auto"
            >
              {filteredItems.map((item, index) => {
                const originalIndex = allItems.findIndex((x) => x.id === item.id);
                // Diferentes proporções baseadas no index para o design Masonry
                const aspectClass = originalIndex % 4 === 0 
                  ? 'aspect-[3/4]' 
                  : originalIndex % 4 === 1 
                    ? 'aspect-square' 
                    : originalIndex % 4 === 2 
                      ? 'aspect-[4/3]' 
                      : 'aspect-[16/10]';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`break-inside-avoid mb-6 relative ${aspectClass} rounded-xl overflow-hidden shadow-card border border-border-default/30 group cursor-pointer w-full`}
                  >
                    {/* Imagem de Fundo */}
                    <Image
                      src={item.url}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay Premium no Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px] flex flex-col justify-between p-4 z-10">
                      {/* Tag Superior */}
                      <div className="self-end">
                        <span className="text-[10px] bg-action-primary text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] font-display">
                          {CATEGORIES.find((c) => c.id === item.category)?.label || item.category}
                        </span>
                      </div>

                      {/* Info Inferior */}
                      <div className="flex items-end justify-between gap-2">
                        <div className="text-white max-w-[80%]">
                          <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold font-display">
                            Produto
                          </p>
                          <h3 className="text-sm font-bold uppercase font-display leading-tight tracking-wide truncate">
                            {item.productName}
                          </h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200">
                          <Maximize2 size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mensagem se não houver imagens */}
      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-surface-card rounded-2xl border border-border-default/40 my-8">
          <p className="text-text-secondary font-body">
            Nenhuma foto de galeria cadastrada para esta categoria.
          </p>
        </div>
      )}

      {/* Lightbox Premium */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col justify-between"
            onClick={handleClose}
          >
            {/* Header do Lightbox */}
            <div className="w-full flex justify-between items-center px-6 py-4 relative z-10">
              <span className="text-xs uppercase tracking-widest font-semibold text-white/50 font-display">
                Lajeadense Portfólio — {selectedImageIndex! + 1} / {filteredItems.length}
              </span>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Container Principal */}
            <div className="flex-1 flex items-center justify-between px-4 md:px-12 relative">
              {/* Botão Anterior */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center text-white border border-white/5 hover:border-white/20 transition-all duration-200 cursor-pointer absolute left-4 md:left-12 z-20"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Imagem Central */}
              <div
                className="w-full h-full max-w-4xl max-h-[68vh] relative flex items-center justify-center mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  key={currentItem.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={currentItem.url}
                    alt={currentItem.alt}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-w-1200px) 100vw, 1200px"
                  />
                </motion.div>
              </div>

              {/* Botão Próximo */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center text-white border border-white/5 hover:border-white/20 transition-all duration-200 cursor-pointer absolute right-4 md:right-12 z-20"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Painel Inferior */}
            <div
              className="w-full bg-gradient-to-t from-black/80 to-transparent pt-12 pb-8 px-6 text-center z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-left w-full md:w-auto">
                  <span className="text-[10px] text-action-primary uppercase tracking-widest font-bold font-display">
                    {currentItem.productName}
                  </span>
                  <p className="text-sm md:text-base text-white/90 font-body mt-1 leading-relaxed">
                    {currentItem.alt}
                  </p>
                </div>

                <Link
                  href={`/produtos/${currentItem.productSlug}`}
                  className="shrink-0 flex items-center justify-center gap-2 bg-[#C8102E] text-white py-3 px-6 rounded-[8px] font-semibold text-xs uppercase tracking-wider shadow-[0_2px_12px_rgba(200,16,46,0.35)] transition-all duration-200 w-full md:w-auto cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-body)',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#A50D25'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#C8102E'
                  }}
                >
                  Ver Ficha Técnica
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
