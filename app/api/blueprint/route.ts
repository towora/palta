import { NextResponse } from "next/server";
import { generarBlueprint } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idea, proyectoNombre, respuestasEstrategia, respuestasDiseno, respuestasMotores } = body;

    if (!idea || typeof idea !== "string" || !idea.trim()) {
      return NextResponse.json(
        { error: "Se requiere el campo 'idea'" },
        { status: 400 }
      );
    }

    // Combinar todas las respuestas en un solo objeto para el blueprint
    const respuestasCompletas: Record<string, string> = {
      ...Object.fromEntries(
        Object.entries(respuestasEstrategia ?? {}).map(([k, v]) => [`estrategia_${k}`, v as string])
      ),
      ...Object.fromEntries(
        Object.entries(respuestasDiseno ?? {}).map(([k, v]) => [`diseno_${k}`, v as string])
      ),
      ...Object.fromEntries(
        Object.entries(respuestasMotores ?? {}).map(([k, v]) => [`motores_${k}`, v as string])
      ),
    };

    const resultado = await generarBlueprint(
      `${proyectoNombre ? proyectoNombre + ": " : ""}${idea}`,
      respuestasCompletas
    );

    return NextResponse.json(resultado);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en /api/blueprint:", error);
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}