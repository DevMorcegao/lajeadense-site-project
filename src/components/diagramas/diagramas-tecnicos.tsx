'use client'
import React from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Constantes visuais compartilhadas
// ─────────────────────────────────────────────────────────────────────────────
const G  = '#B8D4E8'   // glass fill
const GS = '#7AAAC8'   // glass stroke
const P  = '#F0D4E0'   // PVB fill
const PS = '#C87090'   // PVB stroke
const SP = '#7B7B7B'   // aluminium / spacer
const CH = '#F5F4F2'   // air chamber fill
const CS = '#DDDCDA'   // air chamber stroke
const R  = '#C8102E'   // red accent (brand)
const TM = '#9B9B9B'   // text muted
const TP = '#0D0D0D'   // text primary
const TS = '#4B4B4B'   // text secondary
const WH = '#FFFFFF'   // white highlight

// Wrapper comum — replica o estilo dos componentes existentes
function Wrapper({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-subtle p-space-6 radius-lg border border-border-subtle relative overflow-hidden">
      <div className="absolute top-4 right-4 text-right pointer-events-none">
        <span className="text-[10px] font-bold text-text-primary uppercase tracking-tighter font-display block">{title}</span>
        <span className="text-[9px] text-text-muted uppercase font-body">{sub}</span>
      </div>
      {children}
    </div>
  )
}

// Camada de vidro padronizada (rect + highlight)
function GlassRect({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill={G} stroke={GS} strokeWidth="0.5" opacity="0.88" />
      <rect x={x} y={y} width={2} height={h} fill={WH} opacity="0.28" />
    </>
  )
}

// Grupo de anotação padronizado
function Nota({ x, y, titulo, desc }: { x: number; y: number; titulo: string; desc: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={2} fill={R} />
      <text x={x + 8} y={y + 3} fontSize={9} fill={TP} fontFamily="Barlow Condensed" fontWeight={700}>{titulo}</text>
      <text x={x + 8} y={y + 14} fontSize={7.5} fill={TS} fontFamily="DM Sans">{desc}</text>
    </g>
  )
}

