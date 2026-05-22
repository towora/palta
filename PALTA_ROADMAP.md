# ROADMAP MAESTRO: PALTA DEMO v1.0 ([Localhost](http://Localhost))

**Visión de la Demo:** Crear un flujo lineal por pasos (Pestañas/Fases) donde el usuario entra con una idea vaga y sale con un prototipo visual interactivo y funcional simulado, usando un sistema interactivo de barras de carga y preguntas dinámicas en JSON.

## 🎯 OBJETIVOS DE LA DEMO

1. **Fricción Cero:** Reemplazar el chat tradicional por un flujo de cuestionario dinámico (*multiple-choice*) animado.
2. **Estructura Modular:** Limpiar el `page.tsx` actual y modularizar la arquitectura de React.
3. **Control Total por JSON:** Hacer que la IA devuelva estructuras de datos, no texto libre.
4. **Validación del Enfoque "Impresora":** Demostrar que se puede ir desde la estrategia hasta la simulación visual sin escribir código manualmente.

## 🗺️ PASO A PASO: EL ROADMAP DE EJECUCIÓN

### 🏗️ FASE 1: REFACTOR Y ARQUITECTURA MODULAR (Limpieza de Casa)

*El objetivo es destruir el archivo único y preparar los contenedores donde van a vivir las animaciones y las pestañas.*

- **Paso 1.1: Creación del Layout base de Pasos**
  - Definir un estado global de navegación: `const [currentPhase, setCurrentPhase] = useState('estrategia' | 'diseño' | 'motores' | 'imprimir')`.
  - Diseñar una barra superior (Stepper) fija que muestre visualmente en qué fase del desarrollo está la "impresora digital".
- **Paso 1.2: Modularización de Componentes (**`/components`**)**
  - `Sidebar.tsx`: Controlar el historial local.
  - `ProgressBar.tsx`: Componente reutilizable con Tailwind para animar la carga (ej. `transition-all duration-500 ease-out`).
  - `QuestionCard.tsx`: Tarjeta animada que renderizará la pregunta del momento y sus opciones en botones.
- **Herramientas de apoyo:** Next.js 15+, Tailwind CSS, Lucide React (iconos), Framer Motion (opcional para transiciones ultrasuaves, aunque con Tailwind transitions alcanza).

### 🧠 FASE 2: EL MOTOR COGNITIVO (Fase Estrategia)

*El usuario introduce una idea vaga y la IA genera el cuestionario dinámico en JSON.*

- **Paso 2.1: El Prompt de Generación de Preguntas (System Prompt)**
  - Configurar la llamada a OpenRouter (DeepSeek/OpenAI) para que obligatoriamente devuelva un objeto estructurado.
  - *Formato deseado del output IA:*
    JSON
    ```
    {
      "proyecto_nombre": "Nombre sugerido",
      "preguntas": [
        { "id": 1, "pregunta": "¿Cuál es tu target?", "opciones": ["B2B", "B2C", "Nicho"] },
        { "id": 2, "pregunta": "¿Forma de monetizar?", "opciones": ["Suscripción", "Un pago", "Gratis"] }
      ]
    }

    ```
- **Paso 2.2: Lógica de Progreso y Guardado Temporal**
  - Mapear las preguntas recibidas en un array en el estado.
  - Cada vez que el usuario clickea una opción:
    1. Guardar la respuesta en un objeto de contexto (`respuestasEstrategia`).
    2. Avanzar el índice: `setStep(prev => prev + 1)`.
    3. Calcular el porcentaje de la barra de carga: `(currentStep / totalPreguntas) * 100`.
- **Paso 2.3: Render de Resultados Estratégicos**
  - Al llegar al 100%, enviar la idea original + las respuestas elegidas a la IA para que devuelva el "Plano Técnico" estructurado.
  - Mostrar el plano en pantalla de forma ordenada y limpia con un botón grande: **"Aprobar Planos e Ir a Diseño Visual"**.

### 🎨 FASE 3: EL CHASIS VISUAL (Fase Diseño de Interfaz)

*Acá simulamos la creación de la UI mediante un segundo set de preguntas interactivas.*

- **Paso 3.1: Configuración Estética (El segundo cuestionario)**
  - Cuando el usuario pasa a esta fase, la IA lee el plan aprobado y genera preguntas de diseño contextuales.
  - *Ejemplo:* Si el proyecto es una app de cocina: ¿Qué paleta de colores preferís? `["Cálidos/Orgánicos", "Minimalista Oscuro", "Pasteles modernos"]`. Estilo de botones: `["Redondeados/Modernos", "Cuadrados/Sólidos"]`.
