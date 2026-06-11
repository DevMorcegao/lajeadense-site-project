'use client'

import { useState, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProdutoCard } from './ProdutoCard'
import { FiltroCategorias } from './FiltroCategorias'
import { ProdutoCard as ProdutoCardType } from '@/lib/types'
import { useSearchParams } from 'next/navigation'

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }
  }
}

function ProdutosGridContent({ produtosIniciais }: { produtosIniciais: ProdutoCardType[] }) {
  const searchParams = useSearchParams()
  const parametroCategoria = searchParams.get('categoria')

  const [categoriaAtiva, setCategoriaAtiva] = useState<string>(parametroCategoria || 'todos')

  const produtosFiltrados = useMemo(() => {
    if (categoriaAtiva === 'todos') return produtosIniciais
    return produtosIniciais.filter(p => p.categoria === categoriaAtiva)
  }, [categoriaAtiva, produtosIniciais])

  return (
    <div className="relative">
      {/* Filtro Sticky */}
      <div
        className="sticky z-30 bg-surface-page/95 backdrop-blur-md border-b border-border-subtle py-4 top-[72px] md:top-[80px]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-16">
          <FiltroCategorias 
            ativa={categoriaAtiva} 
            onChange={setCategoriaAtiva} 
          />
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-16 py-12">
        <motion.div 
          layout
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {produtosFiltrados.map((produto) => (
              <motion.div
                key={produto._id}
                layout
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              >
                <ProdutoCard produto={produto} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {produtosFiltrados.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-text-muted font-body">Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export function ProdutosGrid(props: { produtosIniciais: ProdutoCardType[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen container mx-auto" />}>
      <ProdutosGridContent {...props} />
    </Suspense>
  )
}
