"use client";

import { useState, useEffect, useRef } from "react";

type PreguntaMotores = {
  id: number;
  pregunta: string;
  opciones: [string, string, string];
};

interface MotorsPhaseProps {
  proyectoNombre: string;
  ideaOriginal: string;
  respuestasEstrategia: Record<number, string>;
  respuestasDiseno: Record<number, string>;
  onComplete?: () => void;
  onBack?: () => void;
}

type EstadoCarga = "cargando" | "listo" | "error";

export default function MotorsPhase({
  proyectoNombre,
  ideaOriginal,
  respuestasEstrategia,
  respuestasDiseno,
  onComplete,
  onBack,
}: MotorsPhaseProps) {
  const [estado, setEstado] = useState<EstadoCarga>("cargando");
  const [preguntas, setPreguntas] = useState<PreguntaMotores[]>([]);
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [progresoCarga, setProgresoCarga] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [puntos, setPuntos] = useState(".");
  const [blueprintListo, setBlueprintListo] = useState(false);
  const llamadaHecha = useRef(false);

  useEffect(() => {
    if (estado !== "cargando") return;
    const interval = setInterval(() => {
      setPuntos((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [estado]);

  useEffect(() => {
    if (llamadaHecha.current) return;
    llamadaHecha.current = true;

    const fetchPreguntas = async () => {
      try {
        const res = await fetch("/api/motores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proyectoNombre,
            ideaOriginal,
            respuestasEstrategia,
            respuestasDiseno,
          }),
        });

        if (!res.ok) throw new Error("Error al contactar a PAITA");

        const data = await res.json();
        setPreguntas(data.preguntas);
        setEstado("listo");
      } catch {
        setEstado("error");
      }
    };

    fetchPreguntas();
  }, [proyectoNombre, ideaOriginal, respuestasEstrategia, respuestasDiseno]);

  const handleReintentar = () => {
    llamadaHecha.current = false;
    setEstado("cargando");
    setPreguntaIndex(0);
    setRespuestas({});
    setProgresoCarga(0);
    llamadaHecha.current = true;

    const fetchPreguntas = async () => {
      try {
        const res = await fetch("/api/motores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proyectoNombre,
            ideaOriginal,
            respuestasEstrategia,
            respuestasDiseno,
          }),
        });

        if (!res.ok) throw new Error("Error al contactar a PAITA");

        const data = await res.json();
        setPreguntas(data.preguntas);
        setEstado("listo");
      } catch {
        setEstado("error");
      }
    };

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
      setTimeout(() => setBlueprintListo(true), 800);
    }
  };

  if (estado === "cargando") {
    return (
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Fase 3: Motores y Datos
          </h2>
          <p className="text-sm text-neutral-400 font-medium">
            Configurando las entrañas de <span className="text-neutral-200">{proyectoNombre}</span>
          </p>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800/80 p-8 rounded-xl w-full shadow-2xl flex flex-col items-center justify-center gap-4 min-h-[200px]">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-orange-400">
            PAITA está configurando los motores{puntos}
          </p>
          <p className="text-xs text-neutral-600 text-center max-w-xs">
            Esto puede tardar unos segundos
          </p>
        </div>
      </div>
    );
  }

  if (estado === "error") {
    return (
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Fase 3: Motores y Datos
          </h2>
        </div>
        <div className="bg-neutral-900/80 border border-red-800/50 p-8 rounded-xl w-full shadow-2xl flex flex-col items-center justify-center gap-4 min-h-[200px]">
          <p className="text-sm text-red-400 font-mono">Error al conectar con PAITA</p>
          <p className="text-xs text-neutral-500 text-center max-w-xs">
            No se pudieron generar las preguntas de motores. Intentá de nuevo.
          </p>
          <div className="flex gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs px-4 py-2 rounded-lg transition-all"
              >
                ◀ Volver
              </button>
            )}
            <button
              onClick={handleReintentar}
              className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs px-4 py-2 rounded-lg transition-all"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (blueprintListo) {
    return (
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Fase 3: Motores Configurados
          </h2>
          <p className="text-sm text-neutral-400">
            Arquitectura lista para <span className="text-neutral-200 font-medium">{proyectoNombre}</span>
          </p>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800/80 p-6 rounded-xl w-full shadow-2xl space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] font-mono text-orange-400/80 uppercase tracking-wider">
              Configuración seleccionada
            </p>
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-2">
              {Object.values(respuestas).map((r, idx) => (
                <p key={idx} className="text-[11px] text-neutral-400 font-mono">
                  → {r}
                </p>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-400 hover:text-neutral-200 py-3 rounded-lg text-xs font-medium transition-all duration-300"
              >
                ◀ Volver a Diseño
              </button>
            )}
            {onComplete && (
              <button
                onClick={onComplete}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold py-3 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-emerald-500/10 active:scale-[0.99]"
              >
                Ir a Imprimir Proyecto →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 transition-all duration-500">
      <div className="text-center space-y-1">
        <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
          Fase 3: Motores y Datos
        </h2>
        <p className="text-sm text-neutral-400 font-medium">
          Configurando las entrañas de <span className="text-neutral-200">{proyectoNombre}</span>
        </p>
      </div>

      <div className="bg-neutral-900/80 border border-neutral-800/80 p-6 rounded-xl w-full shadow-2xl space-y-6 relative overflow-hidden">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-neutral-500">
            <span>CALIBRACIÓN DE MOTORES</span>
            <span>{Math.round(progresoCarga)}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800/40">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progresoCarga}%` }}
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-orange-500/60">
              {preguntaIndex + 1}/{preguntas.length}
            </span>
          </div>
          <h3 className="text-md font-semibold text-neutral-200 transition-all duration-300">
            {preguntas[preguntaIndex]?.pregunta}
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {preguntas[preguntaIndex]?.opciones.map((opcion, idx) => (
              <button
                key={idx}
                onClick={() => handleSeleccionarOpcion(opcion)}
                className="w-full text-left bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-orange-500/50 text-neutral-300 hover:text-orange-400 p-3.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 active:scale-[0.995]"
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