const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_ESTRATEGIA = "google/gemma-4-31b-it:free";
const MODEL_BLUEPRINT = "meta-llama/llama-3.3-70b-instruct:free";

export type PreguntaEstrategia = {
  id: number;
  pregunta: string;
  opciones: [string, string, string];
};

export type RespuestaEstrategia = {
  proyecto_nombre: string;
  preguntas: PreguntaEstrategia[];
};

export type RoadmapEtapa = {
  etapa: string;
  descripcion: string;
  duracion_estimada: string;
};

export type Blueprint = {
  features: string[];
  stack_sugerido: Record<string, string>;
  monetizacion: string;
  roadmap: RoadmapEtapa[];
};

const SYSTEM_PROMPT_ESTRATEGIA = `Sos PAITA, el orquestador central de PALTA, una impresora 3D digital de productos.

Tu tarea es analizar una idea del usuario y generar un cuestionario estratégico dinámico que te dé suficiente información para construir un Prompt Troncal completo y fiel a la realidad.

EJES OBLIGATORIOS que debés cubrir antes de considerar que tenés suficiente información:
1. Problema concreto que resuelve
2. Usuario objetivo y contexto de uso
3. Canal principal (web, mobile, desktop, extensión)
4. Modelo de monetización
5. Diferenciación o ventaja competitiva
6. Escala inicial esperada (usuarios, volumen, geografía)

REGLAS DE GENERACIÓN:
- Si la idea ya deja claro algún eje, NO hagas preguntas sobre ese eje.
- Generá entre 4 y 8 preguntas según cuánta información falte para cubrir los 6 ejes.
- Las preguntas deben ser concretas, estratégicas y fáciles de responder con opciones.
- Cada pregunta debe tener exactamente 3 opciones representativas y mutuamente excluyentes.
- Los ids deben ser números secuenciales empezando en 1.
- El "proyecto_nombre" debe ser un nombre corto, memorable y sugerido para el producto.

OBJETIVO FINAL: Con las respuestas de este cuestionario debés poder construir un blueprint técnico completo que permita materializar el producto de forma fiel a la realidad.

REGLAS DE FORMATO:
- Respondé ÚNICAMENTE con un objeto JSON válido, sin markdown, sin texto adicional, sin comentarios.

Estructura exacta requerida:
{
  "proyecto_nombre": "string",
  "preguntas": [
    { "id": 1, "pregunta": "string", "opciones": ["string", "string", "string"] }
  ]
}`;

const SYSTEM_PROMPT_BLUEPRINT = `Sos PAITA, el orquestador de PALTA.

Tu tarea es generar un blueprint técnico y de producto basado en la idea del usuario y sus respuestas al cuestionario estratégico.

REGLAS OBLIGATORIAS:
- Respondé ÚNICAMENTE con un objeto JSON válido, sin markdown, sin texto adicional, sin comentarios.
- "features": array de funcionalidades clave del MVP (mínimo 4).
- "stack_sugerido": objeto con tecnologías recomendadas (ej: frontend, backend, base_datos, hosting, pagos).
- "monetizacion": string con la estrategia de monetización recomendada.
- "roadmap": array de etapas con etapa, descripcion y duracion_estimada (mínimo 3 etapas).

Estructura exacta requerida:
{
  "features": ["string"],
  "stack_sugerido": {
    "clave": "valor"
  },
  "monetizacion": "string",
  "roadmap": [
    { "etapa": "string", "descripcion": "string", "duracion_estimada": "string" }
  ]
}`;

function getApiKey(): string {
  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_KEY no está definida en .env.local");
  }
  return apiKey;
}

function parseJsonResponse<T>(raw: string): T {
  const trimmed = raw.trim();
  const sinMarkdown = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(sinMarkdown) as T;
}

