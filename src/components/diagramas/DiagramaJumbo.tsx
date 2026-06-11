'use client'

import React from 'react'
import { Wrapper, GlassRect, Nota, TM, CS, R } from './shared'

export function DiagramaJumbo() {
  return (
    <Wrapper title="VIDRO JUMBO" sub="Dimensões Máximas">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Diagrama de dimensões do vidro jumbo">

        {/* --- Painel principal (vista frontal) --- */}
        <GlassRect x={28} y={20} w={48} h={80} />
        {/* reflexos diagonais */}
        <line x1={30} y1={22} x2={40} y2={98} stroke="#FFFFFF" strokeWidth="1.2" opacity="0.08" />
        <line x1={42} y1={20} x2={52} y2={100} stroke="#FFFFFF" strokeWidth="0.6" opacity="0.05" />

        {/* --- Cota largura Manual (Sem sobreposição) --- */}
        <g>
          <line x1={28} y1={12} x2={76} y2={12} stroke={R} strokeWidth="0.8" />
          <line x1={28} y1={9}  x2={28} y2={15} stroke={R} strokeWidth="0.8" />
          <line x1={76} y1={9}  x2={76} y2={15} stroke={R} strokeWidth="0.8" />
          <text x={52}  y={6}  fontSize={7.5} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">até 3.210 mm</text>
        </g>

        {/* --- Cota altura (lateral esquerda) --- */}
        <line x1={20} y1={20} x2={20} y2={100} stroke={R} strokeWidth="0.8" />
        <line x1={17} y1={20} x2={23} y2={20} stroke={R} strokeWidth="0.8" />
        <line x1={17} y1={100} x2={23} y2={100} stroke={R} strokeWidth="0.8" />
        <text
          x={14} y={60}
          fontSize={7.5} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle"
          transform="rotate(-90, 14, 60)"
        >até 6.000 mm</text>

        {/* --- Corte de espessura (painel lateral) --- */}
        <GlassRect x={88} y={44} w={12} h={45} />
        
        {/* Cota espessura Manual (Sem sobreposição) --- */}
        <g>
          <line x1={88} y1={36} x2={100} y2={36} stroke={R} strokeWidth="0.8" />
          <line x1={88} y1={33} x2={88}  y2={39} stroke={R} strokeWidth="0.8" />
          <line x1={100} y1={33} x2={100} y2={39} stroke={R} strokeWidth="0.8" />
          <text x={94}  y={30}  fontSize={7.5} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">4–19 mm</text>
        </g>

        {/* linhas conectando ao painel principal */}
        <line x1={76} y1={48} x2={88} y2={46} stroke={CS} strokeWidth="0.4" strokeDasharray="2 2" />
        <line x1={76} y1={92} x2={88} y2={87} stroke={CS} strokeWidth="0.4" strokeDasharray="2 2" />

        {/* --- Rótulos de identificação embaixo --- */}
        <text x={52} y={114} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">painel jumbo</text>
        <text x={94} y={114} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">espessura</text>

        {/* --- Anotações --- */}
        <Nota x={118} y={36}  titulo="GRANDES FORMATOS"  desc="Até 3,21 × 6,00 metros" />
        <Nota x={118} y={64}  titulo="MENOS EMENDAS"     desc="Integração arquitetônica total" />
        <Nota x={118} y={92}  titulo="ESPESSURAS"        desc="4 mm a 19 mm disponíveis" />
      </svg>
    </Wrapper>
  )
}
