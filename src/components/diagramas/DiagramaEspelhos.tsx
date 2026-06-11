'use client'

import React from 'react'
import { Wrapper, GlassRect, Nota, TM, CS, R } from './shared'

export function DiagramaEspelhos() {
  return (
    <Wrapper title="ESPELHOS" sub="Corte Transversal">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Corte transversal de espelho com camada reflexiva">
        {/* --- Suporte traseiro --- */}
        <rect x={18} y={18} width={8} height={84} fill="#4A3728" opacity="0.75" rx="0.5" />
        {/* --- Tinta/verniz protetor --- */}
        <rect x={26} y={18} width={6} height={84} fill="#7B5030" opacity="0.8" rx="0.5" />
        {/* --- Camada de prata (Ag) --- */}
        <rect x={32} y={18} width={3} height={84} fill="#C8C8C8" opacity="0.95" />
        {/* Destaques de reflexo na prata */}
        {[24, 42, 60, 78, 96].map(y => (
          <line key={y} x1={33} y1={y} x2={33} y2={y + 6} stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
        ))}
        {/* --- Vidro float --- */}
        <GlassRect x={35} y={18} w={38} h={84} />

        {/* --- Raios incidentes e refletidos --- */}
        {[44, 76].map((y, i) => (
          <g key={i}>
            {/* Raio incidente (amarelo) */}
            <line x1={102} y1={y - 12} x2={35} y2={y} stroke="#F2C94C" strokeWidth="1.2" opacity="0.85" />
            <polygon points={`${38},${y - 2} ${38},${y + 4} ${35},${y}`} fill="#F2C94C" opacity="0.85" />
            {/* Raio refletido */}
            <line x1={35} y1={y} x2={102} y2={y + 12} stroke="#F2C94C" strokeWidth="1.0" strokeDasharray="2 1.5" opacity="0.75" />
          </g>
        ))}

        {/* --- Legenda inferior com cores (Fim do encavalamento de textos) --- */}
        <g>
          <rect x={12} y={114} width={5} height={5} fill="#7B5030" opacity="0.8" rx="0.5" />
          <text x={20} y={118} fontSize={6} fill={TM} fontFamily="DM Sans">traseira reflexiva</text>

          <rect x={74} y={114} width={5} height={5} fill={G} stroke={GS} strokeWidth="0.5" opacity="0.88" rx="0.5" />
          <text x={82} y={118} fontSize={6} fill={TM} fontFamily="DM Sans">vidro float</text>
        </g>
        
        {/* linhas guia */}
        {[18, 35, 73].map(x => (
          <line key={x} x1={x} y1={12} x2={x} y2={104} stroke={CS} strokeWidth="0.3" strokeDasharray="2 2" />
        ))}

        {/* --- Cota Manual (Sem sobreposição e perfeitamente legível) --- */}
        <g>
          <line x1={18} y1={12} x2={73} y2={12} stroke={R} strokeWidth="0.8" />
          <line x1={18} y1={9}  x2={18} y2={15} stroke={R} strokeWidth="0.8" />
          <line x1={73} y1={9}  x2={73} y2={15} stroke={R} strokeWidth="0.8" />
          <text x={45.5} y={6} fontSize={7.5} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">espessura total</text>
        </g>

        {/* --- Anotações --- */}
        <Nota x={118} y={36}  titulo="CAMADA DE PRATA"   desc="Deposição química controlada" />
        <Nota x={118} y={64}  titulo="REFLEXÃO 80–95%"   desc="Alta fidelidade cromática" />
        <Nota x={118} y={92}  titulo="PROTEÇÃO TRASEIRA"  desc="Resistência à umidade e corrosão" />
      </svg>
    </Wrapper>
  )
}
const G = '#B8D4E8'
const GS = '#7AAAC8'
