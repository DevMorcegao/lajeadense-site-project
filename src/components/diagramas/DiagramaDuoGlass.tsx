'use client'

import React from 'react'
import { Wrapper, GlassRect, Cota, Nota, SP, CH, CS, TM } from './shared'

export function DiagramaDuoGlass() {
  return (
    <Wrapper title="DUO GLASS" sub="Corte Transversal">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Corte transversal do vidro duplo Duo Glass">
        {/* Vidro externo */}
        <GlassRect x={18} y={18} w={13} h={84} />
        {/* Espaçador esquerdo */}
        <rect x={31} y={16} width={5} height={88} fill={SP} opacity="0.72" rx="1" />
        {/* Câmara de ar */}
        <rect x={36} y={18} width={48} height={84} fill={CH} stroke={CS} strokeWidth="0.5" />
        {/* Grânulos de sílica gel (desiccant) */}
        {[28, 40, 52, 64, 76].map(cy => (
          <circle key={cy} cx={42} cy={cy} r={1.2} fill={TM} opacity="0.45" />
        ))}
        {/* Espaçador direito */}
        <rect x={84} y={16} width={5} height={88} fill={SP} opacity="0.72" rx="1" />
        {/* Vidro interno */}
        <GlassRect x={89} y={18} w={13} h={84} />

        {/* Cota câmara */}
        <Cota x1={36} x2={84} y={10} label="6 – 20 mm" />

        {/* Labels camadas */}
        <text x={25} y={115} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>
        <text x={60} y={112} fontSize={6} fill={TM} fontFamily="DM Sans" textAnchor="middle">câmara de</text>
        <text x={60} y={119} fontSize={6} fill={TM} fontFamily="DM Sans" textAnchor="middle">ar/argônio</text>
        <text x={96} y={115} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>

        {/* Setas de bloqueio (calor e ruído) */}
        <line x1={7} y1={38} x2={16} y2={38} stroke="#E8593C" strokeWidth="1.2" strokeDasharray="2 1.5" />
        <text x={5} y={35} fontSize={7} fill="#E8593C" textAnchor="start" fontFamily="DM Sans">☀</text>
        <line x1={7} y1={52} x2={16} y2={52} stroke="#3B8BD4" strokeWidth="1.2" strokeDasharray="2 1.5" />
        <text x={5} y={49} fontSize={7} fill="#3B8BD4" textAnchor="start" fontFamily="DM Sans">♫</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="ISOLAMENTO ACÚSTICO" desc="Atenuação de até 50 dB" />
        <Nota x={118} y={64}  titulo="EFICIÊNCIA TÉRMICA"  desc="Redução de até 70% do calor" />
        <Nota x={118} y={92}  titulo="CÂMARA SELADA"       desc="Ar seco ou gás argônio" />
      </svg>
    </Wrapper>
  )
}
