"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Maximize2, ExternalLink, Filter } from 'lucide-react'

export interface PortfolioCategory {
  _id: string
  titulo: string
  slug: string
  descricao?: string
  imagens: Array<{
    id: string
    alt: string
    imagem: {
      asset: {
        url: string
        _id: string
      }
      hotspot?: any
      crop?: any
    }
    produto: {
      nome: string
      slug: string
    }
  }>
}

interface PortfolioGridProps {
  categories: PortfolioCategory[]
}

interface PortfolioItem {
  id: string
  url: string
  alt: string
  productName: string
  productSlug: string
  category: string
  categoryTitle: string
}

export function PortfolioGrid({ categories }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState('todos')
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [visibleCount, setVisibleCount] = useState(24)

  useEffect(() => {
    let prevWidth = typeof window !== 'undefined' ? window.innerWidth : 0
    const handleResize = () => {
      const width = window.innerWidth
      const mobile = width < 640
      const prevMobile = prevWidth < 640

      setIsMobile(mobile)

      // Apenas reseta a contagem visível se houver transição real de tela cruzando o limite
      if (mobile !== prevMobile) {
        setVisibleCount(mobile ? 12 : 24)
      }
      prevWidth = width
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Gera a lista dinâmica de categorias para os filtros com as contagens
  const totalImagesCount = categories.reduce((sum, cat) => sum + (cat.imagens?.length || 0), 0)
  const dynamicCategories = [
    { id: 'todos', label: 'Ver Todos', count: totalImagesCount, description: '' },
    ...categories.map((cat) => ({
      id: cat.slug,
      label: cat.titulo,
      count: cat.imagens?.length || 0,
      description: cat.descricao || '',
    })),
  ]

  // Encontra a categoria ativa para pegar a descrição
  const activeCategoryDetails = dynamicCategories.find((c) => c.id === activeFilter)

  // Achata e organiza todas as fotos das categorias em um array plano de itens
  const allItems: PortfolioItem[] = categories.flatMap((cat) => {
    if (!cat.imagens) return []
    return cat.imagens.map((img) => {
      const isAltPlaceholder = !img.alt || img.alt.trim() === '' || img.alt.toLowerCase() === 'teste'
      return {
        id: img.id,
        url: img.imagem.asset.url,
        alt: isAltPlaceholder ? `Projeto executado com ${img.produto.nome}` : img.alt,
        productName: img.produto.nome,
        productSlug: img.produto.slug,
        category: cat.slug,
        categoryTitle: cat.titulo,
      }
    })
  })

  // Filtra as fotos com base na categoria selecionada
  // Em "todos", removemos duplicatas (caso uma mesma foto esteja em mais de uma categoria) para a experiência infinita ficar mais limpa
  const filteredItems = activeFilter === 'todos'
    ? allItems.filter((item, index, self) =>
        index === self.findIndex((t) => t.url === item.url)
      )
    : allItems.filter((item) => item.category === activeFilter)

  // Controle de limite de carregamento inteligente (Carregar Mais)

  // Fatiamento dos itens ativos para exibição
  const itemsToRender = filteredItems.slice(0, visibleCount)

  // Distribui os itens fatiados em colunas para o scroll infinito alternado ou grid estático
  const numCols = activeFilter === 'todos' ? 4 : 2
  const columns: PortfolioItem[][] = Array.from({ length: numCols }, () => [])
  itemsToRender.forEach((item, index) => {
    columns[index % numCols].push(item)
  })

  // Funções para controle de navegação do Lightbox
  const handlePrev = () => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev === 0 ? itemsToRender.length - 1 : prev - 1) : null
    )
  }

  const handleNext = () => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev === itemsToRender.length - 1 ? 0 : prev + 1) : null
    )
  }

  const handleClose = () => {
    setSelectedImageIndex(null)
  }

  // Estados para suportar gestos de arrastar (swipe) no mobile no Lightbox
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null)
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return
    const diffX = touchStartX - touchEndX
    const minSwipeDistance = 50

    if (diffX > minSwipeDistance) {
      handleNext()
    } else if (diffX < -minSwipeDistance) {
      handlePrev()
    }
  }

  // Evento de teclado para navegação no Lightbox
  useEffect(() => {
    if (selectedImageIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev === 0 ? itemsToRender.length - 1 : prev - 1) : null
        )
      }
      if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev === itemsToRender.length - 1 ? 0 : prev + 1) : null
        )
      }
      if (e.key === 'Escape') {
        setSelectedImageIndex(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex, itemsToRender.length])

  const currentItem =
    selectedImageIndex !== null ? itemsToRender[selectedImageIndex] : null

  return (
    <section className="py-12 px-4 md:px-16 max-w-7xl mx-auto">
      {/* Abas de Filtros */}
      <div className="w-full flex flex-col items-center mb-12">
        <div className="flex items-center gap-2 mb-6 text-text-secondary/70">
          <Filter size={16} />
          <span className="text-sm font-semibold uppercase tracking-wider font-display">
            Filtrar por Categoria
          </span>
        </div>
        
        {/* Container horizontal com scroll no mobile e centralizado no desktop */}
        <div className="w-full max-w-6xl overflow-x-auto scrollbar-none pb-2 sm:pb-0">
          <div className="flex sm:flex-wrap justify-start sm:justify-center gap-2 p-1.5 bg-surface-card rounded-full sm:rounded-full border border-border-default/40 shadow-sm min-w-max sm:min-w-0 mx-auto w-fit">
            {dynamicCategories.map((cat) => {
              const isActive = activeFilter === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveFilter(cat.id)
                    setSelectedImageIndex(null)
                    setVisibleCount(isMobile ? 12 : 24)
                  }}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-300 font-display cursor-pointer ${
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
                  
                  {/* Badge numérico integrado e sempre visível */}
                  <span className={`relative z-10 text-[14px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-surface-page text-text-secondary group-hover:bg-border-default'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Descrição Dinâmica da Categoria Ativa */}
      {activeFilter !== 'todos' && activeCategoryDetails && (
        <motion.div 
          key={`desc-${activeFilter}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto -mt-6 mb-12"
        >
          <p className="text-sm text-text-secondary font-body leading-relaxed">
            {activeCategoryDetails.description || `Galeria completa de projetos e obras executados na categoria ${activeCategoryDetails.label} pela Lajeadense Vidros.`}
          </p>
        </motion.div>
      )}


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
                              const realIndex = itemsToRender.findIndex((x) => x.id === item.id);
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
                                  {item.categoryTitle}
                                </span>
                              </div>

                              {/* Info Inferior */}
                              <div className="flex items-end justify-between gap-2">
                                <div className="text-white max-w-[80%]">
                                  <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold font-display">
                                    Produto
                                  </p>
                                  <h2 className="text-sm font-bold uppercase font-display leading-tight tracking-wide truncate">
                                    {item.productName}
                                  </h2>
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
              {itemsToRender.map((item, index) => {
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
                          {item.categoryTitle}
                        </span>
                      </div>

                      {/* Info Inferior */}
                      <div className="flex items-end justify-between gap-2">
                        <div className="text-white max-w-[80%]">
                          <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold font-display">
                            Produto
                          </p>
                          <h2 className="text-sm font-bold uppercase font-display leading-tight tracking-wide truncate">
                            {item.productName}
                          </h2>
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

      {/* Botão de Carregar Mais */}
      {filteredItems.length > visibleCount && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + (isMobile ? 12 : 24))}
            className="flex items-center justify-center gap-2 px-8 py-4 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: '#C8102E',
              borderRadius: '8px',
              boxShadow: '0 4px 14px rgba(200,16,46,0.35)',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#A50D25'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C8102E'
            }}
          >
            <span>Carregar mais fotos</span>
            <span className="bg-white/25 px-2 py-0.5 rounded-full text-[10px]">
              +{filteredItems.length - visibleCount}
            </span>
          </button>
        </div>
      )}

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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header do Lightbox */}
            <div className="w-full flex justify-between items-center px-6 py-4 relative z-10">
              <span className="text-xs uppercase tracking-widest font-semibold text-white/50 font-display">
                Lajeadense Portfólio — {selectedImageIndex! + 1} / {filteredItems.length}
              </span>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                aria-label="Fechar galeria"
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
                aria-label="Imagem anterior"
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
                    unoptimized
                    sizes="(max-width: 1200px) 100vw, 1200px"
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
                aria-label="Próxima imagem"
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
