'use client'

import React from 'react'
import { Wrapper, GlassRect, Nota, TM, CS, R, P, PS, TP } from './shared'

export function DiagramaLaminado() {
  return (
    <Wrapper title="VIDRO LAMINADO" sub="Corte Transversal">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Corte transversal do vidro laminado com PVB">
        {/* --- Vidro 1 --- */}
        <GlassRect x={28} y={18} w={18} h={84} />
        
        {/* --- PVB intercalar --- */}
        <rect x={46} y={18} width={8} height={84} fill={P} stroke={PS} strokeWidth="0.5" opacity="0.88" rx="0.5" />
        {/* textura PVB */}
        {[22, 34, 46, 58, 70, 82, 94].map(y => (
          <line key={y} x1={46} y1={y} x2={54} y2={y + 6} stroke={PS} strokeWidth="0.35" opacity="0.3" />
        ))}
        
        {/* --- Vidro 2 --- */}
        <GlassRect x={54} y={18} w={18} h={84} />

        {/* --- Fissuras simuladas no vidro 1 (cacos presos pelo PVB) --- */}
        <line x1={36} y1={26} x2={46} y2={62} stroke={TP} strokeWidth="0.5" opacity="0.35" />
        <line x1={40} y1={21} x2={45} y2={85} stroke={TP} strokeWidth="0.5" opacity="0.3" />
        <line x1={32} y1={48} x2={46} y2={95} stroke={TP} strokeWidth="0.5" opacity="0.25" />

        {/* --- Cota Manual (Sem sobreposição e perfeitamente legível) --- */}
        <g>
          <line x1={28} y1={12} x2={72} y2={12} stroke={R} strokeWidth="0.8" />
          <line x1={28} y1={9}  x2={28} y2={15} stroke={R} strokeWidth="0.8" />
          <line x1={72} y1={9}  x2={72} y2={15} stroke={R} strokeWidth="0.8" />
          <text x={50}  y={6}  fontSize={7.5} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">espessura total</text>
        </g>

        {/* --- Legenda inferior com cores (Fim do vidroPVBvidro grudado) --- */}
        <g>
          <rect x={16} y={114} width={5} height={5} fill={G} stroke={GS} strokeWidth="0.5" opacity="0.88" rx="0.5" />
          <text x={24} y={118} fontSize={6} fill={TM} fontFamily="DM Sans">vidro</text>

          <rect x={56} y={114} width={5} height={5} fill={P} stroke={PS} strokeWidth="0.3" opacity="0.85" rx="0.5" />
          <text x={64} y={118} fontSize={6} fill={TM} fontFamily="DM Sans">filme PVB</text>
        </g>
        
        {/* linhas guia */}
        {[28, 46, 54, 72].map(x => (
          <line key={x} x1={x} y1={12} x2={x} y2={104} stroke={CS} strokeWidth="0.3" strokeDasharray="2 2" />
        ))}

        {/* --- Anotações --- */}
        <Nota x={118} y={36}  titulo="PELÍCULA PVB"      desc="Alta resistência à tração" />
        <Nota x={118} y={64}  titulo="CACOS PRESOS"      desc="Vão permanece vedado ao romper" />
        <Nota x={118} y={92}  titulo="SEGURANÇA NBR"     desc="Uso residencial e comercial" />
      </svg>
    </Wrapper>
  )
}
const G = '#B8D4E8'
const GS = '#7AAAC8'
