// components/sections/TechSection.tsx
'use client';

import { motion } from 'framer-motion';
import {
  SiFastapi,
  SiExpress,
  SiNodedotjs,
  SiAngular,
  SiReact,
  SiFlutter,
  SiNextdotjs,
} from 'react-icons/si';

export default function TechSection() {
  const techs = [
    { name: 'FastAPI', type: 'Backend', icon: <SiFastapi className="text-emerald-400" /> },
    { name: 'Express', type: 'Backend', icon: <SiExpress className="text-zinc-300" /> },
    { name: 'Node.js', type: 'Backend', icon: <SiNodedotjs className="text-green-500" /> },
    { name: 'Angular', type: 'Frontend', icon: <SiAngular className="text-red-500" /> },
    { name: 'React', type: 'Frontend', icon: <SiReact className="text-cyan-400" /> },
    { name: 'React Native', type: 'Mobile', icon: <SiReact className="text-cyan-400" /> },
    { name: 'Flutter', type: 'Mobile', icon: <SiFlutter className="text-sky-400" /> },
    { name: 'Next.js', type: 'Fullstack', icon: <SiNextdotjs className="text-white" /> },
  ];

  return (
    <section id="tech" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-400 font-mono text-sm uppercase tracking-widest font-semibold">
            Tecnologías Estándar
          </span>
          <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-zinc-100 mt-2 mb-4">
            El Tech-Stack que Impulsa tus Ideas
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Utilizamos los frameworks y lenguajes más solicitados y estables del ecosistema actual para garantizar un software mantenible y rápido.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {techs.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-6 flex flex-col items-center justify-center text-center group hover:border-amber-400/50 transition-colors"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {t.icon}
              </div>
              <h4 className="font-orbitron font-semibold text-zinc-200 text-sm sm:text-base">
                {t.name}
              </h4>
              <span className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide bg-zinc-800 text-zinc-400 border border-zinc-700">
                {t.type}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}