'use client'

import React from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Constantes visuais compartilhadas
// ─────────────────────────────────────────────────────────────────────────────
export const G  = '#B8D4E8'   // glass fill
export const GS = '#7AAAC8'   // glass stroke
export const P  = '#F0D4E0'   // PVB fill
export const PS = '#C87090'   // PVB stroke
export const SP = '#7B7B7B'   // aluminium / spacer
export const CH = '#F5F4F2'   // air chamber fill
export const CS = '#DDDCDA'   // air chamber stroke
export const R  = '#C8102E'   // red accent (brand)
export const TM = '#9B9B9B'   // text muted
export const TP = '#0D0D0D'   // text primary
export const TS = '#4B4B4B'   // text secondary
export const WH = '#FFFFFF'   // white highlight

// Wrapper comum — replica o estilo dos componentes existentes
export function Wrapper({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-subtle p-6 rounded-lg border border-border-subtle flex flex-col gap-4 overflow-hidden select-none">
      <div className="flex items-center justify-between border-b border-border-subtle pb-2">
        <span className="text-[11px] font-bold text-text-primary uppercase tracking-wide font-display">{title}</span>
        <span className="text-[9px] text-text-muted uppercase font-body tracking-wider">{sub}</span>
      </div>
      
      {/* Container com scroll horizontal no mobile para manter legibilidade máxima */}
      <div className="w-full overflow-x-auto scrollbar-none pb-1">
        <div className="min-w-[450px] md:min-w-0 w-full h-auto">
          {children}
        </div>
      </div>

      {/* Dica de interação para telas menores (Touch) */}
      <div className="flex items-center justify-center gap-1.5 md:hidden text-[9px] text-text-muted uppercase tracking-wider font-semibold animate-pulse border-t border-border-subtle pt-2">
        <span>Arraste para o lado para explorar</span>
        <span>↔</span>
      </div>
    </div>
  )
}

// Camada de vidro padronizada (rect + highlight)
export function GlassRect({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill={G} stroke={GS} strokeWidth="0.5" opacity="0.88" />
      <rect x={x} y={y} width={2} height={h} fill={WH} opacity="0.28" />
    </>
  )
}

// Grupo de anotação padronizado
export function Nota({ x, y, titulo, desc }: { x: number; y: number; titulo: string; desc: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={2} fill={R} />
      <text x={x + 8} y={y + 3} fontSize={9} fill={TP} fontFamily="Barlow Condensed" fontWeight={700}>{titulo}</text>
      <text x={x + 8} y={y + 14} fontSize={7.5} fill={TS} fontFamily="DM Sans">{desc}</text>
    </g>
  )
}

// Linha de cota (dimensão) com ticks
export function Cota({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  const mx = (x1 + x2) / 2
  return (
    <>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={R} strokeWidth="0.8" />
      <line x1={x1} y1={y - 3} x2={x1} y2={y + 3} stroke={R} strokeWidth="0.8" />
      <line x1={x2} y1={y - 3} x2={x2} y2={y + 3} stroke={R} strokeWidth="0.8" />
      <text x={mx} y={y - 3} fontSize={7.5} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">{label}</text>
    </>
  )
}
