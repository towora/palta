type DesignPhaseProps = {
  onRestart: () => void;
};

export default function DesignPhase({ onRestart }: DesignPhaseProps) {
  return (
    <div className="w-full text-center space-y-6 transition-all duration-500">
      <div className="space-y-1">
        <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Fase 2: El Chasis Visual</h2>
        <p className="text-sm text-neutral-400">¡Planos aprobados! Configurando la interfaz gráfica.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl w-full min-h-[200px] flex flex-col items-center justify-center gap-4 shadow-2xl">
        <p className="text-sm text-neutral-400 italic">
          Acá es donde conectaremos las preguntas de interfaz y el simulador interactivo de pantalla.
        </p>
        <button
          onClick={onRestart}
          className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs px-4 py-2 rounded-lg hover:bg-neutral-700 transition-all"
        >
          ◀ Fabricar otra idea
        </button>
      </div>
    </div>
  );
}
