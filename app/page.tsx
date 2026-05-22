"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Stepper from "@/components/Stepper";
import IdeaInput from "@/components/IdeaInput";
import CalibrationFlow from "@/components/CalibrationFlow";
import DesignPhase from "@/components/DesignPhase";
import { Proyecto } from "@/types/project";

export default function Home() {
  // Estados de navegación y flujo de la Impresora Digital
  const [faseActual, setFaseActual] = useState<"inicio" | "estrategia" | "diseno" | "motores" | "imprimir">("inicio");
  const [ideaOriginal, setIdeaOriginal] = useState("");
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [proyectoActivo, setProyectoActivo] = useState<Proyecto | null>(null);

  // Cargar historial de localStorage al arrancar
  useEffect(() => {
    const guardados = localStorage.getItem("palta-proyectos");
    if (guardados) setProyectos(JSON.parse(guardados));
  }, []);

  const reiniciarImpresora = () => {
    setFaseActual("inicio");
    setIdeaOriginal("");
  };

  const guardarProyecto = () => {
    if (!ideaOriginal.trim()) return;

    const nuevoProyecto = {
      nombre: ideaOriginal.slice(0, 30),
      idea: ideaOriginal,
      fecha: new Date().toLocaleString(),
    };

    const actualizados = [...proyectos, nuevoProyecto];

    setProyectos(actualizados);

    localStorage.setItem(
      "palta-proyectos",
      JSON.stringify(actualizados)
    );
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden select-none">
      
      <Sidebar
        proyectos={proyectos}
        onSelectProyecto={setProyectoActivo}
      />

      {/* 2. CONTENEDOR PRINCIPAL OPERATIVO */}
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        
        {faseActual !== "inicio" && (
          <Stepper
            faseActual={faseActual}
            reiniciarImpresora={reiniciarImpresora}
          />
        )}

        {/* Renderizado Dinámico de las Pantallas */}
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
              onComplete={() => setFaseActual("diseno")}
            />
          )}

          {faseActual === "diseno" && (
            <DesignPhase onRestart={reiniciarImpresora} />
          )}

        </div>
      </main>
    </div>
  );
}