"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type AuthModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

type AuthMode = "login" | "registro";

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [modo, setModo] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Completá todos los campos");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCargando(true);
    setError("");

    try {
      if (modo === "registro") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Invalid login")) {
          setError("Email o contraseña incorrectos");
        } else if (err.message.includes("already registered")) {
          setError("Este email ya está registrado");
        } else {
          setError(err.message);
        }
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-5">
        
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-neutral-100">
            {modo === "login" ? "Bienvenido de vuelta" : "Crear cuenta gratis"}
          </h2>
          <p className="text-xs text-neutral-500">
            {modo === "login" 
              ? "Ingresá para acceder a tus proyectos" 
              : "2 proyectos gratis, sin tarjeta de crédito"}
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 placeholder:text-neutral-600 transition-all"
          />
          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 placeholder:text-neutral-600 transition-all"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 font-mono">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={cargando}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-neutral-950 font-bold py-3 rounded-lg text-sm transition-all duration-300"
        >
          {cargando 
            ? "Cargando..." 
            : modo === "login" ? "Ingresar" : "Crear cuenta"}
        </button>

        <div className="text-center">
          <button
            onClick={() => { setModo(modo === "login" ? "registro" : "login"); setError(""); }}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-all"
          >
            {modo === "login" 
              ? "¿No tenés cuenta? Registrate gratis" 
              : "¿Ya tenés cuenta? Ingresá"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-400 text-xs transition-all"
        >
          ✕
        </button>
      </div>
    </div>
  );
}