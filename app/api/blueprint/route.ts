import { NextResponse } from "next/server";
import { generarBlueprint } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.idea || typeof body.idea !== "string" || !body.idea.trim()) {
      return NextResponse.json(
        { error: "Se requiere un campo 'idea' de tipo string no vacío" },
        { status: 400 }
      );
    }

    if (
      !body?.respuestas ||
      typeof body.respuestas !== "object" ||
      Array.isArray(body.respuestas) ||
      Object.keys(body.respuestas).length === 0
    ) {
      return NextResponse.json(
        { error: "Se requiere un campo 'respuestas' como objeto no vacío" },
        { status: 400 }
      );
    }

    const respuestas = body.respuestas as Record<string, string>;

    for (const [clave, valor] of Object.entries(respuestas)) {
      if (typeof valor !== "string") {
        return NextResponse.json(
          { error: `La respuesta "${clave}" debe ser un string` },
          { status: 400 }
        );
      }
    }

    const resultado = await generarBlueprint(body.idea, respuestas);

    return NextResponse.json(resultado);
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : "Error desconocido al generar blueprint";

    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
