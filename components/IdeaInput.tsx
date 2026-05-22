type IdeaInputProps = {
  ideaOriginal: string;
  onIdeaChange: (value: string) => void;
  onAlimentar: () => void;
};

export default function IdeaInput({
  ideaOriginal,
  onIdeaChange,
  onAlimentar,
}: IdeaInputProps) {
  return (
    <div className="w-full space-y-6 text-center transition-all duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent pb-1">
          ¿Qué querés fabricar hoy?
        </h1>
        <p className="text-neutral-400 max-w-md mx-auto text-sm">
          Colocá tu idea de forma vaga o abstracta. La impresora modular de Palta se calibrará según lo que pidas.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full bg-neutral-900/60 p-4 rounded-xl border border-neutral-800/80 shadow-2xl backdrop-blur-sm">
        <textarea
          value={ideaOriginal}
          onChange={(e) => onIdeaChange(e.target.value)}
          placeholder="Ej: una app mobile para alquilar canchas de fútbol con amigos los viernes..."
          className="w-full bg-neutral-950 border border-neutral-800/80 rounded-lg p-3 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 min-h-[110px] resize-none transition-all placeholder:text-neutral-600"
        />
        <button
          disabled={!ideaOriginal.trim()}
          onClick={onAlimentar}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-black font-bold py-3 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:scale-[1.01]"
        >
          🥑 Generar
        </button>
      </div>
    </div>
  );
}
