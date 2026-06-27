'use client'

import React from 'react'
import { Wrapper, GlassRect, Nota, TM, CS, G, GS, P, PS, CH, R } from './shared'

export function DiagramaDuploPinazio() {
  return (
    <Wrapper title="DUOGLASS + PINÁZIO" sub="Corte Transversal · Vista Frontal">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Diagrama Duoglass com pinázio decorativo">

        {/* ═══════════════════════════════════════
            CORTE TRANSVERSAL — canto esquerdo
        ════════════════════════════════════════ */}

        {/* Vidro exterior */}
        <GlassRect x={10} y={20} w={6} h={74} />
        {/* Câmara de ar */}
        <rect x={16} y={20} width={18} height={74} fill={CH} stroke={CS} strokeWidth="0.5" opacity="0.5" />
        {/* Bolinhas argônio */}
        {[26, 38, 50, 62, 74, 86].map(cy => (
          <circle key={cy} cx={25} cy={cy} r={1.5} fill={G} stroke={GS} strokeWidth="0.3" opacity="0.4" />
        ))}
        {/* Coating Low-E */}
        <line x1={16} y1={20} x2={16} y2={94} stroke="#F2C94C" strokeWidth="1.0" opacity="0.8" />
        
        {/* Vidro interior */}
        <GlassRect x={34} y={20} w={6} h={74} />

        {/* Pinázio DENTRO da câmara */}
        <rect x={21} y={54} width={8} height={6} fill={P} stroke={PS} strokeWidth="0.5" rx="0.5" />

        {/* Cota total do corte Manual (Sem sobreposição) */}
        <g>
          <line x1={10} y1={14} x2={40} y2={14} stroke={R} strokeWidth="0.8" />
          <line x1={10} y1={11} x2={10} y2={17} stroke={R} strokeWidth="0.8" />
          <line x1={40} y1={11} x2={40} y2={17} stroke={R} strokeWidth="0.8" />
          <text x={25}  y={8}  fontSize={7.5} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">duo</text>
        </g>

        {/* Cota câmara Manual (Sem sobreposição) */}
        <g>
          <line x1={16} y1={100} x2={34} y2={100} stroke={R} strokeWidth="0.8" />
          <line x1={16} y1={97}  x2={16}  y2={103} stroke={R} strokeWidth="0.8" />
          <line x1={34} y1={97}  x2={34}  y2={103} stroke={R} strokeWidth="0.8" />
          <text x={25}  y={94}  fontSize={6}   fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">câmara</text>
        </g>

        {/* Rótulo pinázio corte */}
        <text x={25} y={114} fontSize={5.5} fill={PS} fontFamily="DM Sans" textAnchor="middle">pinázio</text>

        {/* Separador vertical - Rótulo corte/vista reposicionado abaixo sem conflitos */}
        <line x1={48} y1={12} x2={48} y2={118} stroke={CS} strokeWidth="0.5" strokeDasharray="2 1.5" />
        <text x={48} y={125} fontSize={5.5} fill={TM} textAnchor="middle" fontFamily="DM Sans">corte / vista</text>

        {/* ═══════════════════════════════════════
            VISTA FRONTAL — painel direito
        ════════════════════════════════════════ */}
        <GlassRect x={56} y={20} w={44} h={74} />
        {/* reflexo diagonal sutil */}
        <line x1={58} y1={22} x2={64} y2={92} stroke="#FFFFFF" strokeWidth="1.0" opacity="0.05" />

        {/* Grade de pinázios horizontais */}
        {[42, 68].map(y => (
          <rect key={y} x={56} y={y} width={44} height={3} fill={P} stroke={PS} strokeWidth="0.3" opacity="0.9" rx="0.5" />
        ))}
        {/* Grade de pinázios verticais */}
        {[70, 86].map(x => (
          <rect key={x} x={x} y={20} width={3} height={74} fill={P} stroke={PS} strokeWidth="0.3" opacity="0.9" rx="0.5" />
        ))}

        {/* Rótulo frontal */}
        <text x={78} y={104} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">vista frontal</text>

        {/* Seta de indicação grid (Linha guia ortogonal técnica — 100% alinhada e legível) */}
        <path d="M 110,54 L 92,54 L 92,42" fill="none" stroke={PS} strokeWidth="0.8" />
        <polygon points="90.5,45 93.5,45 92,42" fill={PS} />
        <text x={110} y={60} fontSize={5.5} fill={PS} fontFamily="DM Sans" textAnchor="middle">grid</text>

        {/* ═══════════════════════════════════════
            ANOTAÇÕES
        ════════════════════════════════════════ */}
        <Nota x={120} y={36}  titulo="DUOGLASS BASE"      desc="Câmara termoacústica com Low-E" />
        <Nota x={120} y={64}  titulo="PINÁZIO DECORATIVO"  desc="Grade interna à câmara de ar" />
        <Nota x={120} y={92}  titulo="PADRÃO COLONIAL"     desc="Layout personalizado disponível" />
      </svg>
    </Wrapper>
  )
}
