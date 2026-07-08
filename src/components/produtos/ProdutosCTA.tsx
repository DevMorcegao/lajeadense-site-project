'use client'

import Link from 'next/link'

export function ProdutosCTA() {
  return (
    <section className="py-20 bg-surface-section px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 font-display uppercase">Precisa de uma solução em vidros?</h2>
        <p className="text-text-secondary mb-8 font-body">
          Nossa equipe está pronta para analisar seu projeto e indicar a melhor solução, com qualidade, segurança e atendimento especializado.
        </p>
        <Link 
          href="/contato" 
          className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold uppercase tracking-wide transition-all duration-200"
          style={{
            backgroundColor: "#C8102E",
            color: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(200,16,46,0.35)",
            fontFamily: "var(--font-body)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#A50D25";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#C8102E";
          }}
        >
          Fale com nossa equipe
        </Link>
      </div>
    </section>
  )
}
