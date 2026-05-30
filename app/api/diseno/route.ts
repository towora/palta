export const maxDuration = 60;

import { NextResponse } from "next/server";
import { generarPreguntasDiseno } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { proyectoNombre, ideaOriginal, respuestasEstrategia } = body;

    if (!proyectoNombre || !ideaOriginal) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const resultado = await generarPreguntasDiseno(
      proyectoNombre,
      ideaOriginal,
      respuestasEstrategia ?? {}
    );

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Error en /api/diseno:", error);
    return NextResponse.json(
      { error: "Error al generar preguntas de diseño" },
      { status: 500 }
    );
  }
}