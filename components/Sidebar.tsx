import { Proyecto } from "@/types/project";

type SidebarProps = {
  proyectos: Proyecto[];
  onSelectProyecto?: (proyecto: Proyecto) => void;
};

export default function Sidebar({
  proyectos,
  onSelectProyecto,
}: SidebarProps) {
  return (
    <aside className="w-64 border-r border-neutral-900 bg-neutral-900/30 p-4 flex flex-col justify-between hidden md:flex">
      
      <div>
        <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2 tracking-tight">
          🥑 Palta
        </h2>

        <div className="space-y-2">
          <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mb-3">
            Historial Localhost
          </p>

          {proyectos.length === 0 ? (
            <p className="text-xs text-neutral-600 italic px-1">
              No hay proyectos fabricados
            </p>
          ) : (
            proyectos.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectProyecto?.(p)}
                className="w-full text-left p-2 text-xs bg-neutral-900/50 rounded-lg border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 cursor-pointer transition-all"
              >
                {p.nombre || `Proyecto ${idx + 1}`}
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