async function llamarOpenRouter(
  systemPrompt: string,
  userPrompt: string,
  model: string
): Promise<string> {
  const apiKey = getApiKey();
  const modelos = [
    model,
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-v4-flash:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "qwen/qwen3-coder:free",
  ];

  for (const modeloActual of modelos) {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Palta",
      },
      body: JSON.stringify({
        model: modeloActual,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (response.status === 429 || response.status === 404) {
      continue;
    }

    if (!response.ok) {
      const mensaje = data.error?.message ?? response.statusText;
      throw new Error(`Error de OpenRouter (${response.status}): ${mensaje}`);
    }

    const texto = data.choices?.[0]?.message?.content;
    if (!texto) {
      throw new Error("OpenRouter no devolvió contenido en la respuesta");
    }

    return texto;
  }

  throw new Error("Todos los modelos fallaron. Esperá unos segundos y reintentá.");
}

function validarRespuestaEstrategia(data: unknown): RespuestaEstrategia {
  if (!data || typeof data !== "object") {
    throw new Error("La respuesta de PAITA no es un objeto JSON válido");
  }

  const respuesta = data as RespuestaEstrategia;

  if (typeof respuesta.proyecto_nombre !== "string" || !respuesta.proyecto_nombre.trim()) {
    throw new Error('Falta "proyecto_nombre" en la respuesta');
  }

  if (!Array.isArray(respuesta.preguntas) || respuesta.preguntas.length === 0) {
    throw new Error('Falta el array "preguntas" en la respuesta');
  }

  for (const pregunta of respuesta.preguntas) {
    if (typeof pregunta.id !== "number") {
      throw new Error("Cada pregunta debe incluir un id numérico");
    }
    if (typeof pregunta.pregunta !== "string" || !pregunta.pregunta.trim()) {
      throw new Error("Cada pregunta debe incluir el campo pregunta");
    }
    if (!Array.isArray(pregunta.opciones) || pregunta.opciones.length !== 3) {
      throw new Error("Cada pregunta debe tener exactamente 3 opciones");
    }
    if (pregunta.opciones.some((o) => typeof o !== "string" || !o.trim())) {
      throw new Error("Todas las opciones deben ser strings no vacíos");
    }
  }

  return respuesta;
}

function validarBlueprint(data: unknown): Blueprint {
  if (!data || typeof data !== "object") {
    throw new Error("El blueprint no es un objeto JSON válido");
  }

  const blueprint = data as Blueprint;

  if (!Array.isArray(blueprint.features) || blueprint.features.length === 0) {
    throw new Error('Falta el array "features" en el blueprint');
  }
  if (blueprint.features.some((f) => typeof f !== "string" || !f.trim())) {
    throw new Error("Todas las features deben ser strings no vacíos");
  }

  if (
    !blueprint.stack_sugerido ||
    typeof blueprint.stack_sugerido !== "object" ||
    Array.isArray(blueprint.stack_sugerido) ||
    Object.keys(blueprint.stack_sugerido).length === 0
  ) {
    throw new Error('Falta "stack_sugerido" como objeto con tecnologías');
  }

  if (typeof blueprint.monetizacion !== "string" || !blueprint.monetizacion.trim()) {
    throw new Error('Falta "monetizacion" en el blueprint');
  }

  if (!Array.isArray(blueprint.roadmap) || blueprint.roadmap.length === 0) {
    throw new Error('Falta el array "roadmap" en el blueprint');
  }

  for (const etapa of blueprint.roadmap) {
    if (typeof etapa.etapa !== "string" || !etapa.etapa.trim()) {
      throw new Error("Cada etapa del roadmap debe incluir el campo etapa");
    }
    if (typeof etapa.descripcion !== "string" || !etapa.descripcion.trim()) {
      throw new Error("Cada etapa del roadmap debe incluir descripcion");
    }
    if (typeof etapa.duracion_estimada !== "string" || !etapa.duracion_estimada.trim()) {
      throw new Error("Cada etapa del roadmap debe incluir duracion_estimada");
    }
  }

  return blueprint;
}

export async function generarPreguntasEstrategia(
  idea: string
): Promise<RespuestaEstrategia> {
  try {
    if (!idea.trim()) {
      throw new Error("La idea no puede estar vacía");
    }

    const raw = await llamarOpenRouter(
      SYSTEM_PROMPT_ESTRATEGIA,
      `Idea del usuario:\n"${idea.trim()}"`,
      MODEL_ESTRATEGIA
    );

    const parsed = parseJsonResponse<unknown>(raw);
    return validarRespuestaEstrategia(parsed);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al generar preguntas de estrategia: ${error.message}`);
    }
    throw new Error("Error desconocido al generar preguntas de estrategia");
  }
}

export async function generarBlueprint(
  idea: string,
  respuestas: Record<string, string>
): Promise<Blueprint> {
  try {
    if (!idea.trim()) {
      throw new Error("La idea no puede estar vacía");
    }
    if (Object.keys(respuestas).length === 0) {
      throw new Error("Las respuestas del cuestionario no pueden estar vacías");
    }

    const raw = await llamarOpenRouter(
      SYSTEM_PROMPT_BLUEPRINT,
      `Idea del usuario:\n"${idea.trim()}"\n\nRespuestas del cuestionario estratégico:\n${JSON.stringify(respuestas, null, 2)}`,
      MODEL_BLUEPRINT
    );

    const parsed = parseJsonResponse<unknown>(raw);
    return validarBlueprint(parsed);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al generar blueprint: ${error.message}`);
    }
    throw new Error("Error desconocido al generar blueprint");
  }
}
export type PreguntaDiseno = {
  id: number;
  pregunta: string;
  opciones: [string, string, string];
};

