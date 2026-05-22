"use client";

import { useState } from "react";

type Pregunta = {
  q: string;
  options: string[];
};

type CalibrationFlowProps = {
  ideaOriginal: string;
  onComplete: () => void;
};

const preguntasSimuladas: Pregunta[] = [
  {
    q: "¿A qué público principal apunta este proyecto?",
    options: ["Consumidores finales (B2C)", "Empresas y negocios (B2B)", "Un nicho muy específico"]
  },
  {
    q: "¿Cuál considerás que sería el canal ideal para usarlo?",
    options: ["Aplicación Mobile", "Plataforma Web accesible", "Extensión o Herramienta de escritorio"]
  },
  {
    q: "¿Cómo te gustaría monetizar o sostener la idea?",
    options: ["Suscripción mensual (SaaS)", "Publicidad / Gratis", "Pago único por descarga/servicio"]
  }
];

export default function CalibrationFlow({
  ideaOriginal,
  onComplete,
}: CalibrationFlowProps) {
  const [progresoCarga, setProgresoCarga] = useState(0);
  const [preguntaIndex, setPreguntaIndex] = useState(0);

  const handleSeleccionarOpcion = () => {
    const siguienteIndex = preguntaIndex + 1;
    const nuevoProgreso = Math.min((siguienteIndex / preguntasSimuladas.length) * 100, 100);
    setProgresoCarga(nuevoProgreso);

    if (siguienteIndex < preguntasSimuladas.length) {
      setTimeout(() => setPreguntaIndex(siguienteIndex), 300);
    } else {
      setTimeout(() => onComplete(), 800);
    }
  };

  return (
    <div className="w-full space-y-6 transition-all duration-500">
      <div className="text-center space-y-1">
        <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Fase 1: Calibración de Planos</h2>
        <p className="text-sm text-neutral-400 font-medium font-sans">"{ideaOriginal}"</p>
      </div>

      <div className="bg-neutral-900/80 border border-neutral-800/80 p-6 rounded-xl w-full shadow-2xl space-y-6 relative overflow-hidden">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-neutral-500">
            <span>PROGRESO DE CONFIGURACIÓN</span>
            <span>{Math.round(progresoCarga)}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800/40">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progresoCarga}%` }}
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-md font-semibold text-neutral-200 transition-all duration-300">
            {preguntasSimuladas[preguntaIndex].q}
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {preguntasSimuladas[preguntaIndex].options.map((opcion, idx) => (
              <button
                key={idx}
                onClick={handleSeleccionarOpcion}
                className="w-full text-left bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-emerald-500/50 text-neutral-300 hover:text-emerald-400 p-3.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 active:scale-[0.995]"
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
