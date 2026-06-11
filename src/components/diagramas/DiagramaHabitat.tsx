'use client'

import React from 'react'
import { Wrapper, GlassRect, Nota, TM, CS, R } from './shared'

export function DiagramaHabitat() {
  return (
    <Wrapper title="HABITAT" sub="Controle Solar">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Diagrama de controle solar do vidro Habitat">
        {/* --- Coating (fina camada controle solar no lado esquerdo do vidro) --- */}
        <rect x={43} y={18} width={3} height={84} fill="#C47A15" opacity="0.8" rx="0.5" />
        {/* --- Vidro --- */}
        <GlassRect x={46} y={18} w={24} h={84} />

        {/* --- Cota Manual (Textos perfeitamente espaçados e legíveis) --- */}
        <g>
          <line x1={43} y1={12} x2={70} y2={12} stroke={R} strokeWidth="0.8" />
          <line x1={43} y1={9}  x2={43} y2={15} stroke={R} strokeWidth="0.8" />
          <line x1={70} y1={9}  x2={70} y2={15} stroke={R} strokeWidth="0.8" />
          <text x={56.5} y={6} fontSize={7.5} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">8–12 mm</text>
        </g>

        {/* --- Labels exterior / interior --- */}
        <text x={26} y={110} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">exterior</text>
        <text x={88} y={110} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">interior</text>
        {/* linhas guia */}
        <line x1={43} y1={12} x2={43} y2={104} stroke={CS} strokeWidth="0.4" strokeDasharray="3 2" />
        <line x1={70} y1={12} x2={70} y2={104} stroke={CS} strokeWidth="0.4" strokeDasharray="3 2" />

        {/* --- Raios calor/UV bloqueados --- */}
        {[38, 64, 90].map((y, i) => (
          <g key={i}>
            {/* Raio incidente */}
            <line x1={12} y1={y - 10} x2={43} y2={y} stroke="#E8593C" strokeWidth="1.2" />
            <polygon points={`${40},${y - 3} ${40},${y + 3} ${43},${y}`} fill="#E8593C" />
            {/* Raio refletido */}
            <line x1={43} y1={y} x2={16} y2={y + 12} stroke="#E8593C" strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.7" />
          </g>
        ))}

        {/* --- Luz visível transmitida --- */}
        {[51, 77].map((y, i) => (
          <g key={i}>
            {/* Raio passa pelo vidro */}
            <line x1={12} y1={y} x2={70} y2={y} stroke="#F2C94C" strokeWidth="1.0" opacity="0.6" />
            <line x1={70} y1={y} x2={96} y2={y} stroke="#F2C94C" strokeWidth="1.1" />
            <polygon points={`${92},${y - 3} ${92},${y + 3} ${96},${y}`} fill="#F2C94C" />
          </g>
        ))}

        {/* --- Legenda inferior --- */}
        <rect x={12}  y={120} width={5} height={5} fill="#E8593C" opacity="0.8" rx="0.5" />
        <text x={20} y={124} fontSize={5.5} fill={TM} fontFamily="DM Sans">calor bloqueado</text>
        
        <rect x={66} y={120} width={5} height={5} fill="#F2C94C" opacity="0.8" rx="0.5" />
        <text x={74} y={124} fontSize={5.5} fill={TM} fontFamily="DM Sans">luz transmitida</text>

        {/* --- Anotações --- */}
        <Nota x={118} y={36}  titulo="COATING SOLAR"       desc="Camada de controle na face interior" />
        <Nota x={118} y={64}  titulo="ATÉ 70% MENOS CALOR" desc="Reflexão do infravermelho e UV" />
        <Nota x={118} y={92}  titulo="LUZ NATURAL"         desc="Transmissão luminosa preservada" />
      </svg>
    </Wrapper>
  )
}
