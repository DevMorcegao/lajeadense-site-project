"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Tenta forçar o play programaticamente para garantir funcionamento no mobile
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay impedido pelo navegador/dispositivo:", error);
        });
      }
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Local Video Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" /> {/* Dark overlay to hide initial UI flashes and improve text readability */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover opacity-80"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          <source src="/videos/hero-bg.webm" type="video/webm" />
          Seu navegador não suporta vídeos HTML5.
        </video>
      </div>

      {/* Gradient Overlay — bottom-up, only lower portion */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0 pointer-events-none" />

      {/* Hero Content — aligned bottom-left */}
      <div className="absolute bottom-32 md:bottom-28 lg:bottom-24 xl:bottom-20 left-4 md:left-16 z-10 max-w-2xl w-[calc(100%-2rem)] md:w-auto">
        {/* Section label */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            className="w-8 h-[2px]"
            style={{ backgroundColor: "#C8102E" }}
          />
          <span
            className="text-xs font-semibold tracking-[0.15em] uppercase"
            style={{
              color: "#C8102E",
              fontFamily: "var(--font-body)",
            }}
          >
            Desde 1958
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-[1.1] tracking-tight mb-4"
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-display)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Soluções em vidro
          <br />
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            há mais de 60 anos
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-sm sm:text-base md:text-lg max-w-md mb-8"
          style={{
            color: "rgba(255,255,255,0.75)",
            fontFamily: "var(--font-body)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Segurança, conforto e tecnologia para o seu projeto. Empresa
          familiar referência no setor vidreiro do Rio Grande do Sul.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <a
            href="/contato"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition-all duration-200"
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
            Solicitar Orçamento
          </a>
          <Link
            href="/produtos"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold border transition-all duration-200"
            style={{
              color: "#FFFFFF",
              borderColor: "rgba(255,255,255,0.4)",
              borderRadius: "8px",
              backgroundColor: "transparent",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
          >
            Conheça Nossos Produtos
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className="w-[1px] h-8"
          style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "var(--font-body)",
          }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
