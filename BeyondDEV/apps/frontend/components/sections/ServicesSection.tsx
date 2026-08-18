// components/sections/ServicesSection.tsx
'use client';

import { motion } from 'framer-motion';
import { FiGlobe, FiSmartphone, FiCpu, FiCheck } from 'react-icons/fi';

export default function ServicesSection() {
  const services = [
    {
      icon: <FiGlobe />,
      title: 'Desarrollo Web',
      desc: 'Diseño y construcción de páginas corporativas, plataformas web y portales interactivos ultra rápidos con la mejor experiencia de usuario.',
      items: [
        'Sitios Responsivos y SEO-Optimized',
        'Single Page Applications (SPA)',
        'Portales de Reservaciones y Negocios',
      ],
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <FiSmartphone />,
      title: 'Desarrollo Móvil',
      desc: 'Desarrollo de aplicaciones nativas y multiplataforma robustas y dinámicas para iOS y Android con interfaces fluidas.',
      items: [
        'Aplicaciones Híbridas de Alto Rendimiento',
        'Interfaces de Usuario Intuitivas',
        'Integración Completa con APIs y Sensores',
      ],
      color: 'from-amber-400 to-amber-600',
    },
    {
      icon: <FiCpu />,
      title: 'Sistemas de Gestión',
      desc: 'Modernización e implementación de sistemas de información internos. Ideal para empresas que desean sistematizar operaciones.',
      items: [
        'Control de Inventario y Contratos',
        'Software de Gestión Hotelera (PMS)',
        'Sistemas Inmobiliarios y Lotificadoras',
      ],
      color: 'from-purple-500 to-amber-500',
    },
  ];

  return (
    <section id="services" className="py-24 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-400 font-mono text-sm uppercase tracking-widest font-semibold">
            Nuestros Servicios
          </span>
          <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-zinc-100 mt-2 mb-4">
            Soluciones Tecnológicas a tu Medida
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Ofrecemos un catálogo completo de desarrollo de software diseñado para modernizar y potenciar la productividad de tu organización.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <motion.div
              key={srv.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 flex flex-col justify-between group hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${srv.color} p-[1px] mb-6`}>
                  <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center text-2xl text-amber-400">
                    {srv.icon}
                  </div>
                </div>

                <h3 className="font-orbitron font-semibold text-xl text-zinc-100 mb-3">
                  {srv.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {srv.desc}
                </p>
              </div>

              <ul className="space-y-3 pt-6 border-t border-zinc-800/80">
                {srv.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300">
                    <FiCheck className="text-amber-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}