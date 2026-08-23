"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function DashboardPage() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    console.log(inputText);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
        <h1 className="text-3xl font-bold text-zinc-50">Panel de IA</h1>
        <p className="mt-2 text-zinc-400">Prueba el análisis de datos con el backend FastAPI.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            placeholder="Escribe aquí el texto o prompt para analizar con IA..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-amber-400 px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <LoadingSpinner size={18} /> : "Analizar con IA"}
          </button>
        </form>

        {error && <div className="mt-4 rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">{error}</div>}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <h3 className="text-lg font-semibold text-zinc-100">Resultado</h3>
            <pre className="mt-3 overflow-auto whitespace-pre-wrap text-sm text-zinc-300">{JSON.stringify(result, null, 2)}</pre>
          </motion.div>
        )}
      </div>
    </div>
  );
}
