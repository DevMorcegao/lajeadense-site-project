"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

interface VideoCard {
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  posterUrl: string; // Imagem estática enquanto o vídeo não carrega
}

const videosData: VideoCard[] = [
  {
    title: "Vidro Jumbo",
    subtitle: "Amplitude Monumental",
    description: "Grandes dimensões para projetos que desafiam os limites da arquitetura e da integração visual.",
    videoUrl: "/videos/jumbo.webm",
    posterUrl: "/images/produtos/vidro-jumbo.webp",
  },
  {
    title: "Wallglass",
    subtitle: "Guarda-corpo Autoportante",
    description: "Segurança estrutural extrema com design minimalista de fixação oculta, testado rigorosamente.",
    videoUrl: "/videos/wall-glass.webm",
    posterUrl: "/images/produtos/wall-glass-guarda-corpo.webp",
  },
];

export default function HomeVideosSection() {
  const [activeVideo, setActiveVideo] = useState<VideoCard | null>(null);

  return (
    <section className="relative w-full py-24 md:py-32 bg-[#0D0D0D] text-white overflow-hidden border-t border-white/5">
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
              style={{ fontFamily: "var(--font-body)" }}
            >
              Tecnologia em Ação
            </span>
          </div>
          
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-[1.1] text-white max-w-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Soluções Técnicas em Movimento
          </h2>
          <p
            className="text-sm md:text-base text-white/60 leading-relaxed mt-4 max-w-xl font-body"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Veja o desempenho excepcional e a aplicação prática de nossos principais produtos em ambientes reais.
          </p>
        </motion.div>

        {/* Grid dos Cards de Vídeo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {videosData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveVideo(item)}
              className="group relative aspect-[16/9] rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-white/5 cursor-pointer bg-black"
            >
              {/* Vídeo em Background Autoplay Muted */}
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={item.posterUrl}
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              >
                <source src={item.videoUrl} type="video/webm" />
              </video>

              {/* Gradiente Escuro de Sobreposição */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-300 group-hover:from-black/95" />

              {/* Botão de Play Central (Visível no Hover no Desktop, Sempre Visível no Mobile) */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 transform scale-90 opacity-80 group-hover:scale-100 group-hover:opacity-100 group-hover:bg-[#C8102E] group-hover:border-transparent group-hover:shadow-[0_0_20px_rgba(200,16,46,0.5)]">
                  <Play size={24} className="ml-1 fill-white" />
                </div>
              </div>

              {/* Conteúdo de Texto do Card */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#C8102E] uppercase tracking-wider font-body">
                  {item.title}
                </span>
                <h3 
                  className="text-white text-2xl font-bold uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.subtitle}
                </h3>
                <p 
                  className="text-xs text-white/70 leading-relaxed font-body max-w-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox / Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center text-white transition-colors duration-200 cursor-pointer z-[110]"
            >
              <X size={20} />
            </button>

            {/* Container do Player */}
            <div 
              className="w-full max-w-5xl aspect-[16/9] relative rounded-2xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.8)] bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                autoPlay
                controls
                playsInline
                className="w-full h-full object-contain"
              >
                <source src={activeVideo.videoUrl} type="video/webm" />
              </video>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
