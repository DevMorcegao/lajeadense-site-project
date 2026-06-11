'use client'

import React from 'react'
import { Wrapper, GlassRect, Cota, Nota, G, GS, P, PS, R, TM } from './shared'

export function DiagramaFortGlass() {
  // 5 vidros + 4 PVBs: largura total = 5×10 + 4×6 = 74px → inicia x=15
  const layers = [
    { x: 15, w: 10, type: 'glass' },
    { x: 25, w: 6,  type: 'pvb'   },
    { x: 31, w: 10, type: 'glass' },
    { x: 41, w: 6,  type: 'pvb'   },
    { x: 47, w: 10, type: 'glass' },   // vidro central
    { x: 57, w: 6,  type: 'pvb'   },
    { x: 63, w: 10, type: 'glass' },
    { x: 73, w: 6,  type: 'pvb'   },
    { x: 79, w: 10, type: 'glass' },
  ]

  return (
    <Wrapper title="FORT GLASS" sub="Stack Multilaminado">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Stack de camadas do vidro multilaminado Fort Glass">
        {/* Camadas */}
        {layers.map((l, i) =>
          l.type === 'glass' ? (
            <GlassRect key={i} x={l.x} y={18} w={l.w} h={84} />
          ) : (
            <g key={i}>
              <rect x={l.x} y={18} width={l.w} height={84} fill={P} stroke={PS} strokeWidth="0.3" opacity="0.85" />
            </g>
          )
        )}

        {/* Seta de impacto da esquerda */}
        <line x1={5} y1={60} x2={13} y2={60} stroke={R} strokeWidth="1.5" />
        <polygon points="13,56 13,64 19,60" fill={R} />
        <text x={3} y={56} fontSize={7} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">!</text>

        {/* Cota total */}
        <Cota x1={15} x2={89} y={10} label="espessura total" />

        {/* Legenda embaixo */}
        <rect x={18} y={113} width={7} height={7} fill={G} stroke={GS} strokeWidth="0.5" opacity="0.88" />
        <text x={28} y={120} fontSize={7} fill={TM} fontFamily="DM Sans">vidro</text>
        <rect x={55} y={113} width={7} height={7} fill={P} stroke={PS} strokeWidth="0.3" opacity="0.85" />
        <text x={65} y={120} fontSize={7} fill={TM} fontFamily="DM Sans">filme PVB</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="IMPACTO RESISTENTE" desc="4× mais que vidro comum" />
        <Nota x={118} y={64}  titulo="CACOS PRESOS"       desc="PVB retém os fragmentos" />
        <Nota x={118} y={92}  titulo="VÃO MANTIDO"        desc="Proteção pós-ruptura" />
      </svg>
    </Wrapper>
  )
}
