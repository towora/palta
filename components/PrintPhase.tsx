"use client";

import { useEffect, useState } from "react";

interface PrintPhaseProps {
  proyectoNombre?: string;
  onRestart?: () => void;
}

const mensajesTerminal = [
  { texto: "> Leyendo planos estratégicos...", delay: 0 },
  { texto: "> Compilando interfaz visual y componentes...", delay: 1200 },
  { texto: "> Estructurando motores de base de datos...", delay: 2400 },
  { texto: "> Desplegando en la nube...", delay: 3600 },
  { texto: "> ¡Proyecto impreso con éxito!", delay: 4800 }
];

function slugify(nombre: string) {
  return nombre
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40) || "mi-proyecto";
}

export default function PrintPhase({
  proyectoNombre = "Tu proyecto",
  onRestart
}: PrintPhaseProps) {
  const [mensajesVisibles, setMensajesVisibles] = useState<string[]>([]);
  const [impresionCompleta, setImpresionCompleta] = useState(false);
  const [imprimiendo, setImprimiendo] = useState(false);

  const urlProyecto = `https://${slugify(proyectoNombre)}.palta.dev`;

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

  if (impresionCompleta) {
    return (
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Fase 4: ¡Impresión Completada!
          </h2>
          <p className="text-sm text-neutral-400">
            Tu MVP está listo para explorar
          </p>
        </div>

        <div className="bg-neutral-900/80 border border-emerald-500/30 p-6 rounded-xl w-full shadow-2xl shadow-emerald-500/5 space-y-5 text-center">
          <div className="text-4xl">🎉</div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-neutral-100">{proyectoNombre}</p>
            <p className="text-xs text-neutral-500">Desplegado en la nube de Palta</p>
          </div>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="block bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 rounded-lg p-3 text-sm text-emerald-400 font-mono transition-all duration-300 truncate"
          >
            {urlProyecto}
          </a>

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
          Fase 4: Botón de Impresión
        </h2>
        <p className="text-sm text-neutral-400">
          Todo listo para desplegar <span className="text-neutral-200 font-medium">{proyectoNombre}</span>
        </p>
      </div>

      <div className="bg-neutral-900/80 border border-neutral-800/80 p-8 rounded-xl w-full shadow-2xl text-center space-y-6">
        <p className="text-sm text-neutral-400 max-w-sm mx-auto">
          Al imprimir, Palta simulará la compilación completa y te entregará el link de tu MVP.
        </p>
        <button
          onClick={iniciarImpresion}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold py-4 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
        >
          Imprimir Proyecto (Deploy)
        </button>
      </div>
    </div>
  );
}
