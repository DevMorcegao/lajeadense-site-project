'use client'

import React from 'react'
import { Wrapper, Nota, G, GS, WH, CH, TM, SP, CS, TS } from './shared'

export function DiagramaBoxTemperado() {
  return (
    <Wrapper title="VIDRO TEMPERADO" sub="Zonas de Tensão Interna">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Zonas de tensão interna do vidro temperado">
        {/* Zona de compressão superficial esquerda (azul) */}
        <rect x={25} y={18} width={10} height={84} fill="#85B7EB" opacity="0.45" />
        {/* Zona de tração central (âmbar) */}
        <rect x={35} y={18} width={32} height={84} fill="#FAC775" opacity="0.25" />
        {/* Zona de compressão superficial direita (azul) */}
        <rect x={67} y={18} width={10} height={84} fill="#85B7EB" opacity="0.45" />
        {/* Borda geral do vidro */}
        <rect x={25} y={18} width={52} height={84} fill="none" stroke={GS} strokeWidth="1" />
        {/* Highlight */}
        <rect x={25} y={18} width={2}  height={84} fill={WH} opacity="0.25" />

        {/* Furos de ferragem (drill holes) */}
        <circle cx={51} cy={38} r={4.5} fill={CH} stroke={TM} strokeWidth="0.7" />
        <circle cx={51} cy={38} r={2}   fill={SP} opacity="0.6" />
        <circle cx={51} cy={82} r={4.5} fill={CH} stroke={TM} strokeWidth="0.7" />
        <circle cx={51} cy={82} r={2}   fill={SP} opacity="0.6" />

        {/* Inset — fragmentação segura (canto inferior esquerdo) */}
        <rect x={16} y={74} width={22} height={22} fill={CH} stroke={CS} strokeWidth="0.5" rx="1" />
        <text x={27} y={72} fontSize={6} fill={TS} fontFamily="DM Sans" textAnchor="middle" fontWeight="500">fragmentação</text>
        {/* grid de cubinhos */}
        {[0, 1, 2].map(col =>
          [0, 1, 2].map(row => (
            <rect
              key={`${col}-${row}`}
              x={18 + col * 6} y={76 + row * 6}
              width={5} height={5}
              fill={G} stroke={GS} strokeWidth="0.3" opacity="0.7"
              rx="0.5"
            />
          ))
        )}

        {/* Labels zonas */}
        <text x={20} y={114} fontSize={6} fill="#185FA5" fontFamily="DM Sans" textAnchor="middle">compressão</text>
        <text x={50} y={114} fontSize={6} fill="#BA7517" fontFamily="DM Sans" textAnchor="middle">tração</text>
        <text x={80} y={114} fontSize={6} fill="#185FA5" fontFamily="DM Sans" textAnchor="middle">compressão</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="4–5× MAIS RESISTENTE" desc="Impacto, flexão e tração" />
        <Nota x={118} y={64}  titulo="ÚNICO COM FERRAGENS"  desc="Furos antes da têmpera" />
        <Nota x={118} y={92}  titulo="FRAGMENTAÇÃO SEGURA"  desc="Cubos arredondados, sem corte" />
      </svg>
    </Wrapper>
  )
}
