"use client";

export interface ProyectoHistorial {
  nombre?: string;
  idea?: string;
  fecha?: string;
}

interface HistorialPanelProps {
  proyectos?: ProyectoHistorial[];
  onSelectProyecto?: (proyecto: ProyectoHistorial, index: number) => void;
  className?: string;
}

export default function HistorialPanel({
  proyectos = [],
  onSelectProyecto,
  className = ""
}: HistorialPanelProps) {
  return (
    <aside
      className={`w-64 border-r border-neutral-900 bg-neutral-900/30 p-4 flex flex-col justify-between hidden md:flex ${className}`}
    >
      <div>
        <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2 tracking-tight">
          🥑 Palta{" "}
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-normal">
            v1.0
          </span>
        </h2>
        <div className="space-y-2">
          <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mb-3">
            Historial Localhost
          </p>
          {proyectos.length === 0 ? (
            <p className="text-xs text-neutral-600 italic px-1">No hay proyectos fabricados</p>
          ) : (
            proyectos.map((proyecto, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectProyecto?.(proyecto, idx)}
                className="w-full text-left p-2 text-xs bg-neutral-900/50 rounded-lg border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-all duration-300"
              >
                <span className="block truncate">{proyecto.nombre || `Proyecto ${idx + 1}`}</span>
                {proyecto.fecha && (
                  <span className="block text-[10px] text-neutral-600 mt-0.5">{proyecto.fecha}</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
      <div className="text-[11px] text-neutral-600 text-center border-t border-neutral-900 pt-4 font-mono">
        [ IMPRESORA DIGITAL ACTIVE ]
      </div>
    </aside>
  );
}
