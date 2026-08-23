'use client';

import React, { useState } from 'react';

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<'overview' | 'projects' | 'tasks' | 'team'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030508] text-slate-200 font-sans relative overflow-x-hidden">
      {/* Elementos de fondo con resplandor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2b1d75]/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#efc704]/10 rounded-full blur-3xl" />
      </div>

      {/* Contenedor principal del Dashboard[cite: 1, 2] */}
      <div className="flex min-h-screen relative z-10">

        {/* BARRA LATERAL (SIDEBAR)[cite: 1, 2] */}
        <aside
          className={`w-[280px] bg-[#030508]/95 border-r border-white/10 backdrop-blur-2xl flex flex-col fixed top-0 left-0 bottom-0 z-[100] transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full'
            }`}
        >
          <div className="h-[80px] flex items-center justify-between px-8 border-b border-white/10">
            <a href="#" className="flex items-center gap-2 text-xl font-bold font-mono">
              <span className="text-white">Beyond</span>
              <span className="text-[#efc704]">Dev</span>
            </a>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white text-xl"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <nav className="flex-1 py-8 px-5">
            <ul className="flex flex-col gap-2">
              {[
                { id: 'overview', label: 'Resumen', icon: 'fa-chart-line' },
                { id: 'projects', label: 'Proyectos Activos', icon: 'fa-cubes' },
                { id: 'tasks', label: 'Tablero de Tareas', icon: 'fa-list-check' },
                { id: 'team', label: 'Equipo de Desarrollo', icon: 'fa-user-group' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveView(item.id as any)}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-lg text-sm transition-all duration-200 ${activeView === item.id
                      ? 'text-[#efc704] bg-[#efc704]/5 border-l-2 border-[#efc704] font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.03] font-medium'
                      }`}
                  >
                    <i className={`fa-solid ${item.icon} w-5 text-center text-base`}></i>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile Footer[cite: 1, 2] */}
          <div className="p-5 border-t border-white/10">
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 p-3 rounded-xl relative">
              <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#2b1d75] to-[#efc704] flex items-center justify-center font-bold text-xs text-white shadow-md shadow-[#2b1d75]/30">
                AD
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-xs font-semibold text-white truncate">Admin</span>
                <span className="text-[11px] text-slate-400">Dev Lead</span>
              </div>
              <button className="text-slate-400 hover:text-red-500 p-1 transition-colors" title="Cerrar Sesión">
                <i className="fa-solid fa-power-off text-base"></i>
              </button>
            </div>
          </div>
        </aside>

        {/* PANEL PRINCIPAL[cite: 1, 2] */}
        <main className="lg:ml-[280px] flex-1 flex flex-col min-w-0">

          {/* BARRA SUPERIOR (TOPBAR)[cite: 1, 2] */}
          <header className="h-[80px] bg-[#000405]/60 border-b border-white/10 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 lg:px-10 sticky top-0 z-40 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-white text-xl p-1"
              >
                <i className="fa-solid fa-bars-staggered"></i>
              </button>
              <h1 className="font-mono text-xl font-bold tracking-wide text-white">
                {activeView === 'overview' && 'Resumen del Sistema'}
                {activeView === 'projects' && 'Proyectos Activos'}
                {activeView === 'tasks' && 'Tablero de Tareas'}
                {activeView === 'team' && 'Equipo de Desarrollo'}
              </h1>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="relative flex items-center w-full sm:w-[280px]">
                <i className="fa-solid fa-magnifying-glass absolute left-3 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  placeholder="Buscar proyectos, clientes, tareas..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-[#efc704] focus:ring-1 focus:ring-[#efc704]/30 transition-all"
                />
              </div>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="bg-[#efc704] text-black font-semibold px-5 py-2 rounded-lg text-xs hover:bg-[#d8b303] transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Nuevo Proyecto</span>
              </button>
            </div>
          </header>

          {/* VISTAS DE CONTENIDO[cite: 1, 2] */}
          <div className="p-6 lg:p-10 flex-1">

            {/* VISTA 1: OVERVIEW[cite: 1, 2] */}
            {activeView === 'overview' && (
              <section className="space-y-10 animate-fade-in">
                {/* Métricas[cite: 1, 2] */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Proyectos Registrados', val: '0', icon: 'fa-folder-open', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
                    { label: 'En Desarrollo', val: '0', icon: 'fa-screwdriver-wrench', color: 'text-[#efc704] bg-[#efc704]/10 border-[#efc704]/30' },
                    { label: 'Completados', val: '0', icon: 'fa-circle-check', color: 'text-green-400 bg-green-500/10 border-green-500/30' },
                    { label: 'Presupuesto Total (USD)', val: '$0', icon: 'fa-dollar-sign', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl p-6 flex items-center gap-5 shadow-2xl">
                      <div className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center text-xl border ${stat.color}`}>
                        <i className={`fa-solid ${stat.icon}`}></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-2xl font-bold text-white">{stat.val}</span>
                        <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-1">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grid de Rendimiento y Actividad[cite: 1, 2] */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
                  {/* Gráfico y Salud[cite: 1, 2] */}
                  <div className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl p-6">
                    <h3 className="font-mono text-lg font-bold text-white">Rendimiento del Sprint Semanal</h3>
                    <p className="text-xs text-slate-400 mb-6">Histórico de commits y despliegues automáticos integrados.</p>

                    <div className="p-4 bg-black/20 rounded-lg border border-white/10 my-4">
                      <svg className="w-full h-auto" viewBox="0 0 500 200">
                        <defs>
                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2B1D75" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#2B1D75" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" />
                        <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.05)" />
                        <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.05)" />
                        <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.1)" />
                        <path d="M 40 170 Q 110 140, 180 90 T 320 60 T 480 30 L 480 170 Z" fill="url(#chartGlow)" />
                        <path d="M 40 170 Q 110 140, 180 90 T 320 60 T 480 30" fill="none" stroke="#efc704" strokeWidth="3" />
                        {[
                          { cx: 40, cy: 170, label: 'Lun' },
                          { cx: 120, cy: 138, label: 'Mar' },
                          { cx: 190, cy: 95, label: 'Mie' },
                          { cx: 280, cy: 65, label: 'Jue' },
                          { cx: 370, cy: 60, label: 'Vie' },
                          { cx: 480, cy: 30, label: 'Fin de S.' },
                        ].map((pt, i) => (
                          <g key={i}>
                            <circle cx={pt.cx} cy={pt.cy} r="5" fill="#efc704" />
                            <text x={pt.cx} y="190" fill="#94a3b8" fontSize="10">{pt.label}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Actividades recientes[cite: 1, 2] */}
                  <div className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl p-6">
                    <h3 className="font-mono text-lg font-bold text-white">Actividades del Equipo</h3>
                    <p className="text-xs text-slate-400 mb-6">Eventos y registros más recientes del grupo de desarrollo.</p>

                    <div className="relative pl-5 space-y-6 before:absolute before:left-[7px] before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-white/5">
                      {[
                        { name: 'Orlando Umanzor', action: 'subió commit', code: 'feat/webrtc-audio', project: 'en Clon de Discord.', time: 'Hace 12 min', color: 'border-green-400 text-green-400', icon: 'fa-code-commit' },
                        { name: 'Cristhian Anibal', action: 'completó pruebas de pasarela en Ahorro Inteligente.', time: 'Hace 45 min', color: 'border-blue-400 text-blue-400', icon: 'fa-circle-check' },
                        { name: 'Jeferson Reyes', action: 'desplegó a producción Gestión Hotelera (PMS).', time: 'Hace 2 horas', color: 'border-[#efc704] text-[#efc704]', icon: 'fa-circle-arrow-up' },
                        { name: 'Orlando Umanzor', action: 'fue asignada como diseñadora UX al Catastro Inmobiliario.', time: 'Hace 1 día', color: 'border-purple-400 text-purple-400', icon: 'fa-user-plus' },
                      ].map((act, i) => (
                        <div key={i} className="relative">
                          <div className={`absolute -left-[25px] top-0.5 w-4 h-4 rounded-full bg-[#030508] border-2 flex items-center justify-center text-[8px] z-10 ${act.color}`}>
                            <i className={`fa-solid ${act.icon}`}></i>
                          </div>
                          <div className="pl-2">
                            <p className="text-xs text-slate-300 leading-relaxed">
                              <strong className="text-white">{act.name}</strong> {act.action} {act.code && <code className="bg-white/5 px-1 py-0.5 rounded text-[#efc704] text-[11px]">{act.code}</code>} {act.project}
                            </p>
                            <span className="text-[11px] text-slate-500 block mt-1">{act.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* VISTA 2: PROYECTOS[cite: 1, 2] */}
            {activeView === 'projects' && (
              <section className="space-y-6 animate-fade-in">
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl p-6 flex flex-wrap gap-6 items-end">
                  <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estado:</label>
                    <select className="bg-[#000405]/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-[#efc704]">
                      <option value="all">Todos los Estados</option>
                      <option value="idea">Idea / Planificación</option>
                      <option value="desarrollo">En Desarrollo</option>
                      <option value="pruebas">En Pruebas / QA</option>
                      <option value="completado">Completados</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tipo de Proyecto:</label>
                    <select className="bg-[#000405]/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-[#efc704]">
                      <option value="all">Todos los Tipos</option>
                      <option value="web">Páginas & Sistemas Web</option>
                      <option value="mobile">Aplicaciones Móviles</option>
                      <option value="system">Sistemas ERP / PMS / Gestión</option>
                    </select>
                  </div>
                  <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2">
                    <i className="fa-solid fa-arrow-rotate-left"></i> Limpiar Filtros
                  </button>
                </div>
              </section>
            )}

            {/* VISTA 3: KANBAN[cite: 1, 2] */}
            {activeView === 'tasks' && (
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start animate-fade-in">
                {[
                  { title: 'Por Hacer', status: 'todo' },
                  { title: 'En Desarrollo', status: 'doing' },
                  { title: 'En Pruebas', status: 'testing' },
                  { title: 'Completado', status: 'done' },
                ].map((col) => (
                  <div key={col.status} className="bg-[#060a12]/60 border border-white/10 rounded-xl p-5 flex flex-col max-h-[80vh]">
                    <div className="flex justify-between items-center mb-5 px-1">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">{col.title}</h3>
                      <span className="bg-white/5 border border-white/10 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full text-slate-400">0</span>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto min-h-[100px] p-1">
                      {/* Las tarjetas Kanban dinámicas se mapean aquí */}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* VISTA 4: EQUIPO[cite: 1, 2] */}
            {activeView === 'team' && (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
                {[
                  { name: 'Maynor Padilla', role: 'Gestor de Proyectos', desc: 'Encargado de la dirección del equipo y la conexión con el cliente, conocimientos en backend.', tag: 'Clon de discord', color: 'text-purple-400', initials: 'MP' },
                  { name: 'Orlando Umanzor', role: 'Desarrollador Fullstack', desc: 'Especialista en React, React Native, Node.js, Express, MongoDB.', tag: 'Ahorro Inteligente', color: 'text-[#efc704]', initials: 'OU' },
                  { name: 'Jeferson Reyes', role: 'Desarrollador Backend Principal', desc: 'Diseñador de bases de datos SQLServer, APIs seguras en FastAPI/Python y arquitecturas en la nube.', tag: 'Gestión Hotelera', color: 'text-blue-400', initials: 'JR' },
                  { name: 'Cristhian Anibal', role: 'Quality Assurance', desc: 'Construye suites de pruebas robustas, automatiza regresiones y asegura experiencias digitales impecables.', tag: 'Catastro Inmobiliario', color: 'text-green-400', initials: 'CA' },
                ].map((member, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-xl p-8 flex flex-col items-center text-center relative">
                    <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                    <div className="w-[64px] h-[64px] rounded-full bg-white/[0.02] border-2 border-dashed border-white/10 flex items-center justify-center mb-6">
                      <span className={`font-mono text-xl font-bold ${member.color}`}>{member.initials}</span>
                    </div>
                    <h3 className="font-mono text-base font-bold text-white mb-1">{member.name}</h3>
                    <span className="text-[11px] text-[#efc704] font-semibold uppercase tracking-wider mb-4">{member.role}</span>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1">{member.desc}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="text-[11px] bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded text-slate-300">{member.tag}</span>
                    </div>
                  </div>
                ))}
              </section>
            )}

          </div>
        </main>
      </div>

      {/* MODAL: REGISTRAR PROYECTO[cite: 1, 2] */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-[#0a0f19] border border-white/10 rounded-xl p-8 max-w-[650px] w-full shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-6">
              <h2 className="font-mono text-xl font-bold text-[#efc704]">Registrar Nuevo Proyecto</h2>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white text-xl">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Nombre del Proyecto *</label>
                  <input type="text" placeholder="Ej. Portal de Contratos" className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-xs text-white outline-none focus:border-[#efc704]" />
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Cliente / Empresa *</label>
                  <input type="text" placeholder="Ej. Logística SA" className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-xs text-white outline-none focus:border-[#efc704]" />
                </div>
              </div>
              <div className="flex justify-end gap-4 border-t border-white/10 pt-5 mt-6">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-6 py-2.5 bg-white/5 text-xs text-slate-300 rounded hover:bg-white/10">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 bg-[#efc704] text-xs text-black font-semibold rounded hover:bg-[#d8b303]">Guardar Proyecto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}