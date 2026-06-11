'use client'

export function DiagramaGenerico() {
  return (
    <div className="bg-surface-subtle p-space-6 radius-lg border border-border-subtle relative overflow-hidden group">
      <div className="absolute top-space-4 right-space-4 text-right">
        <span className="text-[10px] font-bold text-text-primary uppercase tracking-tighter font-display block">DETALHE TÉCNICO</span>
        <span className="text-[9px] text-text-muted uppercase font-body">Solução Sob Medida</span>
      </div>

      <svg viewBox="0 0 300 120" className="w-full h-auto max-w-[400px]" aria-label="Diagrama Genérico">
        {/* Silhueta Abstrata de Fachada */}
        <rect x="20" y="20" width="40" height="80" fill="#0D0D0D" opacity="0.05" />
        <rect x="70" y="40" width="40" height="60" fill="#0D0D0D" opacity="0.05" />
        <rect x="120" y="10" width="40" height="90" fill="#0D0D0D" opacity="0.05" />
        
        {/* Linhas de Cota Estilizadas */}
        <line x1="20" y1="105" x2="160" y2="105" stroke="#C8102E" strokeWidth="0.5" strokeDasharray="4 4" />
        <circle cx="20" cy="105" r="1.5" fill="#C8102E" />
        <circle cx="160" cy="105" r="1.5" fill="#C8102E" />
        
        <g transform="translate(180, 50)">
          <text x="0" y="0" fontSize="10" fill="#0D0D0D" fontFamily="Barlow Condensed" fontWeight="700" className="uppercase">Qualidade Lajeadense</text>
          <text x="0" y="12" fontSize="8" fill="#4B4B4B" fontFamily="DM Sans">Desenvolvimento técnico</text>
          <text x="0" y="22" fontSize="8" fill="#4B4B4B" fontFamily="DM Sans">e execução de alta precisão.</text>
        </g>
      </svg>
    </div>
  )
}
