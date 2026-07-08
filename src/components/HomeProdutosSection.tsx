"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Thermometer, Shield, Palette, Maximize, Plus } from "lucide-react";
import { urlFor } from "@/lib/sanity";

const categories = [
  {
    id: 1,
    title: "Conforto",
    description: "Isolamento acústico e térmico de alta performance. Destaque para a tecnologia Duoglass (vidros duplos), além de outras soluções termoacústicas sob medida para o bem-estar do seu ambiente.",
    tag: "Conforto",
    image: "/images/sobre/lajeadense-vidros-sobre-img1.webp",
    link: "/produtos?categoria=conforto",
    icon: Thermometer,
  },
  {
    id: 2,
    title: "Segurança",
    description: "Vidros de alta resistência para proteção ativa. Portfólio completo de temperados, laminados de segurança e multilaminados Fortglass para guarda-corpos e divisórias.",
    tag: "Segurança",
    image: "/images/sobre/lajeadense-vidros-sobre-img2.webp",
    link: "/produtos?categoria=seguranca",
    icon: Shield,
  },
  {
    id: 3,
    title: "Estética",
    description: "Design contemporâneo, reflexão e sofisticação para interiores. Espelhos lapidados de alta definição e vidros decorativos para compor ambientes modernos e sofisticados.",
    tag: "Estética",
    image: "/images/sobre/lajeadense-vidros-sobre-img3.webp",
    link: "/produtos?categoria=estetica",
    icon: Palette,
  },
  {
    id: 4,
    title: "Amplitude",
    description: "Monumentalidade e integração visual máxima. Sistemas de peles de vidro, fachadas estruturais de alta performance e grandes vãos para maximizar a iluminação natural.",
    tag: "Amplitude",
    image: "/images/sobre/lajeadense-vidros-sobre-img4.webp",
    link: "/produtos?categoria=amplitude",
    icon: Maximize,
  },
];

interface HomeProdutosSectionProps {
  homeImages?: any;
}

