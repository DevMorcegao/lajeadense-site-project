'use client'

import React from 'react'
import { Wrapper, GlassRect, Nota, TM, CS } from './shared'

export function DiagramaExtraClear() {
  return (
    <Wrapper title="EXTRA CLEAR" sub="Pureza Óptica">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Diagrama comparativo vidro extra clear vs float comum">

        {/* ====== Float comum (esquerda) ====== */}
        <rect x={16} y={24} width={30} height={70} fill="#6DA87A" opacity="0.22" rx="0.5" />
        <rect x={16} y={24} width={30} height={70} fill="none" stroke="#7AAAC8" strokeWidth="0.5" />
        <rect x={16} y={24} width={2}  height={70} fill="#FFFFFF" opacity="0.2" />

        {/* raio IN (Horizontal limpo - Sem bugs) */}
        <line x1={3} y1={59} x2={16} y2={59} stroke="#F2C94C" strokeWidth="1.2" opacity="0.9" />
        
        {/* raio passando pelo vidro (Com perda e tom esverdeado do ferro) */}
        <line x1={16} y1={59} x2={46} y2={59} stroke="#76B887" strokeWidth="1.2" opacity="0.75" />
        
        {/* raio OUT esverdeado */}
        <line x1={46} y1={59} x2={58} y2={59} stroke="#76B887" strokeWidth="1.2" opacity="0.9" />
        <polygon points="55,56.5 55,61.5 58,59" fill="#76B887" opacity="0.9" />

        <text x={31} y={106} fontSize={6.5} fill="#5C8F66" fontFamily="DM Sans" textAnchor="middle" fontWeight="700">Float comum</text>
        <text x={31} y={116} fontSize={5.8} fill={TM} fontFamily="DM Sans" textAnchor="middle">~86% transmissão</text>

        {/* ====== Separador ====== */}
        <line x1={64} y1={15} x2={64} y2={118} stroke={CS} strokeWidth="0.6" strokeDasharray="2 2" />
        <text x={64} y={11} fontSize={6} fill={TM} textAnchor="middle" fontFamily="DM Sans">VS</text>

        {/* ====== Extra Clear (direita) ====== */}
        <GlassRect x={76} y={24} w={30} h={70} />

        {/* raio IN (Horizontal limpo) */}
        <line x1={63} y1={59} x2={76} y2={59} stroke="#F2C94C" strokeWidth="1.2" opacity="0.9" />
        
        {/* raio passando pelo vidro (Pureza máxima, transmissão total) */}
        <line x1={76} y1={59} x2={106} y2={59} stroke="#F2C94C" strokeWidth="1.2" opacity="0.9" />
        
        {/* raio OUT amarelo puro */}
        <line x1={106} y1={59} x2={118} y2={59} stroke="#F2C94C" strokeWidth="1.2" opacity="0.92" />
        <polygon points="115,56.5 115,61.5 118,59" fill="#F2C94C" opacity="0.92" />

        <text x={91} y={106} fontSize={6.5} fill="#D4AF37" fontFamily="DM Sans" textAnchor="middle" fontWeight="700">Extra Clear</text>
        <text x={91} y={116} fontSize={5.8} fill={TM} fontFamily="DM Sans" textAnchor="middle">~91% transmissão</text>

        {/* ====== Anotações ====== */}
        <Nota x={122} y={36}  titulo="FERRO REDUZIDO"   desc="Ausência do tint esverdeado" />
        <Nota x={122} y={64}  titulo="MÁXIMA CLAREZA"   desc="+5% de transmissão luminosa" />
        <Nota x={122} y={92}  titulo="IDEAL PARA"       desc="Fachadas e vitrines premium" />
      </svg>
    </Wrapper>
  )
}