export type RespuestaDiseno = {
  preguntas: PreguntaDiseno[];
};

const SYSTEM_PROMPT_DISENO = `Sos PAITA, el orquestador de PALTA.

Tu tarea es generar preguntas de diseño visual para un producto digital basándote en su nombre, idea y contexto estratégico.

EJES QUE DEBÉS CUBRIR:
1. Estilo visual general (minimalista, moderno, cálido, etc)
2. Paleta de colores
3. Tipografía y tono visual
4. Estilo de componentes (bordes, sombras, densidad)
5. Experiencia de usuario prioritaria

REGLAS OBLIGATORIAS:
- Respondé ÚNICAMENTE con un objeto JSON válido, sin markdown, sin texto adicional.
- Generá entre 4 y 6 preguntas contextuales según el tipo de producto.
- Cada pregunta debe tener exactamente 3 opciones claras y distintas.
- Las opciones deben ser descriptivas y fáciles de imaginar visualmente.
- Los ids deben ser números secuenciales empezando en 1.

Estructura exacta requerida:
{
  "preguntas": [
    { "id": 1, "pregunta": "string", "opciones": ["string", "string", "string"] }
  ]
}`;

export async function generarPreguntasDiseno(
  proyectoNombre: string,
  ideaOriginal: string,
  respuestasEstrategia: Record<number, string>
): Promise<RespuestaDiseno> {
  try {
    const raw = await llamarOpenRouter(
      SYSTEM_PROMPT_DISENO,
      `Proyecto: "${proyectoNombre}"
Idea original: "${ideaOriginal}"
Contexto estratégico: ${JSON.stringify(respuestasEstrategia, null, 2)}`,
      MODEL_ESTRATEGIA
    );

    const parsed = parseJsonResponse<unknown>(raw);

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Respuesta inválida");
    }

    const respuesta = parsed as RespuestaDiseno;

    if (!Array.isArray(respuesta.preguntas) || respuesta.preguntas.length === 0) {
      throw new Error("Falta el array preguntas");
    }

    return respuesta;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al generar preguntas de diseño: ${error.message}`);
    }
    throw new Error("Error desconocido al generar preguntas de diseño");
  }
}
export type PreguntaMotores = {
  id: number;
  pregunta: string;
  opciones: [string, string, string];
};

export type RespuestaMotores = {
  preguntas: PreguntaMotores[];
};

const SYSTEM_PROMPT_MOTORES = `Sos PAITA, el orquestador de PALTA.

Tu tarea es generar preguntas sobre los motores técnicos de un producto digital basándote en su contexto completo.

EJES QUE DEBÉS CUBRIR:
1. Autenticación y usuarios
2. Almacenamiento de datos
3. Pagos y monetización
4. Integraciones externas necesarias
5. Escalabilidad inicial

REGLAS OBLIGATORIAS:
- Respondé ÚNICAMENTE con un objeto JSON válido, sin markdown, sin texto adicional.
- Generá entre 4 y 6 preguntas contextuales según el tipo de producto.
- Cada pregunta debe tener exactamente 3 opciones claras y técnicamente distintas.
- Los ids deben ser números secuenciales empezando en 1.
- No preguntes sobre algo que ya esté claro en el contexto estratégico.

Estructura exacta requerida:
{
  "preguntas": [
    { "id": 1, "pregunta": "string", "opciones": ["string", "string", "string"] }
  ]
}`;

export async function generarPreguntasMotores(
  proyectoNombre: string,
  ideaOriginal: string,
  respuestasEstrategia: Record<number, string>,
  respuestasDiseno: Record<number, string>
): Promise<RespuestaMotores> {
  try {
    const raw = await llamarOpenRouter(
      SYSTEM_PROMPT_MOTORES,
      `Proyecto: "${proyectoNombre}"
Idea original: "${ideaOriginal}"
Contexto estratégico: ${JSON.stringify(respuestasEstrategia, null, 2)}
Contexto de diseño: ${JSON.stringify(respuestasDiseno, null, 2)}`,
      MODEL_ESTRATEGIA
    );

    const parsed = parseJsonResponse<unknown>(raw);

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Respuesta inválida");
    }

    const respuesta = parsed as RespuestaMotores;

    if (!Array.isArray(respuesta.preguntas) || respuesta.preguntas.length === 0) {
      throw new Error("Falta el array preguntas");
    }

    return respuesta;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al generar preguntas de motores: ${error.message}`);
    }
    throw new Error("Error desconocido al generar preguntas de motores");
  }
}