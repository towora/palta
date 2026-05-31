import { Proyecto } from "@/types/project";
import type { User } from "@supabase/supabase-js";

type SidebarProps = {
  proyectos: Proyecto[];
  onSelectProyecto?: (proyecto: Proyecto) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
};

export default function Sidebar({
  proyectos,
  onSelectProyecto,
  user,
  onLogin,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="w-64 border-r border-neutral-900 bg-neutral-900/30 p-4 flex flex-col justify-between hidden md:flex">
      
      <div>
        <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2 tracking-tight">
          🥑 Palta
        </h2>

        <div className="space-y-2">
          <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mb-3">
            {user ? "Mis Proyectos" : "Historial Local"}
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

      <div className="space-y-3 border-t border-neutral-900 pt-4">
        {user ? (
          <div className="space-y-2">
            <p className="text-[11px] text-neutral-500 truncate px-1">
              {user.email}
            </p>
            <button
              onClick={onLogout}
              className="w-full text-left p-2 text-xs bg-neutral-900/50 rounded-lg border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-800/50 transition-all"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold py-2 rounded-lg text-xs transition-all"
          >
            Ingresar / Registrarse
          </button>
        )}
        <p className="text-[11px] text-neutral-600 text-center font-mono">
          [ IMPRESORA DIGITAL ACTIVE ]
        </p>
      </div>
    </aside>
  );
}