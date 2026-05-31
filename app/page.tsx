"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Stepper from "@/components/Stepper";
import IdeaInput from "@/components/IdeaInput";
import CalibrationFlow from "@/components/CalibrationFlow";
import DesignPhase from "@/components/DesignPhase";
import MotorsPhase from "@/components/MotorsPhase";
import PrintPhase from "@/components/PrintPhase";
import AuthModal from "@/components/AuthModal";
import { supabase } from "@/lib/supabase";
import { Proyecto } from "@/types/project";
import type { User } from "@supabase/supabase-js";

type DatosEstrategia = {
  proyectoNombre: string;
  respuestas: Record<number, string>;
};

type DatosDiseno = {
  respuestas: Record<number, string>;
};

type DatosMotores = {
  respuestas: Record<number, string>;
};

export default function Home() {
  const [faseActual, setFaseActual] = useState<"inicio" | "estrategia" | "diseno" | "motores" | "imprimir">("inicio");
  const [ideaOriginal, setIdeaOriginal] = useState("");
  const [datosEstrategia, setDatosEstrategia] = useState<DatosEstrategia | null>(null);
  const [datosDiseno, setDatosDiseno] = useState<DatosDiseno | null>(null);
  const [datosMotores, setDatosMotores] = useState<DatosMotores | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [mostrarAuth, setMostrarAuth] = useState(false);
  const [mostrarLimite, setMostrarLimite] = useState(false);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setCargandoAuth(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      const guardados = localStorage.getItem("palta-proyectos");
      if (guardados) setProyectos(JSON.parse(guardados));
      return;
    }

    const cargarProyectos = async () => {
      const { data } = await supabase
        .from("proyectos")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setProyectos(data);
    };

    cargarProyectos();
  }, [user]);

  const reiniciarImpresora = () => {
    setFaseActual("inicio");
    setIdeaOriginal("");
    setDatosEstrategia(null);
    setDatosDiseno(null);
    setDatosMotores(null);
  };

  const handleAlimentar = async () => {
    if (!user) {
      setMostrarAuth(true);
      return;
    }

    const { count } = await supabase
      .from("proyectos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (count !== null && count >= 2) {
      setMostrarLimite(true);
      return;
    }

    setFaseActual("estrategia");
  };

  const handleCalibrationComplete = async (datos: DatosEstrategia) => {
    setDatosEstrategia(datos);

    if (user) {
      await supabase.from("proyectos").insert({
        user_id: user.id,
        nombre: datos.proyectoNombre,
        idea: ideaOriginal,
      });

      const { data } = await supabase
        .from("proyectos")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setProyectos(data);
    } else {
      const nuevoProyecto: Proyecto = {
        nombre: datos.proyectoNombre,
        idea: ideaOriginal,
        fecha: new Date().toLocaleString(),
      };
      const actualizados = [...proyectos, nuevoProyecto];
      setProyectos(actualizados);
      localStorage.setItem("palta-proyectos", JSON.stringify(actualizados));
    }

    setFaseActual("diseno");
  };

  const handleDisenoComplete = (respuestas: Record<number, string>) => {
    setDatosDiseno({ respuestas });
    setFaseActual("motores");
  };

  const handleMotoresComplete = (respuestas: Record<number, string>) => {
    setDatosMotores({ respuestas });
    setFaseActual("imprimir");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    reiniciarImpresora();
  };

  if (cargandoAuth) {
    return (
      <div className="flex h-screen bg-neutral-950 items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden select-none">

      {mostrarAuth && (
        <AuthModal
          onClose={() => setMostrarAuth(false)}
          onSuccess={() => {
            setMostrarAuth(false);
            setFaseActual("estrategia");
          }}
        />
      )}

      {mostrarLimite && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-5 text-center">
            <div className="text-4xl">🔒</div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-neutral-100">
                Límite alcanzado
              </h2>
              <p className="text-xs text-neutral-500">
                El plan gratuito incluye 2 proyectos. Actualizá a Pro para proyectos ilimitados.
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setMostrarLimite(false)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold py-3 rounded-lg text-sm transition-all"
              >
                Entendido
              </button>
              <button
                onClick={() => setMostrarLimite(false)}
                className="w-full text-xs text-neutral-600 hover:text-neutral-400 transition-all py-1"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <Sidebar
        proyectos={proyectos}
        onSelectProyecto={() => {}}
        user={user}
        onLogin={() => setMostrarAuth(true)}
        onLogout={handleLogout}
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
              onAlimentar={handleAlimentar}
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
              onComplete={handleDisenoComplete}
              proyectoNombre={datosEstrategia?.proyectoNombre ?? ""}
              ideaOriginal={ideaOriginal}
              respuestasEstrategia={datosEstrategia?.respuestas ?? {}}
            />
          )}

          {faseActual === "motores" && (
            <MotorsPhase
              proyectoNombre={datosEstrategia?.proyectoNombre ?? ""}
              ideaOriginal={ideaOriginal}
              respuestasEstrategia={datosEstrategia?.respuestas ?? {}}
              respuestasDiseno={datosDiseno?.respuestas ?? {}}
              onComplete={handleMotoresComplete}
              onBack={() => setFaseActual("diseno")}
            />
          )}

          {faseActual === "imprimir" && (
            <PrintPhase
              proyectoNombre={datosEstrategia?.proyectoNombre ?? ""}
              ideaOriginal={ideaOriginal}
              respuestasEstrategia={datosEstrategia?.respuestas ?? {}}
              respuestasDiseno={datosDiseno?.respuestas ?? {}}
              respuestasMotores={datosMotores?.respuestas ?? {}}
              onRestart={reiniciarImpresora}
            />
          )}

        </div>
      </main>
    </div>
  );
}