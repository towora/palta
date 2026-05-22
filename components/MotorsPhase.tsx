"use client";

import { useState } from "react";

interface MotorsPhaseProps {
  proyectoNombre?: string;
  onComplete?: () => void;
  onBack?: () => void;
}

const preguntasMotores = [
  {
    q: "¿Necesitás que los usuarios inicien sesión?",
    options: ["Sí, con email y contraseña", "Sí, solo con redes sociales", "No, acceso público sin login"]
  },
  {
    q: "¿Cómo querés manejar los pagos?",
    options: ["Suscripciones recurrentes", "Pagos únicos por transacción", "Sin cobros por ahora"]
  },
  {
    q: "¿Dónde preferís alojar los datos?",
    options: ["Supabase (PostgreSQL)", "Firebase", "Base de datos propia / VPS"]
  }
];

export default function MotorsPhase({
  proyectoNombre = "Tu proyecto",
  onComplete,
  onBack
}: MotorsPhaseProps) {
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [progresoCarga, setProgresoCarga] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [blueprintListo, setBlueprintListo] = useState(false);

  const handleSeleccionarOpcion = (opcion: string) => {
    const nuevasRespuestas = { ...respuestas, [preguntaIndex]: opcion };
    setRespuestas(nuevasRespuestas);

    const siguienteIndex = preguntaIndex + 1;
    const nuevoProgreso = Math.min((siguienteIndex / preguntasMotores.length) * 100, 100);
    setProgresoCarga(nuevoProgreso);

    if (siguienteIndex < preguntasMotores.length) {
      setTimeout(() => setPreguntaIndex(siguienteIndex), 300);
    } else {
      setTimeout(() => setBlueprintListo(true), 800);
    }
  };

  if (blueprintListo) {
    return (
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="text-center space-y-1">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Fase 3: Blueprint de Motores
          </h2>
          <p className="text-sm text-neutral-400">
            Esquemas generados para <span className="text-neutral-200 font-medium">{proyectoNombre}</span>
          </p>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800/80 p-6 rounded-xl w-full shadow-2xl space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] font-mono text-emerald-400/80 uppercase tracking-wider">
              Esquema de base de datos
            </p>
            <pre className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-[11px] text-neutral-400 font-mono overflow-x-auto">
{`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'active'
);`}
            </pre>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-mono text-emerald-400/80 uppercase tracking-wider">
              Estructura sugerida
            </p>
            <pre className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-[11px] text-neutral-400 font-mono">
{`/app/api/auth
/app/api/payments
/lib/supabase.ts
/components/`}
            </pre>
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
          Configurando las entrañas operativas de <span className="text-neutral-200">{proyectoNombre}</span>
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
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progresoCarga}%` }}
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-md font-semibold text-neutral-200 transition-all duration-300">
            {preguntasMotores[preguntaIndex].q}
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {preguntasMotores[preguntaIndex].options.map((opcion, idx) => (
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
