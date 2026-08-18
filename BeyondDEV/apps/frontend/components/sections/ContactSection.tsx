// components/sections/ContactSection.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPhone, FiMail, FiClock, FiSend, FiCheckCircle, FiLoader } from 'react-icons/fi';

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Opcional: Enviar al backend de FastAPI
      // await fetch('/api/v1/contact', { method: 'POST', body: JSON.stringify(formData) });
      await new Promise((res) => setTimeout(res, 1200)); // Simulación rápida
      setShowModal(true);
      setFormData({ name: '', email: '', phone: '', company: '', projectType: '', description: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Panel */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-amber-400 font-mono text-sm uppercase tracking-widest font-semibold">
                Hablemos de tu Proyecto
              </span>
              <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-zinc-100 mt-2 mb-4">
                ¿Listo para dar el siguiente paso?
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed">
                Completa el formulario de registro de proyecto para agendar una sesión de asesoría tecnológica gratuita con nuestro equipo. Analizaremos tu idea y estructuraremos una propuesta.
              </p>
            </div>

            {/* Details List */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="p-3 rounded-lg bg-amber-400/10 text-amber-400 text-xl">
                  <FiPhone />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-mono uppercase">Llámanos o escríbenos:</div>
                  <a href="tel:97242842" className="text-zinc-100 font-bold hover:text-amber-400">
                    +504 9724-2842
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="p-3 rounded-lg bg-purple-400/10 text-purple-400 text-xl">
                  <FiMail />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-mono uppercase">Correo electrónico:</div>
                  <a href="mailto:info@beyonddev.com" className="text-zinc-100 font-bold hover:text-amber-400">
                    info@beyonddev.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="p-3 rounded-lg bg-indigo-400/10 text-indigo-400 text-xl">
                  <FiClock />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-mono uppercase">Horario de Atención:</div>
                  <div className="text-zinc-200 text-sm font-medium">Lunes a Viernes (8:00 AM - 6:00 PM)</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 text-zinc-400 text-sm italic">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-orbitron font-bold text-xs">
                BD
              </div>
              <span>Beyond code, Beyond limit.</span>
            </div>
          </div>

          {/* Form Panel */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-10">
            <h3 className="font-orbitron font-bold text-2xl text-zinc-100 mb-2">
              Registrar Nuevo Proyecto
            </h3>
            <p className="text-zinc-400 text-sm mb-8">
              Cuéntanos brevemente qué necesitas y te responderemos en menos de 24 horas hábiles.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-300 mb-2">
                  Tu Nombre <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carlos Mendoza"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 mb-2">
                    Correo Electrónico <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 mb-2">
                    Teléfono <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 97242842"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 mb-2">Empresa / Organización</label>
                  <input
                    type="text"
                    placeholder="Nombre de tu empresa"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 mb-2">
                    Tipo de Proyecto <span className="text-amber-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="web">Desarrollo Web (Página / Portal)</option>
                    <option value="mobile">Aplicación Móvil (Android / iOS)</option>
                    <option value="system">Sistema de Gestión / Control Interno</option>
                    <option value="modernization">Modernización de Sistema Existente</option>
                    <option value="other">Otro Requerimiento Tecnológico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-300 mb-2">
                  Cuéntanos sobre tu idea <span className="text-amber-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe brevemente las funcionalidades principales que necesitas..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin text-lg" /> Procesando...
                  </>
                ) : (
                  <>
                    Enviar Registro <FiSend />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-md w-full p-8 text-center border border-zinc-700 bg-zinc-950"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 text-3xl flex items-center justify-center mb-4 border border-emerald-500/30">
                <FiCheckCircle />
              </div>
              <h3 className="font-orbitron font-bold text-2xl text-zinc-100 mb-2">
                ¡Proyecto Registrado!
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                Muchas gracias por contactar a <strong>BeyondDev</strong>. Hemos recibido la información de tu proyecto correctamente.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-amber-400 text-zinc-950 font-bold rounded-xl hover:bg-amber-300 transition-colors"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}