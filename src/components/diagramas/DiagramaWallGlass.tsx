'use client'

import React from 'react'
import { Wrapper, GlassRect, Nota, P, PS, SP, TM, R } from './shared'

export function DiagramaWallGlass() {
  return (
    <Wrapper title="WALLGLASS" sub="Fixação Base Shoe">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Fixação base shoe do guarda-corpo Wallglass">
        {/* Base shoe (perfil de fixação inferior) */}
        <rect x={52} y={92} width={34} height={18} fill={SP} opacity="0.85" rx="1" />
        <rect x={52} y={92} width={34} height={18} fill="none" stroke={TM} strokeWidth="0.5" />
        
        {/* Parafusos/Fixadores da base shoe */}
        <circle cx={61} cy={101} r={2} fill={TM} />
        <circle cx={61} cy={101} r={1} fill="#fff" opacity="0.3" />
        <circle cx={77} cy={101} r={2} fill={TM} />
        <circle cx={77} cy={101} r={1} fill="#fff" opacity="0.3" />

        {/* Vidro Externo (Laminado Temperado) */}
        <GlassRect x={61} y={25} w={5} h={70} />

        {/* Filme PVB central */}
        <rect x={66} y={25} width={2} height={70} fill={P} stroke={PS} strokeWidth="0.3" opacity="0.85" />

        {/* Vidro Interno */}
        <GlassRect x={68} y={25} w={5} h={70} />

        {/* Perfil superior de acabamento (Corrimão U) */}
        <rect x={59} y={20} width={16} height={6} fill={SP} opacity="0.95" rx="0.5" />
        <rect x={59} y={20} width={16} height={6} fill="none" stroke={TM} strokeWidth="0.5" />

        {/* Cota superior de composição Manual (Sem sobreposição com a linha vermelha de baixo) */}
        <g>
          <line x1={61} y1={12} x2={73} y2={12} stroke={R} strokeWidth="0.8" />
          <line x1={61} y1={9}  x2={61} y2={15} stroke={R} strokeWidth="0.8" />
          <line x1={73} y1={9}  x2={73} y2={15} stroke={R} strokeWidth="0.8" />
          <text x={67}  y={6}  fontSize={7.5} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">10+10 mm</text>
        </g>

        {/* Rótulo de base shoe na esquerda com linha */}
        <line x1={52} y1={101} x2={32} y2={101} stroke={TM} strokeWidth="0.5" strokeDasharray="1.5,1.5" />
        <text x={29} y={103} fontSize={6} fill={TM} fontFamily="DM Sans" textAnchor="end">base shoe</text>

        {/* Anotações técnicas na direita */}
        <Nota x={118} y={36}  titulo="ESTRUTURAL AUTOPORTANTE" desc="Dispensa montantes de metal" />
        <Nota x={118} y={64}  titulo="RESISTÊNCIA E SEGURANÇA" desc="Vidro temperado multilaminado" />
        <Nota x={118} y={92}  titulo="CONFORME NBR 14718"     desc="Suporta cargas de até 1.5 kN/m" />
      </svg>
    </Wrapper>
  )
}
