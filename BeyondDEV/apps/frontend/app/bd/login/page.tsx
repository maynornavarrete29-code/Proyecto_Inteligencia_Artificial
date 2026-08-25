"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  ScanFace, 
  Sparkles, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Terminal,
  Cpu,
  Zap
} from "lucide-react";

// Variantes de animación escalonada (Stagger) para los campos del formulario
const formContainerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.08,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copiedDemo, setCopiedDemo] = useState(false);

  const handleFillDemo = () => {
    setEmail("admin@beyonddev.com");
    setPassword("Admin123!");
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2200);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] text-zinc-100 selection:bg-cyan-400 selection:text-black flex flex-col justify-between">
      
      {/* --- FONDO ANIMADO & ORBES EN MOVIMIENTO --- */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f293718_1px,transparent_1px),linear-gradient(to_bottom,#1f293718_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Orbe Flotante 1 (Violeta) */}
      <motion.div 
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.4, 0.25],
          x: [0, 40, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 -left-20 w-[450px] h-[450px] bg-gradient-to-tr from-purple-700/30 to-indigo-600/20 rounded-full blur-[140px] pointer-events-none -z-10"
      />

      {/* Orbe Flotante 2 (Cian / Ámbar) */}
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.35, 0.2],
          x: [0, -50, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/20 via-purple-600/20 to-amber-500/20 rounded-full blur-[150px] pointer-events-none -z-10"
      />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 z-20">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/70 px-5 py-3 backdrop-blur-2xl shadow-2xl shadow-purple-950/20">
          <Link href="/" className="group flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-amber-400 font-extrabold text-black shadow-lg shadow-purple-500/25"
            >
              BD
            </motion.div>
            <span className="text-lg font-bold tracking-wide" style={{ fontFamily: "var(--font-orbitron)" }}>
              Beyond<span className="bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">Dev</span>
            </span>
          </Link>

          <Link 
            href="/" 
            className="group inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs sm:text-sm font-medium text-zinc-300 hover:border-purple-500/50 hover:bg-zinc-800/80 hover:text-white transition-all duration-300 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-cyan-400" />
            Volver a la Landing
          </Link>
        </div>
      </header>

      {/* Contenido Principal Grid */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex items-center justify-center z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Columna Izquierda: Showcase Developer */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pr-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-xs font-semibold backdrop-blur-md w-fit shadow-inner shadow-cyan-500/20">
              <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>Plataforma v2.4 Activa</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
                Construye el futuro <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.35)]">
                  sin límites.
                </span>
              </h1>
              <p className="text-zinc-400 text-base leading-relaxed max-w-lg">
                Gestiona despliegues, microservicios y métricas en tiempo real con la suite de desarrollo diseñada para ingenieros exigentes.
              </p>
            </div>

            {/* Terminal Interactiva con Cursor Parpadeante */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-950/90 p-4 shadow-2xl shadow-purple-950/30 backdrop-blur-xl space-y-3 font-mono text-xs relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-zinc-500 text-[11px] flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-purple-400" /> bash - beyond-cli
                </span>
              </div>
              <div className="space-y-1.5 text-zinc-300">
                <p className="text-purple-400">$ beyond-dev auth login --env=production</p>
                <p className="text-emerald-400">✔ Authenticated as admin@beyonddev.com</p>
                <p className="text-zinc-400 flex items-center gap-1">
                  <span>&gt; Syncing clusters... [OK]</span>
                  <span className="w-2 h-4 bg-cyan-400 inline-block animate-pulse" />
                </p>
              </div>
            </motion.div>

            {/* Badges de características */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-cyan-400 shadow-md">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span>SSL / OAuth2</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-amber-400 shadow-md">
                  <Cpu className="h-4 w-4" />
                </div>
                <span>99.99% Uptime</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-purple-400 shadow-md">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span>AI Ops Built-in</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md rounded-3xl border border-zinc-800/90 bg-zinc-950/70 p-6 sm:p-8 shadow-2xl shadow-purple-950/30 backdrop-blur-2xl relative overflow-hidden"
            >
              {/* Resplandor Superior Animado */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 via-purple-500 to-transparent opacity-80" />

              {/* Selector de Pestañas con Resplandor Neón */}
              <div className="relative mb-6 flex rounded-2xl border border-zinc-800/90 bg-zinc-950/90 p-1.5 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className={`relative z-10 flex-1 py-2.5 text-xs sm:text-sm font-bold transition-colors duration-200 ${
                    tab === "login" ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {tab === "login" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-400 shadow-lg shadow-cyan-500/20"
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">Iniciar Sesión</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className={`relative z-10 flex-1 py-2.5 text-xs sm:text-sm font-bold transition-colors duration-200 ${
                    tab === "register" ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {tab === "register" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-400 shadow-lg shadow-cyan-500/20"
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">Registrarse</span>
                </button>
              </div>

              {/* Formulario Animado */}
              <AnimatePresence mode="wait">
                {tab === "login" ? (
                  <motion.div
                    key="login"
                    variants={formContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <motion.div variants={itemVariants} className="text-left">
                      <h2 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                        Acceso Developer
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                        Ingresa tus credenciales para administrar tus proyectos.
                      </p>
                    </motion.div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                      {/* Campo Correo */}
                      <motion.div variants={itemVariants} className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                          Correo Electrónico
                        </label>
                        <div className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 transition-all focus-within:border-cyan-400/80 focus-within:bg-zinc-900/90 focus-within:ring-2 focus-within:ring-cyan-400/20">
                          <Mail className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                            placeholder="admin@beyonddev.com"
                          />
                        </div>
                      </motion.div>

                      {/* Campo Contraseña */}
                      <motion.div variants={itemVariants} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                            Contraseña
                          </label>
                          <button 
                            type="button" 
                            className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            ¿Olvidaste tu contraseña?
                          </button>
                        </div>
                        <div className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 transition-all focus-within:border-cyan-400/80 focus-within:bg-zinc-900/90 focus-within:ring-2 focus-within:ring-cyan-400/20">
                          <Lock className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="text-zinc-500 hover:text-zinc-200 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </motion.div>

                      {/* Botón Primario con Hover Resplandeciente */}
                      <motion.div variants={itemVariants}>
                        <motion.button
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.985 }}
                          type="submit"
                          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 px-4 py-3 text-sm font-bold text-zinc-950 shadow-xl shadow-purple-500/20 transition-all hover:shadow-cyan-500/30 mt-2 overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            Ingresar al Panel
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                          {/* Brillo dinámico en hover */}
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </motion.button>
                      </motion.div>
                    </form>

                    {/* Separador */}
                    <motion.div variants={itemVariants} className="relative my-4 flex items-center justify-center">
                      <div className="w-full border-t border-zinc-800" />
                      <span className="absolute bg-zinc-950 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Otras opciones
                      </span>
                    </motion.div>

                    {/* Botón Secundario: FaceID */}
                    <motion.div variants={itemVariants}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-purple-500/30 bg-purple-950/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-purple-200 hover:bg-purple-900/40 hover:border-purple-500/60 transition-all duration-200 shadow-sm"
                      >
                        <ScanFace className="h-4 w-4 text-cyan-400" />
                        Ingresar con FaceID / Biometría
                      </button>
                    </motion.div>

                    {/* Card Demo */}
                    <motion.div variants={itemVariants} className="mt-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                          <span className="text-xs font-medium text-zinc-200">Acceso Rápido de Demo</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleFillDemo}
                          className="flex items-center gap-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-400/20 transition-all active:scale-95"
                        >
                          {copiedDemo ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" /> ¡Aplicado!
                            </>
                          ) : (
                            "Autocompletar"
                          )}
                        </button>
                      </div>
                      <div className="mt-2 text-[11px] text-zinc-400 font-mono flex flex-wrap gap-x-4 gap-y-1">
                        <span>User: <strong className="text-zinc-200">admin@beyonddev.com</strong></span>
                        <span>Pass: <strong className="text-zinc-200">Admin123!</strong></span>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    variants={formContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <motion.div variants={itemVariants} className="text-left">
                      <h2 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                        Crear Cuenta
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                        Únete a la red de desarrollo de BeyondDev.
                      </p>
                    </motion.div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                      {/* Nombre Completo */}
                      <motion.div variants={itemVariants} className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                          Nombre Completo
                        </label>
                        <div className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 transition-all focus-within:border-cyan-400/80 focus-within:bg-zinc-900/90 focus-within:ring-2 focus-within:ring-cyan-400/20">
                          <User className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
                          <input
                            type="text"
                            className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                            placeholder="Carlos Mendoza"
                          />
                        </div>
                      </motion.div>

                      {/* Correo Electrónico */}
                      <motion.div variants={itemVariants} className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                          Correo Electrónico
                        </label>
                        <div className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 transition-all focus-within:border-cyan-400/80 focus-within:bg-zinc-900/90 focus-within:ring-2 focus-within:ring-cyan-400/20">
                          <Mail className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
                          <input
                            type="email"
                            className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                            placeholder="carlos@empresa.com"
                          />
                        </div>
                      </motion.div>

                      {/* Contraseña */}
                      <motion.div variants={itemVariants} className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                          Contraseña
                        </label>
                        <div className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 transition-all focus-within:border-cyan-400/80 focus-within:bg-zinc-900/90 focus-within:ring-2 focus-within:ring-cyan-400/20">
                          <Lock className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
                          <input
                            type={showRegisterPassword ? "text" : "password"}
                            className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegisterPassword((v) => !v)}
                            className="text-zinc-500 hover:text-zinc-200 transition-colors"
                          >
                            {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </motion.div>

                      {/* Botón de Registro */}
                      <motion.div variants={itemVariants}>
                        <motion.button
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.985 }}
                          type="submit"
                          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 px-4 py-3 text-sm font-bold text-zinc-950 shadow-xl shadow-purple-500/20 transition-all hover:shadow-cyan-500/30 mt-2 overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            Registrar Cuenta
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </motion.button>
                      </motion.div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} BeyondDev Platform Inc. Todos los derechos reservados.
      </footer>
    </div>
  );
}