'use client'

import React from 'react'
import { Wrapper, GlassRect, Nota, TM, R } from './shared'

export function DiagramaVidroPintado() {
  return (
    <Wrapper title="VIDRO PINTADO" sub="Corte Transversal">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Corte transversal do vidro pintado com camada de tinta ceramizada">
        <defs>
          <linearGradient id="paint-grad-vp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A6BBF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1A6BBF" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* --- Vidro base --- */}
        <GlassRect x={24} y={20} w={36} h={74} />

        {/* --- Camada de tinta cerâmica (face posterior) --- */}
        <rect x={60} y={20} width={12} height={74} fill="url(#paint-grad-vp)" rx="0.5" />
        {/* textura cerâmica */}
        {[24, 36, 48, 60, 72, 84].map(y => (
          <line key={y} x1={60} y1={y} x2={72} y2={y + 6} stroke="#FFFFFF" strokeWidth="0.35" opacity="0.15" />
        ))}

        {/* --- Cota Manual (Sem sobreposição) --- */}
        <g>
          <line x1={24} y1={12} x2={72} y2={12} stroke={R} strokeWidth="0.8" />
          <line x1={24} y1={9}  x2={24} y2={15} stroke={R} strokeWidth="0.8" />
          <line x1={72} y1={9}  x2={72} y2={15} stroke={R} strokeWidth="0.8" />
          <text x={48}  y={6}  fontSize={7.5} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">vidro pintado</text>
        </g>

        {/* --- Label inferior --- */}
        <text x={48} y={104} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">composição multicamadas</text>

        {/* --- Paleta de cores disponíveis --- */}
        {['#1A6BBF', '#E8593C', '#2ECC71', '#F2C94C', '#222222', '#8B4513'].map((c, i) => (
          <rect key={c} x={18 + i * 11} y={112} width={8} height={6} fill={c} rx="1" />
        ))}
        <text x={48} y={125} fontSize={5.8} fill={TM} fontFamily="DM Sans" textAnchor="middle">paleta de cores disponíveis</text>

        {/* --- Anotações --- */}
        <Nota x={118} y={36}  titulo="TINTA CERÂMICA"   desc="Aplicada na face posterior" />
        <Nota x={118} y={64}  titulo="COR SÓLIDA"       desc="Sem transparência — totalmente opaco" />
        <Nota x={118} y={92}  titulo="USO DECORATIVO"   desc="Fachadas e revestimentos internos" />
      </svg>
    </Wrapper>
  )
}
