"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const timelineData = [
  {
    year: "1958",
    title: "Fundação da Lajeadense Vidros",
    description:
      "Fundada no centro da cidade de Lajeado – focada para ser uma vidraçaria que atendesse a comunidade Lajeadense.",
    image: null,
  },
  {
    year: "1988",
    title: "Parceria com a Blindex",
    description: "Inicia uma parceria com a empresa Blindex e instalações de boxes.",
    image: null,
  },
  {
    year: "1994",
    title: "Filial em Porto Alegre",
    description: "Abertura da filial em Porto Alegre, expandindo os negócios e direcionando o foco da empresa para a área de construção civil.",
    image: null,
  },
  {
    year: "2002",
    title: "Nova Sede",
    description: "Nova sede na cidade de Lajeado – ampliando o ambiente de trabalho e a produção com novos maquinários, equipamentos e novas tecnologias buscadas nas principais feiras da Europa.",
    image: "/images/sobre/lajeadense-vidros-sobre-img3.webp", // Representing the larger building/HQ
  },
  {
    year: "2008",
    title: "Duoglass",
    description: "Ampliação de produtos – cria-se a Duoglass – marca de vidros duplos da Lajeadense vidros.",
    image: null,
  },
  {
    year: "2017",
    title: "Ampliação Fabril",
    description: "Construção de mais um pavilhão para aumentar a produtividade da empresa.",
    image: "/images/sobre/lajeadense-vidros-sobre-img1.webp", // Factory floor or external
  },
  {
    year: "2018",
    title: "Vidros Jumbo",
    description: "Entrada de vidros jumbos para comercialização.",
    image: "/images/sobre/lajeadense-vidros-sobre-img6.webp", // Jumbo glass handling
  },
  {
    year: "2022",
    title: "Novas Estratégias",
    description: "Buscamos criar estratégias inovadoras e trazer produtos que garantem a segurança e a qualidade de vida de nossos clientes.",
    image: null,
  },
  {
    year: "2026",
    title: "Visão de Futuro",
    description: "Continuamos expandindo horizontes, inspirando o crescimento e a inovação no setor vidreiro para as próximas décadas.",
    image: null,
  },
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end 80%"],
  });

  // Scale the center line based on scroll progress
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative w-full py-16">
      {/* Central Line Background */}
      <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#DDDCDA] -translate-x-1/2" />

      {/* Central Line Animated Fill */}
      <motion.div
        className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#C8102E] -translate-x-1/2 origin-top"
        style={{ scaleY: lineScale }}
      />

      <div className="flex flex-col gap-12 md:gap-24 relative z-10 w-full overflow-hidden px-4 md:px-0">
        {timelineData.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={item.year}
              className={`flex flex-col md:flex-row items-start md:items-center w-full min-h-[160px] ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Year and Connection Point */}
              <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 flex items-center justify-center -mt-2 md:mt-0 z-20">
                <motion.div
                  className="flex items-center justify-center w-4 h-4 rounded-full border-[3px] border-[#C8102E] bg-[#FFFFFF] shadow-[0_0_0_4px_#F5F4F2] overflow-hidden"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div 
                    className="w-full h-full bg-[#C8102E]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-50% 0px -40% 0px" }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </div>

              {/* Content Panel */}
              <motion.div
                className={`w-full md:w-1/2 pl-12 md:px-12 flex flex-col ${
                  isEven ? "md:items-end md:text-right" : "md:items-start md:text-left"
                }`}
                initial={{ opacity: 0, x: isEven ? -40 : 40, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div 
                  className="text-3xl md:text-5xl font-bold text-[#0D0D0D] mb-2 tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.year}
                </div>
                <h3 
                  className="text-xl md:text-2xl font-semibold text-[#C8102E] mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-base text-[#4B4B4B] w-full max-w-[400px] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.description}
                </p>
                
                {/* Optional Image for specific milestones */}
                {item.image && (
                  <motion.div 
                    className="mt-6 relative w-full max-w-[400px] aspect-[4/3] rounded-none overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-[4px] border-white"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </motion.div>
                )}
              </motion.div>

              {/* Empty space for the other half on desktop */}
              <div className="hidden md:block md:w-1/2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
