"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const items = [
  {
    title: "Duoglass",
    subtitle: "Vidro Duplo Termoacústico",
    description: "Máximo isolamento térmico e acústico para esquadrias de alto padrão.",
    image: "/images/produtos/duo-glass-vidro-duplo-termoacustico.webp",
    link: "/portfolio",
  },
  {
    title: "Wallglass",
    subtitle: "Guarda-corpo Minimalista",
    description: "Transparência autoportante e máxima segurança certificada ABNT.",
    image: "/images/produtos/wall-glass-guarda-corpo.webp",
    link: "/portfolio",
  },
  {
    title: "Vidro Habitat",
    subtitle: "Proteção Solar Inteligente",
    description: "Bloqueio inteligente de calor e raios UV para máximo conforto térmico residencial.",
    image: "/images/produtos/vidro-habitat.webp",
    link: "/portfolio",
  },
  {
    title: "Vidro Jumbo",
    subtitle: "Grandes Vãos de Vidro",
    description: "Soluções monumentais para fachadas que valorizam a amplitude e a luz.",
    image: "/images/produtos/vidro-jumbo.webp",
    link: "/portfolio",
  },
  {
    title: "Espelhos Premium",
    subtitle: "Espelhos Lapidados e Bisotados",
    description: "Reflexos perfeitos e acabamentos refinados para interiores de alto padrão.",
    image: "/images/produtos/espelhos.webp",
    link: "/portfolio",
  },
];

export default function HomePortfolioSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleColumnClick = (index: number, e: React.MouseEvent) => {
    // No desktop, se já estiver expandida (travada), permite navegar no clique
    if (window.innerWidth > 768) {
      if (expandedIndex === index) {
        return; // permite navegar pelo link
      }
      e.preventDefault();
      setExpandedIndex(index);
    } else {
      // No mobile/tablet (tap-to-expand), o primeiro toque expande, o segundo navega
      if (expandedIndex === index) {
        return; // permite navegar
      }
      e.preventDefault();
      setExpandedIndex(index);
    }
  };

  return (
    <section className="relative w-full py-24 md:py-32 bg-[#0D0D0D] overflow-hidden text-white border-t border-white/5">
      <style dangerouslySetInnerHTML={{ __html: `
        .expanding-gallery-container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
        }

        .gallery-wrapper {
          display: flex;
          gap: 16px;
          height: 480px;
          overflow: hidden;
        }

        .gallery-column {
          flex: 1;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          transition: flex 1s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          background-color: #1A1A1A;
          border: 1px border-white/5;
        }

        .gallery-column .gallery-link {
          display: block;
          width: 100%;
          height: 100%;
          position: relative;
          text-decoration: none;
          overflow: hidden;
        }

        .gallery-column img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 1s ease, filter 1s ease;
        }

        .gallery-column:hover img {
          transform: scale(1.1);
        }

        .gallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%);
          padding: 40px 24px 30px 24px;
          transform: translateY(10px);
          opacity: 0;
          transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease-out;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .gallery-wrapper:hover .gallery-column {
          flex: 0.5;
        }

        .gallery-wrapper .gallery-column:hover {
          flex: 4;
        }

        .gallery-column:hover .gallery-overlay {
          transform: translateY(0);
          opacity: 1;
        }

        /* Click to lock expansion on desktop */
        .gallery-column.expanded {
          flex: 4 !important;
        }

        .gallery-wrapper.has-expanded .gallery-column:not(.expanded):not(:hover) {
          flex: 0.5;
        }

        .gallery-column.expanded .gallery-overlay {
          transform: translateY(0);
          opacity: 1;
        }

        /* Responsive design - vertical columns on mobile */
        @media (max-width: 768px) {
          .gallery-wrapper {
            flex-direction: column;
            height: auto;
            gap: 12px;
          }

          .gallery-wrapper:hover .gallery-column {
            flex: none;
          }

          .gallery-wrapper .gallery-column:hover {
            flex: none;
          }

          .gallery-column {
            height: 100px;
            flex: none !important;
            transition: height 600ms cubic-bezier(0.16, 1, 0.3, 1);
          }

          .gallery-column.expanded {
            height: 280px;
          }

          .gallery-column .gallery-overlay {
            transform: translateY(10px);
            opacity: 0;
            padding: 24px 16px;
          }

          .gallery-column.expanded .gallery-overlay {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}} />

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        {/* Header da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-[#C8102E]" />
              <span
                className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C8102E]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Portfólio & Obras
              </span>
            </div>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-[1.1] text-white max-w-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Nossa tecnologia aplicada em arquitetura
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="shrink-0"
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center text-sm font-semibold text-white/70 hover:text-white transition-colors group"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span className="border-b border-white/20 group-hover:border-white/80 pb-1 transition-colors">
                Ver galeria completa de obras
              </span>
              <span className="ml-2 transition-transform transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Desktop Layout (Expanding Gallery) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="expanding-gallery-container hidden md:block"
        >
          <div
            className={`gallery-wrapper ${
              expandedIndex !== null ? "has-expanded" : ""
            }`}
          >
            {items.map((item, index) => {
              const isExpanded = expandedIndex === index;

              return (
                <div
                  key={index}
                  onClick={(e) => handleColumnClick(index, e)}
                  className={`gallery-column ${isExpanded ? "expanded" : ""}`}
                >
                  <Link href={item.link} className="gallery-link">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="30vw"
                      className="object-cover"
                      quality={85}
                    />

                    <div className="gallery-overlay">
                      <span
                        className="text-[10px] font-bold text-[#C8102E] uppercase tracking-wider font-body self-start"
                      >
                        {item.title}
                      </span>
                      <h3
                        className="text-white text-xl md:text-2xl font-bold uppercase tracking-tight"
                        style={{
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {item.subtitle}
                      </h3>
                      <p
                        className="text-xs md:text-sm text-white/70 leading-relaxed font-body"
                        style={{
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile Layout (Static Cards List) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 md:hidden"
        >
          {items.map((item, index) => (
            <div 
              key={index}
              className="bg-[#141414] border border-white/5 overflow-hidden rounded-2xl flex flex-col"
            >
              <div className="relative h-[220px] w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  quality={85}
                />
              </div>
              <div className="p-6 flex flex-col gap-3">
                <span className="text-[10px] font-bold text-[#C8102E] uppercase tracking-wider font-body">
                  {item.title}
                </span>
                <h3 
                  className="text-white text-xl font-bold uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.subtitle}
                </h3>
                <p 
                  className="text-xs text-white/70 leading-relaxed font-body"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.description}
                </p>
                <div className="mt-2 pt-3 border-t border-white/10 flex justify-end">
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C8102E] font-body"
                  >
                    <span>Visualizar no Portfólio</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
