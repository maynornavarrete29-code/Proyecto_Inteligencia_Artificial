// components/layout/Footer.tsx
import { FiLinkedin, FiGithub, FiInstagram, FiLogIn } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/80 py-12 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand */}
        <div>
          <a href="#" className="font-orbitron font-bold text-xl text-zinc-100">
            Beyond<span className="text-amber-400">Dev</span>
          </a>
          <p className="text-xs text-zinc-400 mt-1">Superando límites a través del código de calidad.</p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a href="#" aria-label="LinkedIn" className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-zinc-700">
            <FiLinkedin />
          </a>
          <a href="#" aria-label="GitHub" className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-zinc-700">
            <FiGithub />
          </a>
          <a href="#" aria-label="Instagram" className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-zinc-700">
            <FiInstagram />
          </a>
          <a href="/bd/dashboard" aria-label="Backend Admin" className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-zinc-700">
            <FiLogIn />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-zinc-400">
          <p>&copy; {new Date().getFullYear()} BeyondDev. Todos los derechos reservados.</p>
          <p className="font-orbitron text-amber-400/80 mt-1">Beyond code, Beyond limit.</p>
        </div>
      </div>
    </footer>
  );
}