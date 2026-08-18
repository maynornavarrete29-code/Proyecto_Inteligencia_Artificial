// components/sections/HeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import { FiCode, FiArrowRight, FiChevronDown } from 'react-icons/fi';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6">
              <FiCode className="text-amber-400" />
              <span>2 Años de Innovación Digital</span>
            </div>

            {/* Title */}
            <h1 className="font-orbitron font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none mb-6">
              Beyond <span className="gradient-purple">code</span>,<br />
              Beyond <span className="gradient-gold">limit</span>.
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed mb-8">
              Somos un grupo de desarrolladores apasionados. Transformamos ideas complejas en sistemas de información elegantes, páginas web de alto impacto y aplicaciones móviles extraordinarias.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#contact"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold hover:shadow-lg hover:shadow-amber-400/25 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Registra tu Proyecto
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#portfolio"
                className="px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold transition-all duration-300 text-center"
              >
                Ver Portafolio
              </a>
            </div>
          </motion.div>

          {/* Right Visual Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
              {/* Glowing Rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/30 to-amber-400/30 animate-pulse blur-2xl" />
              <div className="absolute inset-4 rounded-full border border-purple-500/20 border-dashed animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-12 rounded-full border border-amber-400/30 border-dashed animate-[spin_15s_linear_infinite_reverse]" />
              
              {/* Emblem Card */}
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl flex flex-col items-center justify-center shadow-2xl shadow-purple-950/50 p-6 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-amber-400 p-[2px] mb-4">
                  <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center font-orbitron font-extrabold text-3xl text-amber-400">
                    BD
                  </div>
                </div>
                <span className="font-orbitron text-lg font-bold text-zinc-100 tracking-wider">BeyondDev</span>
                <span className="text-xs text-zinc-400 mt-1">High Tech Solutions</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex justify-center">
          <a
            href="#about"
            className="flex flex-col items-center text-zinc-500 hover:text-amber-400 transition-colors"
            aria-label="Desplazarse hacia abajo"
          >
            <span className="text-xs font-mono uppercase tracking-widest mb-2">Descubre más</span>
            <FiChevronDown className="animate-bounce text-xl" />
          </a>
        </div>
      </div>
    </section>
  );
}