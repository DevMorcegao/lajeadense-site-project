'use client'

import React from 'react'
import { Shield, Thermometer, Maximize, Palette, LayoutGrid } from 'lucide-react'

interface FiltroCategoriasProps {
  ativa: string
  onChange: (categoria: string) => void
}

const categorias = [
  { id: 'todos', label: 'Todos', icon: <LayoutGrid size={14} strokeWidth={1.5} /> },
  { id: 'seguranca', label: 'Segurança', icon: <Shield size={14} strokeWidth={1.5} /> },
  { id: 'conforto', label: 'Conforto', icon: <Thermometer size={14} strokeWidth={1.5} /> },
  { id: 'estetica', label: 'Estética', icon: <Palette size={14} strokeWidth={1.5} /> },
  { id: 'amplitude', label: 'Amplitude', icon: <Maximize size={14} strokeWidth={1.5} /> },
]

export function FiltroCategorias({ ativa, onChange }: FiltroCategoriasProps) {
  return (
    <nav className="flex items-center gap-3 overflow-x-auto scrollbar-none scroll-smooth py-1">
      {categorias.map((cat) => {
        const isSelected = ativa === cat.id

        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 cursor-pointer ${isSelected ? 'bg-action-primary text-text-on-brand font-semibold' : 'bg-surface-card text-text-secondary hover:bg-surface-subtle border border-border-default'}`}
          >
            <span className={`inline-flex items-center transition-colors duration-200 ${isSelected ? 'text-text-on-brand' : 'text-action-primary'}`}>
              {cat.icon}
            </span>
            <span className="leading-none">{cat.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
