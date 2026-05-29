import { NextResponse } from "next/server";
import { generarPreguntasMotores } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { proyectoNombre, ideaOriginal, respuestasEstrategia, respuestasDiseno } = body;

    if (!proyectoNombre || !ideaOriginal) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const resultado = await generarPreguntasMotores(
      proyectoNombre,
      ideaOriginal,
      respuestasEstrategia ?? {},
      respuestasDiseno ?? {}
    );

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Error en /api/motores:", error);
    return NextResponse.json(
      { error: "Error al generar preguntas de motores" },
      { status: 500 }
    );
  }
}