export default function HomeProdutosSection({ homeImages }: HomeProdutosSectionProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const resolvedCategories = categories.map(cat => {
    let resolvedImage = cat.image;
    if (homeImages) {
      if (cat.id === 1 && homeImages.imagemCategoriaConforto) {
        resolvedImage = urlFor(homeImages.imagemCategoriaConforto).width(800).height(500).url();
      } else if (cat.id === 2 && homeImages.imagemCategoriaSeguranca) {
        resolvedImage = urlFor(homeImages.imagemCategoriaSeguranca).width(800).height(500).url();
      } else if (cat.id === 3 && homeImages.imagemCategoriaEstetica) {
        resolvedImage = urlFor(homeImages.imagemCategoriaEstetica).width(800).height(500).url();
      } else if (cat.id === 4 && homeImages.imagemCategoriaAmplitude) {
        resolvedImage = urlFor(homeImages.imagemCategoriaAmplitude).width(800).height(500).url();
      }
    }
    return { ...cat, image: resolvedImage };
  });

  return (
    <section className="relative w-full py-24 md:py-32 bg-[#EBEBEA] overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 relative z-10">
        
        {/* Header da Seção */}
        <motion.div
          className="flex flex-col items-center md:items-start text-center md:text-left mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-[#C8102E]" />
            <span 
              className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C8102E]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Nossos Produtos
            </span>
          </div>
          
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-[1.1] text-[#0D0D0D] max-w-2xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Soluções em vidro para <br className="hidden md:block"/>cada projeto
          </h2>
        </motion.div>

        {/* Grid de Categorias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4 xl:gap-6">
          {resolvedCategories.map((category, index) => {
            const isHovered = hoveredId === category.id;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col bg-[#FFFFFF] border border-[#EBEBEA] lg:border-none lg:bg-transparent shadow-sm lg:shadow-none overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Imagem Fotográfica Base com Link (Clicável) */}
                <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-none">
                  <Link href={category.link} className="absolute inset-0 z-30">
                    <span className="sr-only">Ver produtos da categoria {category.title}</span>
                  </Link>

                  {/* Imagem com zoom no hover */}
                  <Image 
                    src={category.image}
                    alt={`Imagem representativa da categoria ${category.title}`}
                    fill
                    className="object-cover"
                    style={{
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={85}
                  />

                  {/* === MÓDULO DESKTOP === */}

                  {/* Barra inferior flutuante padrão (Desktop) — desliza para baixo no hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 hidden lg:flex items-center justify-between px-6 py-4 border-t border-[#EBEBEA] z-10"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.97)',
                      backdropFilter: 'blur(4px)',
                      transform: isHovered ? 'translateY(100%)' : 'translateY(0)',
                      transition: 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon size={20} strokeWidth={1.5} style={{ color: '#C8102E' }} />
                      <span 
                        className="text-xl font-bold uppercase tracking-wide"
                        style={{ fontFamily: 'var(--font-display)', color: '#0D0D0D' }}
                      >
                        {category.title}
                      </span>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: '#F0EFED', color: '#C8102E' }}>
                      <Plus size={16} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Overlay escuro — slide-up no hover (Desktop) */}
                  <div
                    className="absolute inset-0 hidden lg:flex flex-col justify-end p-6 xl:p-10 pointer-events-none z-10"
                    style={{
                      backgroundColor: 'rgba(13,13,13,0.95)',
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(16px)',
                      transition: 'opacity 450ms ease, transform 450ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Conteúdo Revelado */}
                    <div
                      className="relative z-10 flex flex-col items-start gap-3 xl:gap-4"
                      style={{
                        transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1) 50ms',
                      }}
                    >
                      <span 
                        className="text-white text-[10px] font-semibold px-3 py-1 tracking-wider uppercase"
                        style={{ fontFamily: 'var(--font-body)', backgroundColor: '#C8102E', borderRadius: '4px' }}
                      >
                        {category.tag}
                      </span>

                      {/* Linha separadora semântica — entre tag e título */}
                      <div className="w-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" style={{ opacity: 0.5 }}></div>
                        <div className="flex-1 h-[1px] bg-white" style={{ opacity: 0.15 }}></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full" style={{ opacity: 0.5 }}></div>
                      </div>

                      <div>
                        <h3 
                          className="text-white text-2xl xl:text-4xl font-bold uppercase tracking-tight"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {category.title}
                        </h3>
                        <p 
                          className="text-xs xl:text-sm leading-relaxed mt-1.5 xl:mt-2 max-w-xl"
                          style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.8)' }}
                        >
                          {category.description}
                        </p>
                      </div>
                      
                      {/* CTA no Hover */}
                      <div
                        className="flex items-center gap-2 mt-1 text-white font-semibold text-sm"
                        style={{
                          color: isHovered ? '#C8102E' : '#FFFFFF',
                          transition: 'color 300ms ease',
                        }}
                      >
                        <span>Descobrir Linha</span>
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          style={{
                            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                            transition: 'transform 300ms ease',
                          }}
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* === MÓDULO MOBILE (Título sobre a foto) === */}
                  <div className="absolute bottom-0 left-0 right-0 lg:hidden flex items-center gap-2.5 px-5 py-3 border-t border-white/10 z-10"
                    style={{ backgroundColor: 'rgba(13,13,13,0.75)', backdropFilter: 'blur(4px)' }}
                  >
                    <category.icon size={18} strokeWidth={1.5} className="text-white" />
                    <span 
                      className="text-lg font-bold uppercase text-white tracking-wide"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {category.title}
                    </span>
                  </div>
                </div>

                {/* === MÓDULO MOBILE (Descrição abaixo da foto) === */}
                <div className="p-5 flex flex-col lg:hidden flex-grow bg-[#FFFFFF]">
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: 'var(--font-body)', color: '#4B4B4B' }}
                  >
                    {category.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-[#EBEBEA] flex justify-end">
                    <Link 
                      href={category.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-body)', color: '#C8102E' }}
                    >
                      <span>Conhecer Categoria</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 lg:mt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/produtos"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold transition-colors duration-200"
              style={{ 
                backgroundColor: '#0D0D0D', 
                color: '#FFFFFF',
                borderRadius: '8px',
                fontFamily: 'var(--font-body)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1F1F1F'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0D0D0D'; }}
            >
              Conheça Nossa Linha Completa
              <span className="ml-3">→</span>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
