export const maxDuration = 60;

import { NextResponse } from "next/server";
import { generarPreguntasEstrategia } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.idea || typeof body.idea !== "string" || !body.idea.trim()) {
      return NextResponse.json(
        { error: "Se requiere un campo 'idea' de tipo string no vacío" },
        { status: 400 }
      );
    }

    const resultado = await generarPreguntasEstrategia(body.idea);

    return NextResponse.json(resultado);
  } catch (error) {
    console.error(
      "Error completo:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );

    const mensaje =
      error instanceof Error
        ? error.message
        : "Error desconocido al generar preguntas de estrategia";

    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