// Linha de cota (dimensão) com ticks
function Cota({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  const mx = (x1 + x2) / 2
  return (
    <>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={R} strokeWidth="0.8" />
      <line x1={x1} y1={y - 3} x2={x1} y2={y + 3} stroke={R} strokeWidth="0.8" />
      <line x1={x2} y1={y - 3} x2={x2} y2={y + 3} stroke={R} strokeWidth="0.8" />
      <text x={mx} y={y - 3} fontSize={7.5} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">{label}</text>
    </>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. GLASS — Vidro Duplo Termoacústico
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaDuoGlass() {
  return (
    <Wrapper title="DUOGLASS" sub="Corte Transversal">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Corte transversal do vidro duplo Duoglass">
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
        <text x={25} y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>
        <text x={60} y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">câmara ar/argônio</text>
        <text x={96} y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>

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

// ═════════════════════════════════════════════════════════════════════════════
// 2. WALLGLASS — Guarda-Corpo
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaWallGlass() {
  return (
    <Wrapper title="WALLGLASS" sub="Perfil de Instalação">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Perfil de instalação do Wallglass guarda-corpo">
        {/* Piso */}
        <rect x={16} y={108} width={90} height={6} fill={TP} opacity="0.12" rx="1" />
        <line x1={16} y1={108} x2={106} y2={108} stroke={CS} strokeWidth="0.8" />

        {/* Trilho base (perfil U) */}
        <rect x={30} y={90} width={62} height={4}  fill={SP} opacity="0.82" rx="1" />   {/* base */}
        <rect x={30} y={80} width={5}  height={14} fill={SP} opacity="0.82" rx="1" />   {/* lado esq */}
        <rect x={87} y={80} width={5}  height={14} fill={SP} opacity="0.82" rx="1" />   {/* lado dir */}

        {/* Vidro laminado */}
        <GlassRect x={47} y={18} w={28} h={72} />
        {/* Reflexo diagonal no vidro */}
        <line x1={50} y1={24} x2={56} y2={62} stroke={WH} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />

        {/* Passa-mão arredondado */}
        <rect x={38} y={10} width={46} height={10} fill={SP} opacity="0.85" rx="5" />
        {/* Brilho no passa-mão */}
        <rect x={40} y={11} width={42} height={3} fill={WH} opacity="0.2" rx="2" />

        {/* Leader lines */}
        <line x1={84} y1={15}  x2={116} y2={15}  stroke={CS} strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1={75} y1={54}  x2={116} y2={54}  stroke={CS} strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1={92} y1={87}  x2={116} y2={87}  stroke={CS} strokeWidth="0.5" strokeDasharray="2 2" />

        {/* Anotações */}
        <Nota x={118} y={15}  titulo="PASSA-MÃO"       desc="Slim ou arredondado" />
        <Nota x={118} y={54}  titulo="VIDRO LAMINADO"  desc="NBR 14697 — obrigatório" />
        <Nota x={118} y={87}  titulo="PERFIL LINEAR"   desc="Preto ou escovado" />

        {/* Cota altura vidro */}
        <Cota x1={30} x2={47} y={54} label="" />
        <line x1={38} y1={18} x2={38} y2={90} stroke={R} strokeWidth="0.6" strokeDasharray="1.5 1.5" />
        <text x={15} y={55} fontSize={7} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">h</text>
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. FORTGLASS — Multilaminado
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaFortGlass() {
  // 5 vidros + 4 PVBs: largura total = 5×10 + 4×6 = 74px → inicia x=15
  const layers = [
    { x: 15, w: 10, type: 'glass' },
    { x: 25, w: 6,  type: 'pvb'   },
    { x: 31, w: 10, type: 'glass' },
    { x: 41, w: 6,  type: 'pvb'   },
    { x: 47, w: 10, type: 'glass' },   // vidro central
    { x: 57, w: 6,  type: 'pvb'   },
    { x: 63, w: 10, type: 'glass' },
    { x: 73, w: 6,  type: 'pvb'   },
    { x: 79, w: 10, type: 'glass' },
  ]

  return (
    <Wrapper title="FORTGLASS" sub="Stack Multilaminado">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Stack de camadas do vidro multilaminado Fortglass">
        {/* Camadas */}
        {layers.map((l, i) =>
          l.type === 'glass' ? (
            <GlassRect key={i} x={l.x} y={18} w={l.w} h={84} />
          ) : (
            <g key={i}>
              <rect x={l.x} y={18} width={l.w} height={84} fill={P} stroke={PS} strokeWidth="0.3" opacity="0.85" />
            </g>
          )
        )}

        {/* Seta de impacto da esquerda */}
        <line x1={5} y1={60} x2={13} y2={60} stroke={R} strokeWidth="1.5" />
        <polygon points="13,56 13,64 19,60" fill={R} />
        <text x={3} y={56} fontSize={7} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle">!</text>

        {/* Cota total */}
        <Cota x1={15} x2={89} y={10} label="espessura total" />

        {/* Legenda embaixo */}
        <rect x={18} y={113} width={7} height={7} fill={G} stroke={GS} strokeWidth="0.5" opacity="0.88" />
        <text x={28} y={120} fontSize={7} fill={TM} fontFamily="DM Sans">vidro</text>
        <rect x={55} y={113} width={7} height={7} fill={P} stroke={PS} strokeWidth="0.3" opacity="0.85" />
        <text x={65} y={120} fontSize={7} fill={TM} fontFamily="DM Sans">filme PVB</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="IMPACTO RESISTENTE" desc="4× mais que vidro comum" />
        <Nota x={118} y={64}  titulo="CACOS PRESOS"       desc="PVB retém os fragmentos" />
        <Nota x={118} y={92}  titulo="VÃO MANTIDO"        desc="Proteção pós-ruptura" />
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. HABITAT — Controle Solar
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaHabitat() {
  return (
    <Wrapper title="HABITAT" sub="Controle Solar">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Diagrama de controle solar do vidro Habitat">
        {/* Camada de coating (thin, âmbar) */}
        <rect x={46} y={10} width={4} height={100} fill="#C47A15" opacity="0.55" rx="1" />
        {/* Vidro */}
        <GlassRect x={50} y={10} w={16} h={100} />

        {/* ---- Lado exterior (esquerdo) ---- */}
        {/* Raios solares (IR + UV) — bloqueados */}
        {[
          { y1: 22, y2: 35, yR: 28 },
          { y1: 48, y2: 60, yR: 54 },
          { y1: 74, y2: 86, yR: 80 },
        ].map((r, i) => (
          <g key={i}>
            {/* Raio entrante */}
            <line x1={8} y1={r.y1} x2={44} y2={r.yR} stroke="#E8593C" strokeWidth="1.2" />
            <polygon
              points={`${44},${r.yR - 3} ${44},${r.yR + 3} ${50},${r.yR}`}
              fill="#E8593C"
            />
            {/* Raio refletido (volta para esquerda) */}
            <line x1={44} y1={r.yR} x2={16} y2={r.y2} stroke="#E8593C" strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.7" />
          </g>
        ))}

        {/* ---- Lado interior (direito) — luz filtrada passa ---- */}
        <line x1={66} y1={38} x2={106} y2={38} stroke="#F2C94C" strokeWidth="1" opacity="0.75" />
        <polygon points="100,35 100,41 108,38" fill="#F2C94C" opacity="0.75" />
        <line x1={66} y1={62} x2={106} y2={62} stroke="#F2C94C" strokeWidth="0.8" opacity="0.6" />
        <polygon points="100,59 100,65 108,62" fill="#F2C94C" opacity="0.6" />

        {/* Label exterior / interior */}
        <text x={20} y={8} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">exterior</text>
        <text x={88} y={8} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">interior</text>
        <line x1={46} y1={5} x2={46} y2={112} stroke={CS} strokeWidth="0.4" strokeDasharray="2 2" />
        <line x1={66} y1={5} x2={66} y2={112} stroke={CS} strokeWidth="0.4" strokeDasharray="2 2" />

        {/* Legenda embaixo */}
        <rect x={14} y={118} width={6} height={4} fill="#E8593C" opacity="0.7" />
        <text x={23} y={123} fontSize={6.5} fill={TM} fontFamily="DM Sans">calor/UV bloqueado</text>
        <rect x={63} y={118} width={6} height={4} fill="#F2C94C" opacity="0.7" />
        <text x={72} y={123} fontSize={6.5} fill={TM} fontFamily="DM Sans">luz natural transmitida</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="COATING SOLAR"    desc="Camada de controle na face" />
        <Nota x={118} y={64}  titulo="ATÉ 70% MENOS CALOR" desc="Refletivo ou neutro" />
        <Nota x={118} y={92}  titulo="LUZ NATURAL"      desc="Transmissão preservada" />
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. VIDRO TEMPERADO — Box de Banheiro
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaBoxTemperado() {
  return (
    <Wrapper title="VIDRO TEMPERADO" sub="Zonas de Tensão Interna">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Zonas de tensão interna do vidro temperado">
        {/* Zona de compressão superficial esquerda (azul) */}
        <rect x={25} y={18} width={10} height={84} fill="#85B7EB" opacity="0.45" />
        {/* Zona de tração central (âmbar) */}
        <rect x={35} y={18} width={32} height={84} fill="#FAC775" opacity="0.25" />
        {/* Zona de compressão superficial direita (azul) */}
        <rect x={67} y={18} width={10} height={84} fill="#85B7EB" opacity="0.45" />
        {/* Borda geral do vidro */}
        <rect x={25} y={18} width={52} height={84} fill="none" stroke={GS} strokeWidth="1" />
        {/* Highlight */}
        <rect x={25} y={18} width={2}  height={84} fill={WH} opacity="0.25" />

        {/* Furos de ferragem (drill holes) */}
        <circle cx={51} cy={38} r={4.5} fill={CH} stroke={TM} strokeWidth="0.7" />
        <circle cx={51} cy={38} r={2}   fill={SP} opacity="0.6" />
        <circle cx={51} cy={82} r={4.5} fill={CH} stroke={TM} strokeWidth="0.7" />
        <circle cx={51} cy={82} r={2}   fill={SP} opacity="0.6" />

        {/* Inset — fragmentação segura (canto inferior esquerdo) */}
        <rect x={16} y={74} width={22} height={22} fill={CH} stroke={CS} strokeWidth="0.5" rx="1" />
        <text x={27} y={72} fontSize={6} fill={TM} fontFamily="DM Sans" textAnchor="middle">fragmentação</text>
        {/* grid de cubinhos */}
        {[0, 1, 2].map(col =>
          [0, 1, 2].map(row => (
            <rect
              key={`${col}-${row}`}
              x={18 + col * 6} y={76 + row * 6}
              width={5} height={5}
              fill={G} stroke={GS} strokeWidth="0.3" opacity="0.7"
              rx="0.5"
            />
          ))
        )}

        {/* Labels zonas */}
        <text x={30} y={115} fontSize={7} fill="#185FA5" fontFamily="DM Sans" textAnchor="middle">compressão</text>
        <text x={51} y={115} fontSize={7} fill="#BA7517" fontFamily="DM Sans" textAnchor="middle">tração</text>
        <text x={72} y={115} fontSize={7} fill="#185FA5" fontFamily="DM Sans" textAnchor="middle">compressão</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="4–5× MAIS RESISTENTE" desc="Impacto, flexão e tração" />
        <Nota x={118} y={64}  titulo="ÚNICO COM FERRAGENS"  desc="Furos antes da têmpera" />
        <Nota x={118} y={92}  titulo="FRAGMENTAÇÃO SEGURA"  desc="Cubos arredondados, sem corte" />
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 6. VIDRO LAMINADO
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaLaminado() {
  return (
    <Wrapper title="VIDRO LAMINADO" sub="Corte Transversal">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Corte transversal do vidro laminado com PVB">
        {/* Vidro 1 */}
        <GlassRect x={20} y={18} w={16} h={84} />
        {/* PVB central */}
        <rect x={36} y={18} width={10} height={84} fill={P} stroke={PS} strokeWidth="0.5" opacity="0.88" />
        {/* Textura PVB — linhas diagonais sutis */}
        {[22, 30, 38, 46, 54, 62, 70, 78, 86, 94].map(y => (
          <line key={y} x1={36} y1={y} x2={46} y2={y + 8} stroke={PS} strokeWidth="0.3" opacity="0.35" />
        ))}
        {/* Vidro 2 */}
        <GlassRect x={46} y={18} w={16} h={84} />

        {/* Simulação de fratura com cacos presos */}
        {/* Linhas de fratura no vidro 1 */}
        <line x1={23} y1={30} x2={34} y2={55} stroke={TP} strokeWidth="0.5" opacity="0.35" />
        <line x1={28} y1={22} x2={34} y2={72} stroke={TP} strokeWidth="0.5" opacity="0.3" />
        <line x1={32} y1={40} x2={22} y2={80} stroke={TP} strokeWidth="0.5" opacity="0.25" />
        {/* PVB mantém — seta indicando */}
        <text x={41} y={61} fontSize={8} fill={PS} textAnchor="middle">▲</text>

        {/* Cota */}
        <Cota x1={20} x2={62} y={10} label="espessura total" />

        {/* Labels */}
        <text x={28} y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>
        <text x={41} y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">PVB</text>
        <text x={54} y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="PELÍCULA PVB"        desc="Alta resistência à tração" />
        <Nota x={118} y={64}  titulo="CACOS PRESOS"        desc="Vão permanece vedado" />
        <Nota x={118} y={92}  titulo="USO RESIDENCIAL"     desc="e comercial — NBR 14697" />
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 7. VIDRO JUMBO — Amplitude
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaJumbo() {
  return (
    <Wrapper title="VIDRO JUMBO" sub="Comparativo de Escala">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Diagrama de escala do vidro jumbo com figura humana para comparação">
        {/* Painel de vidro jumbo (proporcionalmente alto) */}
        <GlassRect x={42} y={8} w={36} h={108} />
        {/* Reflexo diagonal */}
        <line x1={46} y1={14} x2={52} y2={60} stroke={WH} strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
        <line x1={52} y1={12} x2={56} y2={35} stroke={WH} strokeWidth="0.8" opacity="0.2" strokeLinecap="round" />

        {/* Figura humana (silhueta) para escala */}
        {/* Escala: ~1.75m → ~30px de altura. Painel = 108px ≈ 6m → 18px/m */}
        <circle cx={24} cy={77} r={5} fill={TP} opacity="0.22" />           {/* cabeça */}
        <rect   x={20} cy={82} width={8} height={18} fill={TP} opacity="0.22" rx="2" y={82} /> {/* corpo */}
        <line x1={22} y1={100} x2={20} y2={116} stroke={TP} strokeWidth="2" strokeLinecap="round" opacity="0.22" />   {/* perna esq */}
        <line x1={26} y1={100} x2={28} y2={116} stroke={TP} strokeWidth="2" strokeLinecap="round" opacity="0.22" />   {/* perna dir */}

        {/* Cota de altura do vidro */}
        <line x1={12} y1={8}  x2={12} y2={116} stroke={R} strokeWidth="0.7" />
        <line x1={9}  y1={8}  x2={15} y2={8}   stroke={R} strokeWidth="0.7" />
        <line x1={9}  y1={116} x2={15} y2={116} stroke={R} strokeWidth="0.7" />
        <text x={10}  y={64}  fontSize={8} fill={R} fontFamily="DM Sans" fontWeight={700} textAnchor="middle" transform="rotate(-90 10 64)">até 6 m</text>

        {/* Cota largura */}
        <Cota x1={42} x2={78} y={125} label="sob medida" />

        {/* Label escala humana */}
        <text x={24} y={123} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">~1,75 m</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="ATÉ 6 METROS"       desc="Pano único sem emendas" />
        <Nota x={118} y={64}  titulo="AMPLITUDE VISUAL"   desc="Fachadas all-glass limpas" />
        <Nota x={118} y={92}  titulo="SOB MEDIDA"         desc="Dimensões personalizadas" />
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 8. ESPELHOS — Cristal Bisotê / Polido
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaEspelhos() {
  return (
    <Wrapper title="ESPELHOS" sub="Camadas de Fabricação">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Corte transversal das camadas de fabricação do espelho cristal">
        {/* Vidro float */}
        <GlassRect x={18} y={18} w={20} h={84} />
        {/* Prata (coating refletivo) */}
        <rect x={38} y={18} width={7} height={84} fill="#D8D8D8" stroke="#A0A0A0" strokeWidth="0.5" opacity="0.9" />
        <rect x={38} y={18} width={2} height={84} fill={WH} opacity="0.4" />
        {/* Cobre (proteção) */}
        <rect x={45} y={18} width={5} height={84} fill="#C87A40" stroke="#A0603A" strokeWidth="0.3" opacity="0.75" />
        {/* Tinta protetora */}
        <rect x={50} y={18} width={6} height={84} fill="#2A3A2A" opacity="0.65" />

        {/* Detalhe bisotê (chanfro na borda superior) */}
        <polygon points="18,18 30,18 18,30" fill={GS} opacity="0.5" />
        <text x={14} y={16} fontSize={6.5} fill={R} fontFamily="DM Sans">bisotê</text>
        <line x1={24} y1={16} x2={24} y2={18} stroke={R} strokeWidth="0.6" />

        {/* Raio de luz entrando e refletindo */}
        <line x1={6}  y1={28} x2={36} y2={50} stroke="#F2C94C" strokeWidth="1.2" />
        <polygon points="34,47 38,51 32,53" fill="#F2C94C" />
        {/* Reflexo perfeito */}
        <line x1={36} y1={50} x2={8}  y2={70} stroke="#F2C94C" strokeWidth="1.2" strokeDasharray="3 1.5" />
        <text x={5} y={26} fontSize={7} fill="#F2C94C" fontFamily="DM Sans">luz</text>
        <text x={5} y={74} fontSize={7} fill="#F2C94C" fontFamily="DM Sans" opacity="0.7">reflexo</text>

        {/* Cota */}
        <Cota x1={18} x2={56} y={10} label="espessura total" />

        {/* Labels camadas */}
        <text x={28} y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>
        <text x={42} y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">Ag</text>
        <text x={48} y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">Cu</text>
        <text x={53} y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">tinta</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="REFLEXÃO PERFEITA"   desc="Vidro cristal 1ª linha" />
        <Nota x={118} y={64}  titulo="ALTA DURABILIDADE"   desc="Proteção anti-oxidação" />
        <Nota x={118} y={92}  titulo="BISOTÊ OU POLIDO"    desc="Acabamento sob escolha" />
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 9. VIDRO POLARIZADO — Smart Glass / PDLC
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaPolarizado() {
  const PDLC = '#9FE1CB'
  const PDLCS = '#1D9E75'

  return (
    <Wrapper title="VIDRO POLARIZADO" sub="Tecnologia PDLC">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Diagrama da tecnologia PDLC do vidro polarizado inteligente">
        {/* Vidro 1 */}
        <GlassRect x={18} y={18} w={14} h={84} />
        {/* PVB 1 */}
        <rect x={32} y={18} width={7} height={84} fill={P} stroke={PS} strokeWidth="0.3" opacity="0.8" />
        {/* Película PDLC (destaque) */}
        <rect x={39} y={18} width={22} height={84} fill={PDLC} stroke={PDLCS} strokeWidth="0.8" opacity="0.82" />
        {/* Símbolo de cristal líquido (moléculas) */}
        {[28, 44, 60, 76].map(cy => (
          <g key={cy}>
            <circle cx={50} cy={cy} r={1.5} fill={PDLCS} opacity="0.6" />
            <line x1={47} y1={cy} x2={53} y2={cy} stroke={PDLCS} strokeWidth="0.8" opacity="0.5" />
          </g>
        ))}
        {/* PVB 2 */}
        <rect x={61} y={18} width={7} height={84} fill={P} stroke={PS} strokeWidth="0.3" opacity="0.8" />
        {/* Vidro 2 */}
        <GlassRect x={68} y={18} w={14} h={84} />

        {/* Conectores elétricos */}
        <line x1={50} y1={8}  x2={50} y2={17} stroke={PDLCS} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={50} cy={7} r={3} fill={PDLCS} opacity="0.8" />
        <text x={55} y={9} fontSize={6.5} fill={PDLCS} fontFamily="DM Sans">110/220V</text>
        <line x1={50} y1={102} x2={50} y2={113} stroke={PDLCS} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={50} cy={114} r={3} fill={PDLCS} opacity="0.8" />

        {/* Cota */}
        <Cota x1={18} x2={82} y={10} label="" />
        <line x1={14} y1={10} x2={14} y2={10} stroke="none" />

        {/* Labels */}
        <text x={25} y={118} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>
        <text x={50} y={118} fontSize={6.5} fill={PDLCS} fontFamily="DM Sans" textAnchor="middle" fontWeight={600}>PDLC</text>
        <text x={75} y={118} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="LIGADO → TRANSPARENTE" desc="Moléculas alinhadas" />
        <Nota x={118} y={64}  titulo="DESLIGADO → OPACO"    desc="Moléculas desordenadas" />
        <Nota x={118} y={92}  titulo="TELA DE PROJEÇÃO"     desc="Estado opaco = retroprojeção" />
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 10. VIDRO PINTADO — Decorativo e Funcional
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaVidroPintado() {
  return (
    <Wrapper title="VIDRO PINTADO" sub="Corte — Face Pintada">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Corte transversal do vidro pintado com camada de tinta na face posterior">
        {/* Vidro */}
        <GlassRect x={20} y={18} w={30} h={84} />
        {/* Camada de tinta (face 2 — posterior) */}
        <rect x={50} y={18} width={10} height={84} fill="#1A4A6A" opacity="0.75" />
        {/* Highlight sutil na tinta */}
        <rect x={50} y={18} width={2}  height={84} fill={WH} opacity="0.1" />

        {/* Label "face 2" */}
        <text x={55} y={14} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">face 2</text>
        <line x1={55} y1={15} x2={55} y2={17} stroke={TM} strokeWidth="0.6" />

        {/* Raio de luz entrando pela frente */}
        <line x1={6}  y1={38} x2={18} y2={50} stroke={WH} strokeWidth="1.2" opacity="0.5" />
        <text x={4}  y={36} fontSize={7} fill={TM} fontFamily="DM Sans">luz</text>
        {/* Passa pelo vidro, reflete na tinta → aparência colorida */}
        <line x1={18} y1={50} x2={50} y2={60} stroke={WH} strokeWidth="0.8" opacity="0.25" />
        <line x1={50} y1={60} x2={20} y2={72} stroke="#3A8ABF" strokeWidth="1" strokeDasharray="2 1.5" opacity="0.7" />
        <text x={6}  y={76} fontSize={7} fill="#3A8ABF" fontFamily="DM Sans" opacity="0.8">cor vista</text>

        {/* Indicação de cores disponíveis (swatches) */}
        {[
          '#1A4A6A', '#2A6A2A', '#6A1A2A', '#4A3A1A', '#4A4A4A'
        ].map((c, i) => (
          <rect key={i} x={20 + i * 7} y={110} width={6} height={6} fill={c} opacity="0.7" rx="1" />
        ))}
        <text x={60} y={116} fontSize={7} fill={TM} fontFamily="DM Sans">cores sob escolha</text>

        {/* Cota */}
        <Cota x1={20} x2={60} y={9} label="espessura" />

        {/* Labels */}
        <text x={35} y={105} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>
        <text x={55} y={105} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">tinta</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="SUPERFÍCIE LISA"      desc="Não porosa, fácil limpeza" />
        <Nota x={118} y={64}  titulo="PALETA LIVRE"         desc="RAL / NCS / Pantone" />
        <Nota x={118} y={92}  titulo="FUNCIONAL E DECO"     desc="Marcenaria, divisórias, niche" />
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 11. VIDRO EXTRA CLEAR — Comparativo Cromático
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaExtraClear() {
  return (
    <Wrapper title="VIDRO EXTRA CLEAR" sub="Comparativo Cromático">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Comparativo visual entre vidro comum com tom verde e vidro extra clear com transparência neutra">
        {/* ── Vidro comum (esquerda) ── */}
        {/* Corpo do vidro */}
        <rect x={15} y={18} width={32} height={84} fill="#BDD4B8" stroke="#8AAA86" strokeWidth="0.6" opacity="0.78" />
        <rect x={15} y={18} width={2}  height={84} fill={WH} opacity="0.25" />
        {/* Tom esverdeado na borda lateral */}
        <rect x={15} y={18} width={5}  height={84} fill="#7BAF70" opacity="0.55" />
        <text x={17} y={14} fontSize={6.5} fill="#4B7A40" fontFamily="DM Sans" textAnchor="middle">tom verde</text>
        <line x1={17} y1={15} x2={17} y2={17} stroke="#4B7A40" strokeWidth="0.6" />

        {/* Transmissão */}
        <text x={31} y={58} fontSize={8} fill="#4B7A40" fontFamily="DM Sans" textAnchor="middle" fontWeight={600}>~88%</text>
        <text x={31} y={68} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">transmissão</text>

        {/* Label */}
        <text x={31} y={116} fontSize={7.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro comum</text>

        {/* ── Divisor ── */}
        <line x1={62} y1={10} x2={62} y2={122} stroke={CS} strokeWidth="0.8" strokeDasharray="3 2" />
        <text x={62} y={8} fontSize={6} fill={TM} fontFamily="DM Sans" textAnchor="middle">vs</text>

        {/* ── Extra Clear (direita) ── */}
        {/* Corpo do vidro — azul muito mais neutro/leve */}
        <rect x={68} y={18} width={32} height={84} fill="#D8EEF8" stroke="#90C4DC" strokeWidth="0.6" opacity="0.8" />
        <rect x={68} y={18} width={2}  height={84} fill={WH} opacity="0.35" />
        {/* Borda neutra/branca */}
        <rect x={68} y={18} width={5}  height={84} fill={WH} opacity="0.55" />
        <text x={70} y={14} fontSize={6.5} fill="#185FA5" fontFamily="DM Sans" textAnchor="middle">neutro</text>
        <line x1={70} y1={15} x2={70} y2={17} stroke="#185FA5" strokeWidth="0.6" />

        {/* Transmissão */}
        <text x={84} y={58} fontSize={8} fill="#185FA5" fontFamily="DM Sans" textAnchor="middle" fontWeight={700}>~92%</text>
        <text x={84} y={68} fontSize={6.5} fill={TM} fontFamily="DM Sans" textAnchor="middle">transmissão</text>

        {/* Label */}
        <text x={84} y={116} fontSize={7.5} fill={R} fontFamily="DM Sans" textAnchor="middle" fontWeight={600}>extra clear</text>

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="BAIXO TEOR DE FERRO"  desc="Matéria-prima mais pura" />
        <Nota x={118} y={64}  titulo="BORDA NEUTRA"         desc="Sem ton verde característico" />
        <Nota x={118} y={92}  titulo="CORES FIÉIS"          desc="Ideal para tampos e expositores" />
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 12. DUPLO + PINÁZIO
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaDuploPinazio() {
  // Câmara: x=30 a x=72 (42px), y=18 a y=102 (84px)
  return (
    <Wrapper title="DUPLO + PINÁZIO" sub="Corte com Grid Interno">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Corte transversal do vidro duplo com pinázio de alumínio decorativo interno">
        {/* Vidro 1 */}
        <GlassRect x={15} y={18} w={12} h={84} />
        {/* Espaçador esquerdo */}
        <rect x={27} y={16} width={4} height={88} fill={SP} opacity="0.72" rx="1" />
        {/* Câmara de ar */}
        <rect x={31} y={18} width={42} height={84} fill={CH} stroke={CS} strokeWidth="0.5" />

        {/* ── Pinázio interno (grid decorativo de alumínio) ── */}
        {/* 2 barras horizontais */}
        <rect x={31} y={45} width={42} height={2.5} fill={SP} opacity="0.65" />
        <rect x={31} y={72} width={42} height={2.5} fill={SP} opacity="0.65" />
        {/* 2 barras verticais */}
        <rect x={44} y={18} width={2.5} height={84} fill={SP} opacity="0.65" />
        <rect x={59} y={18} width={2.5} height={84} fill={SP} opacity="0.65" />

        {/* Espaçador direito */}
        <rect x={73} y={16} width={4} height={88} fill={SP} opacity="0.72" rx="1" />
        {/* Vidro 2 */}
        <GlassRect x={77} y={18} w={12} h={84} />

        {/* Cota câmara */}
        <Cota x1={31} x2={73} y={10} label="6 – 20 mm" />

        {/* Labels */}
        <text x={21}  y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>
        <text x={52}  y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">pinázio (câmara)</text>
        <text x={83}  y={115} fontSize={7} fill={TM} fontFamily="DM Sans" textAnchor="middle">vidro</text>

        {/* Inset: vista frontal do grid */}
        <rect x={10} y={50} width={10} height={10} fill="none" stroke={R} strokeWidth="0.5" strokeDasharray="1.5 1" />
        <text x={15} y={48} fontSize={6} fill={R} fontFamily="DM Sans" textAnchor="middle">↑ front</text>
        {/* Mini grid no inset */}
        <rect x={10} y={50} width={10} height={10} fill={CH} stroke={CS} strokeWidth="0.3" />
        <line x1={13.5} y1={50} x2={13.5} y2={60} stroke={SP} strokeWidth="0.8" opacity="0.7" />
        <line x1={17.0} y1={50} x2={17.0} y2={60} stroke={SP} strokeWidth="0.8" opacity="0.7" />
        <line x1={10}   y1={53.5} x2={20}  y2={53.5} stroke={SP} strokeWidth="0.8" opacity="0.7" />
        <line x1={10}   y1={57.0} x2={20}  y2={57.0} stroke={SP} strokeWidth="0.8" opacity="0.7" />

        {/* Anotações */}
        <Nota x={118} y={36}  titulo="PINÁZIO INTERNO"    desc="Protegido — sem manutenção" />
        <Nota x={118} y={64}  titulo="GRID CUSTOMIZÁVEL"  desc="Diferentes estilos e cores" />
        <Nota x={118} y={92}  titulo="DUPLA FUNÇÃO"       desc="Decoração + isolamento térmico" />
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// 13. GENÉRICO — Fallback para novos produtos
// ═════════════════════════════════════════════════════════════════════════════
export function DiagramaGenerico() {
  return (
    <Wrapper title="DETALHE TÉCNICO" sub="Solução Sob Medida">
      <svg viewBox="0 0 300 132" className="w-full h-auto" aria-label="Diagrama genérico representando painel de vidro">
        {/* Painel de vidro centralizado */}
        <GlassRect x={34} y={12} w={44} h={100} />
        {/* Reflexo principal */}
        <line x1={38} y1={18} x2={44} y2={72} stroke={WH} strokeWidth="2" opacity="0.28" strokeLinecap="round" />
        <line x1={46} y1={14} x2={50} y2={42} stroke={WH} strokeWidth="1.2" opacity="0.18" strokeLinecap="round" />

        {/* Cota largura */}
        <Cota x1={34} x2={78} y={8} label="sob medida" />
        {/* Cota altura */}
        <line x1={28} y1={12}  x2={28} y2={112} stroke={R} strokeWidth="0.7" />
        <line x1={25} y1={12}  x2={31} y2={12}  stroke={R} strokeWidth="0.7" />
        <line x1={25} y1={112} x2={31} y2={112} stroke={R} strokeWidth="0.7" />

        {/* Label central no vidro */}
        <text x={56} y={58} fontSize={8}   fill={TM} fontFamily="Barlow Condensed" fontWeight={600} textAnchor="middle" opacity="0.7">VIDRO</text>
        <text x={56} y={70} fontSize={7}   fill={TM} fontFamily="DM Sans" textAnchor="middle" opacity="0.6">Lajeadense</text>

        {/* Linha vermelha de identidade */}
        <line x1={34} y1={118} x2={78} y2={118} stroke={R} strokeWidth="1.5" opacity="0.6" />

        {/* Anotações */}
        <Nota x={118} y={42}  titulo="QUALIDADE PREMIUM"  desc="Desenvolvimento técnico" />
        <Nota x={118} y={72}  titulo="SOB MEDIDA"         desc="Fabricação personalizada" />
        <Nota x={118} y={100} titulo="ALTO PADRÃO"        desc="Para projetos exigentes" />
      </svg>
    </Wrapper>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Mapa de diagramas por slug do produto
// ─────────────────────────────────────────────────────────────────────────────
// Uso: const Diagrama = DIAGRAMAS[produto.slug] ?? DiagramaGenerico
//      <Diagrama />
// ═════════════════════════════════════════════════════════════════════════════
export const DIAGRAMAS: Record<string, () => React.ReactElement> = {
  'duo-glass':                            DiagramaDuoGlass,
  'duoglass':                             DiagramaDuoGlass,
  'duo-glass-vidro-duplo-termoacustico':  DiagramaDuoGlass,
  'duoglass-vidro-duplo-termoacustico':   DiagramaDuoGlass,
  'wall-glass-guarda-corpo':              DiagramaWallGlass,
  'wallglass-guarda-corpo':               DiagramaWallGlass,
  'fort-glass-multilaminado':             DiagramaFortGlass,
  'fortglass-multilaminado':              DiagramaFortGlass,
  'fort-glass-vidro-multilaminado':       DiagramaFortGlass,
  'fortglass-vidro-multilaminado':        DiagramaFortGlass,
  'habitat-protecao-solar':               DiagramaHabitat,
  'box-banheiro-temperado':               DiagramaBoxTemperado,
  'vidro-laminado':                       DiagramaLaminado,
  'vidro-jumbo':                          DiagramaJumbo,
  'espelhos':                             DiagramaEspelhos,
  'vidro-polarizado':                     DiagramaPolarizado,
  'vidro-pintado':                        DiagramaVidroPintado,
  'vidro-extra-clear':                    DiagramaExtraClear,
  'duplo-pinazio':                        DiagramaDuploPinazio,
}
