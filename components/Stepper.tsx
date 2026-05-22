type StepperProps = {
  faseActual: "inicio" | "estrategia" | "diseno" | "motores" | "imprimir";
  reiniciarImpresora: () => void;
};

export default function Stepper({
  faseActual,
  reiniciarImpresora,
}: StepperProps) {
  return (
    <div className="w-full bg-neutral-950/80 backdrop-blur border-b border-neutral-900 p-4 flex justify-between items-center px-8 md:px-12 z-10 sticky top-0">
      <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm">
        <span className={`transition-all duration-300 ${faseActual === "estrategia" ? "text-emerald-400 font-bold scale-105" : "text-neutral-500"}`}>1. Planos</span>
        <span className="text-neutral-800">➔</span>
        <span className={`transition-all duration-300 ${faseActual === "diseno" ? "text-emerald-400 font-bold scale-105" : "text-neutral-500"}`}>2. Chasis Visual</span>
        <span className="text-neutral-800">➔</span>
        <span className={`transition-all duration-300 ${faseActual === "motores" ? "text-emerald-400 font-bold scale-105" : "text-neutral-500"}`}>3. Motores</span>
        <span className="text-neutral-800">➔</span>
        <span className={`transition-all duration-300 ${faseActual === "imprimir" ? "text-emerald-400 font-bold scale-105" : "text-neutral-500"}`}>4. ¡Imprimir!</span>
      </div>
      <button
        onClick={reiniciarImpresora}
        className="text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 transition"
      >
        Resetear Máquina
      </button>
    </div>
  );
}
