// components/sections/PortfolioSection.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiDollarSign, FiBookOpen, FiHome, FiServer, FiMapPin } from 'react-icons/fi';

export default function PortfolioSection() {
  const [filter, setFilter] = useState<'all' | 'mobile' | 'web-sys'>('all');

  const projects = [
    {
      title: 'Clon de Discord',
      category: 'mobile',
      tag: 'Móvil',
      desc: 'Réplica funcional de alta fidelidad para dispositivos móviles. Incluye canales de voz persistentes, mensajería en tiempo real estructurada por servidores y roles dinámicos.',
      techs: ['React Native', 'WebSockets', 'Node.js'],
      icon: <FiMessageSquare className="text-purple-400" />,
    },
    {
      title: 'Aplicación de Ahorro',
      category: 'mobile',
      tag: 'Móvil',
      desc: 'Herramienta intuitiva orientada a la salud financiera personal. Permite a los usuarios definir metas de ahorro, registrar transacciones y visualizar presupuestos automáticos.',
      techs: ['Flutter', 'SQLite', 'Express'],
      icon: <FiDollarSign className="text-amber-400" />,
    },
    {
      title: 'Recomendador de Lectura',
      category: 'mobile',
      tag: 'Móvil',
      desc: 'Plataforma móvil interactiva de lectura que ofrece recomendaciones personalizadas de libros basándose en el historial del lector y sus categorías predilectas.',
      techs: ['React Native', 'Node.js', 'FastAPI'],
      icon: <FiBookOpen className="text-indigo-400" />,
    },
    {
      title: 'Páginas Web para Hoteles',
      category: 'web-sys',
      tag: 'Web',
      desc: 'Sitios web informativos y estéticos de alta conversión para hoteles. Cuentan con galerías de imágenes integradas, mapas interactivos de ubicación y pasarela de pre-reserva.',
      techs: ['React', 'Next.js', 'Tailwind'],
      icon: <FiHome className="text-emerald-400" />,
    },
    {
      title: 'Sistema de Gestión Hotelera (PMS)',
      category: 'web-sys',
      tag: 'Sistemas',
      desc: 'Software ERP especializado para control de hoteles. Automatiza el check-in/out, la gestión de limpieza, asignación de tarifas en tiempo real y facturación electrónica.',
      techs: ['Angular', 'FastAPI', 'PostgreSQL'],
      icon: <FiServer className="text-cyan-400" />,
    },
    {
      title: 'Sistema para Lotificadoras',
      category: 'web-sys',
      tag: 'Sistemas',
      desc: 'Sistema integral para la administración catastral y financiera de venta de terrenos. Gestiona planos interactivos de lotes, contratos de preventa, cuotas y mora.',
      techs: ['React', 'Node.js', 'Express', 'MySQL'],
      icon: <FiMapPin className="text-rose-400" />,
    },
  ];

  const filteredProjects = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="py-24 relative bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-400 font-mono text-sm uppercase tracking-widest font-semibold">
            Portafolio
          </span>
          <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-zinc-100 mt-2 mb-4">
            Historias de Éxito y Proyectos
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Explora una selección de nuestras soluciones desarrolladas, que abarcan desde aplicaciones móviles interactivas hasta sistemas de gestión avanzados.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'mobile', label: 'Aplicaciones Móviles' },
            { id: 'web-sys', label: 'Páginas & Sistemas Web' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                filter === tab.id
                  ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((p) => (
              <motion.div
                key={p.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="glass-card overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header Placeholder */}
                  <div className="h-40 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-center relative p-6">
                    <div className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                      {p.icon}
                    </div>
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-amber-400 border border-zinc-700">
                      {p.tag}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h3 className="font-orbitron font-semibold text-lg text-zinc-100 mb-2">
                      {p.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
                      {p.desc}
                    </p>
                  </div>
                </div>

                {/* Tech Tags Footer */}
                <div className="p-6 pt-0 flex flex-wrap gap-2">
                  {p.techs.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}