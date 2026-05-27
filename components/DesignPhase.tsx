"use client";

import { useState } from "react";

type DesignPhaseProps = {
  onRestart: () => void;
  onComplete: () => void;
  proyectoNombre: string;
};

type PreguntaDiseno = {
  id: number;
  pregunta: string;
  opciones: [string, string, string];
};

export default function DesignPhase({ onRestart, onComplete, proyectoNombre }: DesignPhaseProps) {
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [progresoCarga, setProgresoCarga] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});

  const preguntasDiseno: PreguntaDiseno[] = [
    { id: 1, pregunta: "¿Qué estilo visual define mejor tu producto?", opciones: ["Minimalista y limpio", "Moderno y tecnológico", "Cálido y humano"] },
    { id: 2, pregunta: "¿Qué paleta de colores representa mejor tu marca?", opciones: ["Oscura y sofisticada", "Clara y profesional", "Colorida y energética"] },
    { id: 3, pregunta: "¿Cómo preferís que se sientan los elementos de tu interfaz?", opciones: ["Redondeados y suaves", "Cuadrados y sólidos", "Mixto y equilibrado"] },
    { id: 4, pregunta: "¿Qué prioridad tiene la interfaz para tu usuario?", opciones: ["Simplicidad ante todo", "Información densa y completa", "Visual e impactante"] }
  ];

  const handleSeleccionarOpcion = (opcion: string) => {
    const preguntaActual = preguntasDiseno[preguntaIndex];
    const nuevasRespuestas = { ...respuestas, [preguntaActual.id]: opcion };
    setRespuestas(nuevasRespuestas);

    const siguienteIndex = preguntaIndex + 1;
    const nuevoProgreso = Math.min((siguienteIndex / preguntasDiseno.length) * 100, 100);
    setProgresoCarga(nuevoProgreso);

    if (siguienteIndex < preguntasDiseno.length) {
      setTimeout(() => setPreguntaIndex(siguienteIndex), 300);
    } else {
      setTimeout(() => onComplete(), 800);
    }
  };

  return (
    <div className="w-full space-y-6 transition-all duration-500">
      <div className="text-center space-y-1">
        <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
          Fase 2: El Chasis Visual
        </h2>
        <p className="text-sm text-neutral-400 font-medium">
          Configurando la identidad de <span className="text-neutral-200">{proyectoNombre}</span>
        </p>
      </div>

      <div className="bg-neutral-900/80 border border-neutral-800/80 p-6 rounded-xl w-full shadow-2xl space-y-6">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-neutral-500">
            <span>DISEÑO VISUAL</span>
            <span>{Math.round(progresoCarga)}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800/40">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progresoCarga}%` }}
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-violet-500/60">
              {preguntaIndex + 1}/{preguntasDiseno.length}
            </span>
          </div>
          <h3 className="text-md font-semibold text-neutral-200">
            {preguntasDiseno[preguntaIndex]?.pregunta}
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {preguntasDiseno[preguntaIndex]?.opciones.map((opcion, idx) => (
              <button
                key={idx}
                onClick={() => handleSeleccionarOpcion(opcion)}
                className="w-full text-left bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-violet-500/50 text-neutral-300 hover:text-violet-400 p-3.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 active:scale-[0.995]"
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="text-xs text-neutral-600 hover:text-neutral-400 transition-all"
      >
        ◀ Fabricar otra idea
      </button>
    </div>
  );
}