// apps/frontend/components/sections/AboutSection.tsx
'use client';

import { motion } from 'framer-motion';
import { FiMonitor, FiLayers, FiCheckCircle } from 'react-icons/fi'; // <-- Cambiado FiLaptop por FiMonitor

export default function AboutSection() {
  const stats = [
    { value: '2+', label: 'Años de Exp.' },
    { value: '12+', label: 'Proyectos de Éxito' },
    { value: '100%', label: 'Calidad de Código' },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-400 font-mono text-sm uppercase tracking-widest font-semibold">
            ¿Quiénes Somos?
          </span>
          <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-zinc-100 mt-2 mb-4">
            Impulsando el Futuro de las Empresas
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Combinamos experiencia técnica, metodologías ágiles y un diseño centrado en el usuario para crear soluciones tecnológicas sólidas.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Trayectoria Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 glass-card p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-orbitron font-semibold text-2xl text-amber-400 mb-4">
                Nuestra Trayectoria
              </h3>
              <p className="text-zinc-300 leading-relaxed text-base sm:text-lg mb-8">
                Durante los últimos <strong>2 años</strong>, en BeyondDev nos hemos consolidado como un equipo dinámico de desarrolladores frontend y backend comprometidos con la excelencia. Nos apasiona llevar los límites del código más allá de lo convencional, adaptando tecnologías modernas para resolver problemas reales de negocio.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="font-orbitron font-extrabold text-2xl sm:text-3xl text-zinc-100">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-zinc-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Perks Grid */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 flex items-start gap-4"
            >
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 text-2xl border border-purple-500/20 shrink-0">
                <FiMonitor /> {/* <-- Ícono actualizado */}
              </div>
              <div>
                <h4 className="font-orbitron font-semibold text-lg text-zinc-100 mb-1">
                  Desarrollo Full-Stack
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Dominio absoluto de tecnologías frontend y backend, garantizando que el diseño y el rendimiento trabajen en perfecta armonía.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 flex items-start gap-4"
            >
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 text-2xl border border-amber-500/20 shrink-0">
                <FiLayers />
              </div>
              <div>
                <h4 className="font-orbitron font-semibold text-lg text-zinc-100 mb-1">
                  Arquitecturas Modernas
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Sistemas modulares, escalables y seguros preparados para crecer junto con tu modelo de negocio.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}