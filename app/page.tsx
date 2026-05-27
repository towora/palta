"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Stepper from "@/components/Stepper";
import IdeaInput from "@/components/IdeaInput";
import CalibrationFlow from "@/components/CalibrationFlow";
import DesignPhase from "@/components/DesignPhase";
import MotorsPhase from "@/components/MotorsPhase";
import PrintPhase from "@/components/PrintPhase";
import { Proyecto } from "@/types/project";

type DatosEstrategia = {
  proyectoNombre: string;
  respuestas: Record<number, string>;
};

export default function Home() {
  const [faseActual, setFaseActual] = useState<"inicio" | "estrategia" | "diseno" | "motores" | "imprimir">("inicio");
  const [ideaOriginal, setIdeaOriginal] = useState("");
  const [datosEstrategia, setDatosEstrategia] = useState<DatosEstrategia | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [proyectoActivo, setProyectoActivo] = useState<Proyecto | null>(null);

  useEffect(() => {
    const guardados = localStorage.getItem("palta-proyectos");
    if (guardados) setProyectos(JSON.parse(guardados));
  }, []);

  const reiniciarImpresora = () => {
    setFaseActual("inicio");
    setIdeaOriginal("");
    setDatosEstrategia(null);
  };

  const handleCalibrationComplete = (datos: DatosEstrategia) => {
    setDatosEstrategia(datos);

    // Guardar en historial
    const nuevoProyecto: Proyecto = {
      nombre: datos.proyectoNombre,
      idea: ideaOriginal,
      fecha: new Date().toLocaleString(),
    };
    const actualizados = [...proyectos, nuevoProyecto];
    setProyectos(actualizados);
    localStorage.setItem("palta-proyectos", JSON.stringify(actualizados));

    setFaseActual("diseno");
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden select-none">

      <Sidebar
        proyectos={proyectos}
        onSelectProyecto={setProyectoActivo}
      />

      <main className="flex-1 flex flex-col overflow-y-auto relative">

        {faseActual !== "inicio" && (
          <Stepper
            faseActual={faseActual}
            reiniciarImpresora={reiniciarImpresora}
          />
        )}

        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full transition-all duration-500">

          {faseActual === "inicio" && (
            <IdeaInput
              ideaOriginal={ideaOriginal}
              onIdeaChange={setIdeaOriginal}
              onAlimentar={() => setFaseActual("estrategia")}
            />
          )}

          {faseActual === "estrategia" && (
            <CalibrationFlow
              ideaOriginal={ideaOriginal}
              onComplete={handleCalibrationComplete}
            />
          )}

          {faseActual === "diseno" && (
            <DesignPhase
              onRestart={reiniciarImpresora}
              onComplete={() => setFaseActual("motores")}
              proyectoNombre={datosEstrategia?.proyectoNombre ?? ""}
            />
          )}

          {faseActual === "motores" && (
            <MotorsPhase
              proyectoNombre={datosEstrategia?.proyectoNombre ?? ""}
              onComplete={() => setFaseActual("imprimir")}
              onBack={() => setFaseActual("diseno")}
            />
          )}

          {faseActual === "imprimir" && (
            <PrintPhase
              proyectoNombre={datosEstrategia?.proyectoNombre ?? ""}
              onRestart={reiniciarImpresora}
            />
          )}

        </div>
      </main>
    </div>
  );
}