'use client'

import React from 'react'
import { Wrapper, GlassRect, Nota, TM, CS } from './shared'

export function DiagramaPolarizado() {
  return (
    <Wrapper title="VIDRO POLARIZADO" sub="Vidro Inteligente — PDLC">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Diagrama do vidro inteligente PDLC nos estados opaco e transparente">

        {/* ====== ESTADO OPACO (esquerda) ====== */}
        <GlassRect x={12} y={24} w={12} h={70} />
        {/* PDLC opaco */}
        <rect x={24} y={24} width={6} height={70} fill="#8B98A8" opacity="0.75" rx="0.5" />
        {/* partículas dispersas */}
        {[29, 39, 49, 59, 69, 79, 89].map(cy => (
          <circle key={cy} cx={27} cy={cy} r={1.2} fill="#C5CDD8" opacity="0.9" />
        ))}
        <GlassRect x={30} y={24} w={12} h={70} />
        
        {/* raio bloqueado (Horizontal limpo - Sem bugs) */}
        <line x1={3} y1={59} x2={24} y2={59} stroke="#F2C94C" strokeWidth="1.2" opacity="0.9" />
        <polygon points="21,56.5 21,61.5 24,59" fill="#F2C94C" opacity="0.9" />
        
        {/* Bloqueio físico vermelho no centro da película */}
        <line x1={24.5} y1={56.5} x2={29.5} y2={61.5} stroke="#E8593C" strokeWidth="1.5" opacity="0.9" />
        <line x1={24.5} y1={61.5} x2={29.5} y2={56.5} stroke="#E8593C" strokeWidth="1.5" opacity="0.9" />
        
        {/* label */}
        <text x={27} y={106} fontSize={6.5} fill="#8B98A8" fontFamily="DM Sans" textAnchor="middle" fontWeight="700">⚡ OFF</text>
        <text x={27} y={116} fontSize={5.8} fill={TM} fontFamily="DM Sans" textAnchor="middle">OPACO</text>

        {/* ====== Separador ====== */}
        <line x1={54} y1={15} x2={54} y2={118} stroke={CS} strokeWidth="0.6" strokeDasharray="2 2" />
        <text x={54} y={11} fontSize={6} fill={TM} textAnchor="middle" fontFamily="DM Sans">→</text>

        {/* ====== ESTADO TRANSPARENTE (direita) ====== */}
        <GlassRect x={66} y={24} w={12} h={70} />
        {/* PDLC alinhado (transparente) */}
        <rect x={78} y={24} width={6} height={70} fill="#B8CCE8" opacity="0.3" rx="0.5" />
        {/* partículas alinhadas */}
        {[29, 39, 49, 59, 69, 79, 89].map(cy => (
          <line key={cy} x1={81} y1={cy - 2} x2={81} y2={cy + 2} stroke="#8AAED4" strokeWidth="1.0" opacity="0.8" />
        ))}
        <GlassRect x={84} y={24} w={12} h={70} />
        
        {/* raio passando direto (Horizontal linear puro e contínuo - Sem bugs de rotação ou zig-zag) */}
        <line x1={57} y1={59} x2={108} y2={59} stroke="#F2C94C" strokeWidth="1.2" opacity="0.9" />
        <polygon points="105,56.5 105,61.5 108,59" fill="#F2C94C" opacity="0.9" />
        
        {/* label */}
        <text x={81} y={106} fontSize={6.5} fill="#8AAED4" fontFamily="DM Sans" textAnchor="middle" fontWeight="700">⚡ ON</text>
        <text x={81} y={116} fontSize={5.8} fill={TM} fontFamily="DM Sans" textAnchor="middle">TRANSPARENTE</text>

        {/* ====== Anotações ====== */}
        <Nota x={122} y={36}  titulo="PELÍCULA PDLC"    desc="Cristais líquidos dispersos" />
        <Nota x={122} y={64}  titulo="COMUTAÇÃO RÁPIDA" desc="Por tensão 110 / 220 V" />
        <Nota x={122} y={92}  titulo="PRIVACIDADE"      desc="Instantânea e programável" />
      </svg>
    </Wrapper>
  )
}
