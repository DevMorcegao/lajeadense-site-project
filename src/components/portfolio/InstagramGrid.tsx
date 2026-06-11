"use client"

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Instagram, Calendar, ArrowUpRight } from 'lucide-react'
import { InstagramPost } from './InstagramFeed'

interface InstagramGridProps {
  posts: InstagramPost[]
}

export function InstagramGrid({ posts }: InstagramGridProps) {
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null)

  // Funções de navegação do Lightbox
  const handlePrev = useCallback(() => {
    if (selectedPostIndex === null) return
    setSelectedPostIndex((prev) =>
      prev !== null ? (prev === 0 ? posts.length - 1 : prev - 1) : null
    )
  }, [selectedPostIndex, posts.length])

  const handleNext = useCallback(() => {
    if (selectedPostIndex === null) return
    setSelectedPostIndex((prev) =>
      prev !== null ? (prev === posts.length - 1 ? 0 : prev + 1) : null
    )
  }, [selectedPostIndex, posts.length])

  const handleClose = useCallback(() => {
    setSelectedPostIndex(null)
  }, [])

  // Suporte a teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPostIndex === null) return
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPostIndex, handlePrev, handleNext, handleClose])

  const currentPost = selectedPostIndex !== null ? posts[selectedPostIndex] : null

  // Formata a data de forma amigável
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    } catch {
      return ''
    }
  }

  return (
    <>
      {/* Grid de Postagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post, index) => {
          const displayImage = post.thumbnailUrl || post.mediaUrl

          return (
            <div
              key={post.id}
              onClick={() => setSelectedPostIndex(index)}
              className="relative aspect-square rounded-xl overflow-hidden shadow-card border border-white/5 group cursor-pointer"
            >
              {/* Imagem do Post */}
              <Image
                src={displayImage}
                alt={post.caption ? post.caption.substring(0, 100) : 'Post no Instagram'}
                fill
                sizes="(max-w-640px) 100vw, (max-w-768px) 50vw, (max-w-1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover Glassmorphic Otimizado */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md flex flex-col justify-between p-6 z-10">
                {/* Cabeçalho do Hover */}
                <div className="flex justify-between items-center text-white/70">
                  <Instagram size={18} />
                  {post.timestamp && (
                    <div className="flex items-center gap-1.5 text-xs font-display">
                      <Calendar size={12} />
                      {new Date(post.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </div>
                  )}
                </div>

                {/* Texto da Legenda */}
                <p className="text-white/90 text-xs font-body leading-relaxed line-clamp-4 my-auto">
                  {post.caption}
                </p>

                {/* Indicação de Ação */}
                <div className="flex items-center gap-1.5 text-action-primary text-xs font-bold uppercase tracking-wider font-display self-start">
                  Ler Post e Comentários
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox do Instagram */}
      <AnimatePresence>
        {currentPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between"
            onClick={handleClose}
          >
            {/* Header */}
            <div className="w-full flex justify-between items-center px-6 py-4 relative z-10">
              <span className="text-xs uppercase tracking-widest font-semibold text-white/50 font-display flex items-center gap-2">
                <Instagram size={14} className="text-action-primary" />
                Instagram Lajeadense — {selectedPostIndex! + 1} / {posts.length}
              </span>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Container Principal */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 px-3 sm:px-6 md:px-16 py-2 lg:py-4 overflow-y-auto lg:overflow-hidden relative">
              
              {/* Botões Laterais de Navegação - Desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="hidden lg:flex w-14 h-14 rounded-full bg-black/40 hover:bg-white/10 items-center justify-center text-white border border-white/5 hover:border-white/20 transition-all duration-200 cursor-pointer absolute left-4 xl:left-8 z-20"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="hidden lg:flex w-14 h-14 rounded-full bg-black/40 hover:bg-white/10 items-center justify-center text-white border border-white/5 hover:border-white/20 transition-all duration-200 cursor-pointer absolute right-4 xl:right-8 z-20"
              >
                <ChevronRight size={24} />
              </button>

              {/* Box de Conteúdo Misto */}
              <div 
                className="w-full max-w-5xl lg:h-full flex flex-col lg:flex-row bg-[#141210] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Coluna da Imagem ou Vídeo */}
                <div className="w-full lg:w-[55%] h-[35vh] lg:h-full bg-black relative flex items-center justify-center shrink-0">
                  {currentPost.mediaType === 'VIDEO' ? (
                    <video
                      src={currentPost.mediaUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Image
                      src={currentPost.thumbnailUrl || currentPost.mediaUrl}
                      alt="Instagram Post"
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-w-1024px) 100vw, 800px"
                    />
                  )}
                </div>

                {/* Coluna da Legenda (Direita) */}
                <div className="w-full lg:w-[45%] lg:h-full flex flex-col p-4 sm:p-5 md:p-8 bg-[#1C1917] border-t lg:border-t-0 lg:border-l border-white/10 overflow-hidden">
                  {/* Cabeçalho do Post */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar Simulado */}
                      <div className="w-9 h-9 rounded-full bg-[#C8102E]/10 border border-[#C8102E]/30 flex items-center justify-center text-white">
                        <Instagram size={16} className="text-action-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-on-dark font-display uppercase tracking-wide leading-tight">
                          lajeadensevidros
                        </h4>
                        <span className="text-[10px] text-text-on-dark/40 uppercase tracking-widest font-semibold font-display">
                          Rio Grande do Sul
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Legenda com Rolagem */}
                  <div className="flex-1 min-h-0 overflow-y-auto text-text-on-dark/80 text-xs sm:text-sm font-body leading-relaxed whitespace-pre-line pr-2 custom-scrollbar">
                    {currentPost.caption}
                  </div>

                  {/* Rodapé do Post (Data + Botão de Link) */}
                  <div className="border-t border-white/5 pt-3 sm:pt-4 mt-3 sm:mt-4 flex flex-col items-start gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-text-on-dark/40 font-display self-start sm:self-auto">
                      <Calendar size={13} className="text-action-primary" />
                      {formatDate(currentPost.timestamp)}
                    </div>

                    <a
                      href={currentPost.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#C8102E] text-white py-2.5 px-5 rounded-[8px] font-semibold text-xs uppercase tracking-wider transition-all duration-200 w-full sm:w-auto hover:bg-[#A50D25] cursor-pointer"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Ver no Instagram
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>

              </div>

              {/* Botões de Navegação Mobile */}
              <div className="flex lg:hidden gap-6 py-2 relative z-20 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrev()
                  }}
                  className="w-11 h-11 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center text-white border border-white/10 cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  className="w-11 h-11 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center text-white border border-white/10 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

            </div>

            {/* Rodapé invisível ou vazio para preenchimento */}
            <div className="w-full py-4 text-center text-[10px] text-white/20">
              Lajeadense Vidros © {new Date().getFullYear()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
