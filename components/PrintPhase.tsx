"use client";

import { useEffect, useState, useRef } from "react";

type RoadmapEtapa = {
  etapa: string;
  descripcion: string;
  duracion_estimada: string;
};

type Blueprint = {
  features: string[];
  stack_sugerido: Record<string, string>;
  monetizacion: string;
  roadmap: RoadmapEtapa[];
};

interface PrintPhaseProps {
  proyectoNombre: string;
  ideaOriginal: string;
  respuestasEstrategia: Record<number, string>;
  respuestasDiseno: Record<number, string>;
  respuestasMotores: Record<number, string>;
  onRestart?: () => void;
}

const mensajesTerminal = [
  { texto: "> Leyendo planos estratégicos...", delay: 0 },
  { texto: "> Compilando interfaz visual y componentes...", delay: 1200 },
  { texto: "> Estructurando motores de base de datos...", delay: 2400 },
  { texto: "> Desplegando en la nube...", delay: 3600 },
  { texto: "> ¡Proyecto impreso con éxito!", delay: 4800 },
];

function slugify(nombre: string) {
  return nombre
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40) || "mi-proyecto";
}

type EstadoBlueprint = "cargando" | "listo" | "error";

export default function PrintPhase({
  proyectoNombre,
  ideaOriginal,
  respuestasEstrategia,
  respuestasDiseno,
  respuestasMotores,
  onRestart,
}: PrintPhaseProps) {
  const [estadoBlueprint, setEstadoBlueprint] = useState<EstadoBlueprint>("cargando");
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [puntos, setPuntos] = useState(".");
  const [imprimiendo, setImprimiendo] = useState(false);
  const [mensajesVisibles, setMensajesVisibles] = useState<string[]>([]);
  const [impresionCompleta, setImpresionCompleta] = useState(false);
  const llamadaHecha = useRef(false);

  const urlProyecto = `https://${slugify(proyectoNombre)}.palta.dev`;

  useEffect(() => {
    if (estadoBlueprint !== "cargando") return;
    const interval = setInterval(() => {
      setPuntos((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [estadoBlueprint]);

  useEffect(() => {
    if (llamadaHecha.current) return;
    llamadaHecha.current = true;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const fetchBlueprint = async () => {
      try {
        const res = await fetch("/api/blueprint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea: ideaOriginal,
            proyectoNombre,
            respuestasEstrategia,
            respuestasDiseno,
            respuestasMotores,
          }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Error al generar blueprint");

        const data = await res.json();
        setBlueprint(data);
        setEstadoBlueprint("listo");
      } catch {
        setEstadoBlueprint("error");
      } finally {
        clearTimeout(timeout);
      }
    };

    fetchBlueprint();

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  const handleReintentar = () => {
    llamadaHecha.current = false;
    setEstadoBlueprint("cargando");
    setBlueprint(null);

    llamadaHecha.current = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const fetchBlueprint = async () => {
      try {
        const res = await fetch("/api/blueprint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea: ideaOriginal,
            proyectoNombre,
            respuestasEstrategia,
            respuestasDiseno,
            respuestasMotores,
          }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Error al generar blueprint");

        const data = await res.json();
        setBlueprint(data);
        setEstadoBlueprint("listo");
      } catch {
        setEstadoBlueprint("error");
      } finally {
        clearTimeout(timeout);
      }
    };

    fetchBlueprint();
  };

  useEffect(() => {
    if (!imprimiendo) return;

    const timeouts = mensajesTerminal.map(({ texto, delay }) =>
      setTimeout(() => {
        setMensajesVisibles((prev) => [...prev, texto]);
        if (texto.includes("éxito")) {
          setTimeout(() => setImpresionCompleta(true), 600);
        }
      }, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [imprimiendo]);

  const iniciarImpresion = () => {
    setMensajesVisibles([]);
    setImpresionCompleta(false);
    setImprimiendo(true);
  };

  if (estadoBlueprint === "cargando") {
    return (
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Fase 4: Generando Blueprint
          </h2>
          <p className="text-sm text-neutral-400 font-medium">
            PAITA está procesando todo el contexto de <span className="text-neutral-200">{proyectoNombre}</span>
          </p>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800/80 p-8 rounded-xl w-full shadow-2xl flex flex-col items-center justify-center gap-4 min-h-[200px]">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-emerald-400">
            Construyendo tu blueprint{puntos}
          </p>
          <p className="text-xs text-neutral-600 text-center max-w-xs">
            Esto puede tardar hasta 60 segundos
          </p>
        </div>
      </div>
    );
  }

  if (estadoBlueprint === "error") {
    return (
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Fase 4: Error
          </h2>
        </div>
        <div className="bg-neutral-900/80 border border-red-800/50 p-8 rounded-xl w-full shadow-2xl flex flex-col items-center justify-center gap-4 min-h-[200px]">
          <p className="text-sm text-red-400 font-mono">Error al generar el blueprint</p>
          <p className="text-xs text-neutral-500 text-center max-w-xs">
            Los modelos pueden estar ocupados. Esperá unos segundos y reintentá.
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

  if (impresionCompleta) {
    return (
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            ¡Impresión Completada!
          </h2>
          <p className="text-sm text-neutral-400">Tu MVP está listo para explorar</p>
        </div>

        <div className="bg-neutral-900/80 border border-emerald-500/30 p-6 rounded-xl w-full shadow-2xl shadow-emerald-500/5 space-y-5 text-center">
          <div className="text-4xl">🎉</div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-neutral-100">{proyectoNombre}</p>
            <p className="text-xs text-neutral-500">Desplegado en la nube de Palta</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-emerald-400 font-mono truncate">
            {urlProyecto}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              onClick={() => alert("Descarga simulada: palta-proyecto.zip")}
              className="flex-1 bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-300 hover:text-neutral-100 py-3 rounded-lg text-xs font-medium transition-all duration-300"
            >
              Descargar código fuente
            </button>
            {onRestart && (
              <button
                onClick={onRestart}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold py-3 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-emerald-500/10 active:scale-[0.99]"
              >
                Fabricar otra idea
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (imprimiendo) {
    return (
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Fase 4: Imprimiendo Proyecto
          </h2>
          <p className="text-sm text-neutral-400">
            La impresora digital está compilando <span className="text-neutral-200">{proyectoNombre}</span>
          </p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-xl w-full shadow-2xl font-mono text-xs space-y-1.5 min-h-[180px]">
          {mensajesVisibles.map((msg, idx) => (
            <p
              key={idx}
              className={`transition-all duration-300 ${
                msg.includes("éxito") ? "text-emerald-400 font-bold" : "text-neutral-400"
              }`}
            >
              {msg.includes("éxito") ? msg : `${msg} OK`}
            </p>
          ))}
          {mensajesVisibles.length < mensajesTerminal.length && (
            <p className="text-emerald-500/60 animate-pulse">_</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 transition-all duration-500">
      <div className="text-center space-y-1">
        <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
          Fase 4: Blueprint Listo
        </h2>
        <p className="text-sm text-neutral-400">
          Plan técnico completo para <span className="text-neutral-200 font-medium">{proyectoNombre}</span>
        </p>
      </div>

      <div className="bg-neutral-900/80 border border-neutral-800/80 p-6 rounded-xl w-full shadow-2xl space-y-5 overflow-y-auto max-h-[60vh]">

        <div className="space-y-2">
          <p className="text-[11px] font-mono text-emerald-400/80 uppercase tracking-wider">
            Features del MVP
          </p>
          <div className="space-y-1.5">
            {blueprint?.features.map((f, idx) => (
              <p key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                {f}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-mono text-violet-400/80 uppercase tracking-wider">
            Stack Sugerido
          </p>
          <div className="grid grid-cols-2 gap-2">
            {blueprint?.stack_sugerido && Object.entries(blueprint.stack_sugerido).map(([k, v]) => (
              <div key={k} className="bg-neutral-950 border border-neutral-800 rounded-lg p-2.5">
                <p className="text-[10px] text-neutral-500 uppercase">{k}</p>
                <p className="text-xs text-neutral-200 font-medium mt-0.5">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-mono text-orange-400/80 uppercase tracking-wider">
            Monetización
          </p>
          <p className="text-xs text-neutral-300 bg-neutral-950 border border-neutral-800 rounded-lg p-3">
            {blueprint?.monetizacion}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-mono text-blue-400/80 uppercase tracking-wider">
            Roadmap
          </p>
          <div className="space-y-2">
            {blueprint?.roadmap.map((etapa, idx) => (
              <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-200 font-medium">{etapa.etapa}</p>
                  <span className="text-[10px] text-blue-400 font-mono">{etapa.duracion_estimada}</span>
                </div>
                <p className="text-[11px] text-neutral-500">{etapa.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={iniciarImpresion}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold py-4 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
      >
        Imprimir Proyecto (Deploy)
      </button>
    </div>
  );
}