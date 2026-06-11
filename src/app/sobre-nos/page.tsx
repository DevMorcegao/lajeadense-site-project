"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Timeline from "@/components/Timeline";

export default function SobreNos() {
  return (
    <div className="pt-24 md:pt-32 min-h-screen bg-[#F5F4F2] overflow-hidden">
      {/* Hero Section of About Page */}
      <section className="relative px-4 md:px-12 py-16 md:py-24">
        {/* Abstract Architectural SVG Background Element */}
        <div className="absolute inset-0 pointer-events-none opacity-5 scale-150 transform -translate-y-1/4">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="100" x2="100" y2="0" stroke="#0D0D0D" strokeWidth="0.5" />
            <line x1="0" y1="80" x2="100" y2="-20" stroke="#0D0D0D" strokeWidth="0.5" />
            <line x1="0" y1="120" x2="100" y2="20" stroke="#0D0D0D" strokeWidth="0.5" />
            <rect x="20" y="20" width="60" height="60" fill="none" stroke="#0D0D0D" strokeWidth="1" />
          </svg>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-[#C8102E]" />
              <span 
                className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C8102E]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Nossa História
              </span>
              <div className="w-8 h-[2px] bg-[#C8102E]" />
            </div>

            <h1 
              className="text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tight text-[#0D0D0D] mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Do vale do Taquari <br/> para o Brasil
            </h1>
            
            <p 
              className="text-lg md:text-xl text-[#4B4B4B] max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Uma trajetória construída com precisão, segurança e a força de uma empresa familiar que há décadas molda o setor vidreiro do Rio Grande do Sul.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Media and Primary History Text */}
      <section className="relative px-4 md:px-12 py-16 bg-[#FFFFFF]">
        {/* Isometric grid background texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] grayscale"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 15L30 30L0 15L30 0ZM30 30L60 45L30 60L0 45L30 30Z' fill='none' stroke='%230D0D0D' stroke-width='1'/%3E%3Cpath d='M30 0L30 30M0 15L0 45M60 15L60 45' fill='none' stroke='%230D0D0D' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left: GIF and images composition */}
            <motion.div 
              className="relative w-full aspect-square"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Main Animated GIF */}
              <div className="absolute top-0 right-0 w-[80%] h-[80%] z-20 shadow-[0_8px_32px_rgba(0,0,0,0.16)] bg-black/10">
                <Image 
                  src="/images/sobre/lajeadense-vidros-sobre-gif.gif" 
                  alt="Processos da Lajeadense Vidros" 
                  fill 
                  className="object-cover"
                  unoptimized // GIFs should be unoptimized in Next.js
                />
              </div>

              {/* Secondary History Image */}
              <div className="absolute bottom-0 left-0 w-[55%] h-[55%] z-30 shadow-[0_8px_32px_rgba(0,0,0,0.16)] border-[6px] border-[#FFFFFF]">
                <Image 
                  src="/images/sobre/lajeadense-vidros-sobre-img2.webp" 
                  alt="Instalações históricas" 
                  fill 
                  className="object-cover"
                />
              </div>

              {/* Decorative technical lines */}
              <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[1px] bg-[#DDDCDA] z-10" />
              <div className="absolute top-[-8%] left-[20%] w-[1px] h-[40%] bg-[#DDDCDA] z-10" />
            </motion.div>

            {/* Right: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 
                className="text-3xl md:text-4xl font-bold uppercase text-[#0D0D0D] mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                A Força da Nossa <br/> Origem
              </h2>
              
              <div 
                className="space-y-6 text-[#4B4B4B] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <p>
                  Empresa familiar fundada no ano de 1958 na cidade de Lajeado, estado do Rio Grande do Sul, com o nome Vidraçaria Lajeadense Ltda. Durante 36 anos a empresa desenvolveu suas atividades predominantemente no Vale do Taquari e Vale do Rio Pardo.
                </p>
                <p>
                  No ano de 1994, com uma visão estratégica de futuro, foi aberta a filial em Porto Alegre, expandindo os negócios e direcionando o foco da empresa para a área de construção civil. Essa mudança marcou o início de uma nova era de grandes projetos e parcerias com construtoras renomadas.
                </p>
                <p>
                  Os investimentos em uma nova sede em Lajeado, construída em 2002, juntamente com a aquisição de novos maquinários, equipamentos de ponta e novas tecnologias buscadas nas principais feiras da Europa, tem permitido um constante aperfeiçoamento dos produtos e serviços prestados, capacitando nossos funcionários para os desafios modernos.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative px-4 md:px-12 py-24 bg-[#EBEBEA] overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 
              className="text-3xl md:text-5xl font-bold uppercase text-[#0D0D0D]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nossa Trajetória
            </h2>
          </motion.div>

          <Timeline />
        </div>
      </section>
    </div>
  );
}
