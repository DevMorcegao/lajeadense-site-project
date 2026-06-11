"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HomeAboutSection() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-[#F5F4F2] overflow-hidden">
      {/* Decorative Isometric Grid Background (Subtle) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] grayscale pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 15L30 30L0 15L30 0ZM30 30L60 45L30 60L0 45L30 30Z' fill='none' stroke='%230D0D0D' stroke-width='1'/%3E%3Cpath d='M30 0L30 30M0 15L0 45M60 15L60 45' fill='none' stroke='%230D0D0D' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-x-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[2px] bg-[#C8102E]" />
                <span 
                  className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C8102E]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Quem Somos
                </span>
              </div>

              <h2 
                className="text-4xl md:text-5xl font-bold uppercase leading-[1.1] text-[#0D0D0D] mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Tradição e <br/> Tecnologia
              </h2>

              <p 
                className="text-base text-[#4B4B4B] mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Empresa familiar fundada em 1958 na cidade de Lajeado, estado do Rio Grande do Sul. 
                Durante mais de seis décadas, aperfeiçoamos a arte de trabalhar com vidro, aliando técnicas 
                tradicionais às mais modernas tecnologias do mercado europeu.
              </p>

              <Link 
                href="/sobre-nos"
                className="inline-flex items-center text-sm font-semibold text-[#0D0D0D] transition-colors hover:text-[#C8102E] group"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <span className="border-b border-[#0D0D0D] group-hover:border-[#C8102E] pb-1 transition-colors">
                  Conheça nossa história completa
                </span>
                <span className="ml-2 transition-transform transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Prominent Image */}
          <div className="md:col-span-7 mt-8 md:mt-0 relative">
            <motion.div
              className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-none shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* As an introductory image, we'll use one of the About images */}
              <Image 
                src="/images/home/lajeadense-vidros-sobre-img6.webp" 
                alt="Instalações e projetos da Lajeadense Vidros"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                quality={90}
              />

              {/* Architectural accent */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/40 m-4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white/40 m-4 pointer-events-none" />
            </motion.div>

            {/* Floating Metric Badge */}
            <motion.div
              className="absolute -bottom-6 -left-6 md:-left-12 bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.16)] rounded-none z-20 border-t-[3px] border-[#C8102E]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div 
                className="text-4xl lg:text-5xl font-bold text-[#0D0D0D]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                +60
              </div>
              <div 
                className="text-sm font-medium text-[#4B4B4B]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                ANOS DE HISTÓRIA
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
