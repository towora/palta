"use client";

import { useState, useEffect, useRef } from "react";

type Pregunta = {
  id: number;
  pregunta: string;
  opciones: [string, string, string];
};

type CalibrationData = {
  proyectoNombre: string;
  respuestas: Record<number, string>;
};

type CalibrationFlowProps = {
  ideaOriginal: string;
  onComplete: (data: CalibrationData) => void;
};

type EstadoCarga = "cargando" | "listo" | "error";

export default function CalibrationFlow({
  ideaOriginal,
  onComplete,
}: CalibrationFlowProps) {
  const [estado, setEstado] = useState<EstadoCarga>("cargando");
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [proyectoNombre, setProyectoNombre] = useState("");
  const [progresoCarga, setProgresoCarga] = useState(0);
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [puntos, setPuntos] = useState(".");
  const llamadaHecha = useRef(false);

  // Animación de puntos mientras carga
  useEffect(() => {
    if (estado !== "cargando") return;
    const interval = setInterval(() => {
      setPuntos((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [estado]);

  // Llamada a la API al montar — solo una vez
  useEffect(() => {
    if (llamadaHecha.current) return;
    llamadaHecha.current = true;

    const fetchPreguntas = async () => {
      try {
        setEstado("cargando");
        const res = await fetch("/api/estrategia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea: ideaOriginal }),
        });

        if (!res.ok) throw new Error("Error al contactar a PAITA");

        const data = await res.json();
        setProyectoNombre(data.proyecto_nombre);
        setPreguntas(data.preguntas);
        setEstado("listo");
      } catch {
        setEstado("error");
      }
    };

    fetchPreguntas();
  }, [ideaOriginal]);

  const handleReintentar = () => {
    llamadaHecha.current = false;
    setEstado("cargando");
    setPreguntaIndex(0);
    setRespuestas({});
    setProgresoCarga(0);

    const fetchPreguntas = async () => {
      try {
        const res = await fetch("/api/estrategia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea: ideaOriginal }),
        });

        if (!res.ok) throw new Error("Error al contactar a PAITA");

        const data = await res.json();
        setProyectoNombre(data.proyecto_nombre);
        setPreguntas(data.preguntas);
        setEstado("listo");
      } catch {
        setEstado("error");
      }
    };

    llamadaHecha.current = true;
    fetchPreguntas();
  };

  const handleSeleccionarOpcion = (opcion: string) => {
    const preguntaActual = preguntas[preguntaIndex];
    const nuevasRespuestas = { ...respuestas, [preguntaActual.id]: opcion };
    setRespuestas(nuevasRespuestas);

    const siguienteIndex = preguntaIndex + 1;
    const nuevoProgreso = Math.min((siguienteIndex / preguntas.length) * 100, 100);
    setProgresoCarga(nuevoProgreso);

    if (siguienteIndex < preguntas.length) {
      setTimeout(() => setPreguntaIndex(siguienteIndex), 300);
    } else {
      setTimeout(() => onComplete({ proyectoNombre, respuestas: nuevasRespuestas }), 800);
    }
  };

  // Estado: cargando
  if (estado === "cargando") {
    return (
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Fase 1: Calibración de Planos
          </h2>
          <p className="text-sm text-neutral-400 font-medium">"{ideaOriginal}"</p>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800/80 p-8 rounded-xl w-full shadow-2xl flex flex-col items-center justify-center gap-4 min-h-[200px]">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-emerald-400">
            PAITA está analizando tu idea{puntos}
          </p>
          <p className="text-xs text-neutral-600 text-center max-w-xs">
            Esto puede tardar unos segundos
          </p>
        </div>
      </div>
    );
  }

  // Estado: error
  if (estado === "error") {
    return (
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Fase 1: Calibración de Planos
          </h2>
          <p className="text-sm text-neutral-400 font-medium">"{ideaOriginal}"</p>
        </div>
        <div className="bg-neutral-900/80 border border-red-800/50 p-8 rounded-xl w-full shadow-2xl flex flex-col items-center justify-center gap-4 min-h-[200px]">
          <p className="text-sm text-red-400 font-mono">Error al conectar con PAITA</p>
          <p className="text-xs text-neutral-500 text-center max-w-xs">
            No se pudo generar el cuestionario. Intentá de nuevo.
          </p>
          <button
            onClick={handleReintentar}
            className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs px-4 py-2 rounded-lg transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Estado: listo — preguntas de la IA
  return (
    <div className="w-full space-y-6 transition-all duration-500">
      <div className="text-center space-y-1">
        <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
          Fase 1: Calibración de Planos
        </h2>
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
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-500/60">
              {preguntaIndex + 1}/{preguntas.length}
            </span>
            {proyectoNombre && (
              <span className="text-[10px] font-mono text-neutral-600 truncate">
                — {proyectoNombre}
              </span>
            )}
          </div>
          <h3 className="text-md font-semibold text-neutral-200 transition-all duration-300">
            {preguntas[preguntaIndex]?.pregunta}
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {preguntas[preguntaIndex]?.opciones.map((opcion, idx) => (
              <button
                key={idx}
                onClick={() => handleSeleccionarOpcion(opcion)}
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