- **Paso 3.2: El Preview Visual Simulado (La Magia)**
  - *Para la DEMO en localhost:* En lugar de conectarte a APIs complejas como Stitch.ai o v0 el primer día, vas a simularlo con componentes reactivos dinámicos.
  - Crear un contenedor estilo "Iframe/Pantalla de celular" en el frontend.
  - Hacer que ese contenedor cambie sus estilos de Tailwind dinámicamente según las opciones elegidas por el usuario (si eligió "Oscuro", el fondo del preview pasa a `bg-neutral-900`, si eligió botones "Redondeados", aplica `rounded-full`).
  - Esto le da al usuario la sensación inmediata de que **Palta está imprimiendo y alterando el diseño en tiempo real**.

### ⚙️ FASE 4: MOTORES Y DATOS (Fase Backend)

*Definir las entrañas operativas del proyecto.*

- **Paso 4.1: Interrogatorio de Funcionalidades y Datos**
  - Preguntas automáticas guiadas: ¿Necesitás login de usuarios? ¿Es necesario cobrar suscripciones?
- **Paso 4.2: Output del "Blueprint de Código"**
  - La IA procesa todo y genera en bloques de código limpios (Markdown estructurado):
    1. El esquema de base de datos (SQL para Supabase).
    2. La estructura de carpetas sugerida para su backend.
    3. Configuración de API clave (ej. Stripe o Mercado Pago).

### 🚀 FASE 5: EL BOTÓN DE IMPRESIÓN (Simulación de Deploy)

*La culminación de la experiencia de la impresora digital.*

- **Paso 5.1: La animación de compilación**
  - Al hacer clic en **"Imprimir Proyecto (Deploy)"**, bloquear la pantalla con un overlay elegante.
  - Mostrar mensajes dinámicos secuenciales simulando una terminal:
    - `> Leyendo planos estratégicos... OK`
    - `> Compilando interfaz visual y componentes... OK`
    - `> Estructurando motores de base de datos... OK`
    - `> Desplegando en la nube...`
- **Paso 5.2: Entrega del Producto Vivo**
  - Mostrar un modal de éxito con confeti o animaciones suaves.
  - Entregar un link simulado (ej: `https://tu-proyecto.palta.dev`) que dentro de tu localhost simplemente abra el preview visual expandido que se configuró en la Fase 3.
  - Opción de "Descargar código fuente" (un archivo `.zip` simulado o generado con la estructura del proyecto).



PROMPT DE CONTEXTO Y CO-PILOTO TÉCNICO — PROYECTO: PALTA

Eres un Ingeniero de Software Senior experto en Next.js, TypeScript, Tailwind CSS y arquitecturas impulsadas por Inteligencia Artificial. Tu objetivo es ayudarme a construir la DEMO v1.0 de PALTA en mi entorno [localhost](http://localhost).

[VISIÓN DE PALTA]

Palta no es un chatbot tradicional. Es una "Impresora 3D Digital". El usuario ingresa una idea vaga y, mediante un flujo guiado interactivo de preguntas de opción múltiple (Fases), co-crea un producto digital funcional con la IA.

[ESTRUCTURA DE PASOS DE LA DEMO ACTUAL]

Fase 1: Estrategia (Idea vaga -> Preguntas Choice dinámicas en JSON -> Plan Técnico aprobado).

Fase 2: Diseño Visual (Elección de estilos por Choice -> Preview dinámico interactivo en pantalla).

Fase 3: Motores (Configuración de datos/pagos -> Entrega de esquemas).

Fase 4: Imprimir (Animación de terminal de despliegue -> Link final del MVP).

[REGLAS TÉCNICAS OBLIGATORIAS]

1. ENFOQUE MODULAR: Todo el código debe estar modularizado. Divide las responsabilidades en componentes pequeños dentro de la carpeta /components. No satures page.tsx.

2. COMUNICACIÓN POR JSON: Cuando diseñemos prompts para los modelos de Palta (OpenRouter/DeepSeek), estructura siempre las respuestas mediante objetos JSON limpios (response_format) para evitar texto plano corrupto o strings difíciles de parsear por el frontend.

3. UI EXCELENTE: Usa clases de Tailwind CSS elegantes, diseño oscuro, transiciones ultrasuaves (duration-500, ease-out), componentes interactivos con feedback visual inmediato (hover, active, barras de progreso dinámicas).

4. PASO A PASO REALISTA: Enfócate en soluciones funcionales locales. Prioriza el uso de localStorage para el estado persistente de la demo actual antes de migrar a Supabase/Airtable en el producto final.

Actualmente estoy trabajando en este proyecto. Cuando te pida código o asistencia, pregúntame en qué Fase y Paso específico del roadmap nos encontramos y escribe el código respetando estrictamente estas directrices.

