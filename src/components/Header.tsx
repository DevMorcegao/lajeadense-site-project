"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Sobre", href: "/sobre-nos" },
  { name: "Produtos", href: "/produtos" },
  { name: "Portfólio", href: "/portfolio" },
  { name: "Contato", href: "/contato" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Executa no mount para capturar a posição inicial do scroll (evita bug ao dar F5 no meio da página)
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Hide header on Sanity Studio routes
  if (pathname?.startsWith('/studio')) return null;

  const isDarkHeroPage = pathname === "/" || pathname === "/produtos" || pathname?.startsWith("/portfolio") || pathname?.startsWith("/contato");
  // The header uses dark text when scrolled, when mobile menu is open, or on pages other than the ones with a dark hero section at the top (since those have light backgrounds)
  const isDarkText = isScrolled || isMobileMenuOpen || !isDarkHeroPage;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.08)] py-4"
            : "bg-transparent py-5 md:py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center">
            <Image
              src="/images/home/lajeadense-logo.webp"
              alt="Lajeadense Vidros"
              width={220}
              height={64}
              priority
              className={`w-auto object-contain transition-all duration-300 ${
                isScrolled ? "h-10 md:h-12" : "h-12 md:h-16"
              } ${isDarkText ? "invert hue-rotate-180" : ""}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`text-sm font-medium transition-colors duration-200 relative group ${
                        isActive
                          ? "text-[#C8102E] font-semibold"
                          : isDarkText
                          ? "text-[#4B4B4B] hover:text-[#C8102E]"
                          : "text-white/80 hover:text-white"
                      }`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {link.name}
                      <span
                        className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[#C8102E] transform origin-left transition-transform duration-300 ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* CTA Button */}
            <Link
              href="/contato"
              className="inline-flex items-center justify-center px-6 py-2 xl:py-2.5 text-sm font-semibold transition-all duration-200"
              style={{
                fontFamily: "var(--font-body)",
                borderRadius: "8px",
                backgroundColor: isDarkText ? "#C8102E" : "#FFFFFF",
                color: isDarkText ? "#FFFFFF" : "#0D0D0D",
                boxShadow: isDarkText ? "0 2px 12px rgba(200,16,46,0.35)" : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkText ? "#A50D25" : "#F5F4F2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDarkText ? "#C8102E" : "#FFFFFF";
              }}
            >
              Solicitar Orçamento
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden relative z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-center">
              <span
                className={`w-full h-[2px] rounded-full transition-all duration-300 origin-left ${
                  isDarkText ? "bg-[#0D0D0D]" : "bg-white"
                } ${isMobileMenuOpen ? "rotate-45 translate-x-[2px] -translate-y-[2px]" : ""}`}
              />
              <span
                className={`w-full h-[2px] rounded-full transition-all duration-300 ${
                  isDarkText ? "bg-[#0D0D0D]" : "bg-white"
                } ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`w-full h-[2px] rounded-full transition-all duration-300 origin-left ${
                  isDarkText ? "bg-[#0D0D0D]" : "bg-white"
                } ${isMobileMenuOpen ? "-rotate-45 translate-x-[2px] translate-y-[2px]" : ""}`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#FFFFFF] flex flex-col pt-24 px-6 pb-12"
          >
            <nav className="flex-1 flex flex-col">
              <ul className="space-y-6">
                {navLinks.map((link) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`block text-3xl font-bold uppercase ${
                        pathname === link.href ? "text-[#C8102E]" : "text-[#0D0D0D]"
                      }`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-auto"
            >
              <Link
                href="/contato"
                className="flex items-center justify-center w-full py-4 text-base font-semibold bg-[#C8102E] text-white rounded-[8px] shadow-[0_2px_12px_rgba(200,16,46,0.35)] hover:bg-[#A50D25] transition-all duration-200"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Solicitar Orçamento
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
