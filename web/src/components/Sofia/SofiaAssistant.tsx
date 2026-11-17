import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  Bot,
  ChevronRight,
  CircleAlert,
  LoaderCircle,
  Send,
  Sparkles,
  Trash2,
  UserRound,
  Wifi,
} from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
type MessageRole = "user" | "sofia";
interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}
const INITIAL_MESSAGE: ChatMessage = {
  id: "sofia-welcome",
  role: "sofia",
  content:
    "No vine a decirte quiÃ©n eres. Vine a mostrarte cÃ³mo lees el juego.\n\nSoy Sof.IA, tu Sistema de OrientaciÃ³n y Flujo Inteligente. Â¿QuÃ© nodo del universo MagnopVS exploramos hoy?",
  timestamp: new Date().toISOString(),
};
function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export const SofiaAssistant: React.FC = () => {
  const { player, quests, inventory, creatures } = usePlayer();
  const [messages, setMessages] = useState<ChatMessage[]>([
    INITIAL_MESSAGE,
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [connectionState, setConnectionState] = useState<
    "idle" | "connected" | "error"
  >("idle");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);
  const sendMessage = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    const previousMessages = messages.filter(
      (message) => message.id !== "sofia-welcome"
    );
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/sofia/chat", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: previousMessages.slice(-6).map((message) => ({
            role: message.role === "user" ? "user" : "model",
            content: message.content,
          })),
          playerContext: {
            name: player.name,
            level: player.level,
            faction: player.faction,
            magnoPoints: player.magnoPoints,
            title: player.title,
            currentXp: player.currentXp,
            maxXp: player.maxXp,
            stats: player.stats,
          },
          gameContext: {
            quests: quests.slice(0, 20).map((q) => ({
              id: q.id,
              title: q.title,
              description: q.description,
              type: q.type,
              xpReward: q.xpReward,
              mpReward: q.mpReward,
              target: q.target,
              current: q.current,
              isCompleted: q.isCompleted,
              isClaimed: q.isClaimed,
            })),
            inventory: inventory.slice(0, 30).map((item) => ({
              name: item.name,
              category: item.category,
              rarity: item.rarity,
              description: item.description,
              powerValue: item.powerValue,
              quantity: item.quantity,
            })),
            creatures: creatures.slice(0, 20).map((creature) => ({
              name: creature.name,
              species: creature.species,
              rarity: creature.rarity,
              element: creature.element,
              level: creature.level,
              hunger: creature.hunger,
              affinity: creature.affinity,
              description: creature.description,
              isEgg: creature.isEgg,
              hatchProgress: creature.hatchProgress,
            })),
          },
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : typeof data.reply === "string"
              ? data.reply
              : `El servidor respondiÃ³ con el cÃ³digo ${response.status}.`
        );
      }
      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("El servidor no devolviÃ³ una respuesta vÃ¡lida.");
      }
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-sofia`,
          role: "sofia",
          content: data.reply,
          timestamp: new Date().toISOString(),
        },
      ]);
      setConnectionState("connected");
    } catch (caught) {
      const message =
        caught instanceof TypeError
          ? "No se pudo contactar con el servidor. Comprueba que MagnopVS estÃ© ejecutÃ¡ndose."
          : caught instanceof Error
            ? caught.message
            : "Se interrumpiÃ³ la comunicaciÃ³n con SOF.IA.";
      setError(message);
      setConnectionState("error");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };
  const clearConversation = () => {
    if (isLoading) return;
    setMessages([
      {
        ...INITIAL_MESSAGE,
        timestamp: new Date().toISOString(),
      },
    ]);
    setError("");
    setConnectionState("idle");
  };
  const suggestions = [
    "Â¿CÃ³mo empiezo mi aventura?",
    "ExplÃ­came las Matrices Quantvm",
    "AyÃºdame a organizar una misiÃ³n",
  ];
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#0a0b10]/90 shadow-[0_0_35px_rgba(0,114,255,0.08)]">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-400/10 text-cyan-200 shadow-[0_0_22px_rgba(0,240,255,0.12)]">
              <Bot size={30} />
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#0a0b10] bg-emerald-400" />
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-[0.28em] text-cyan-300">
                MAGNOPVS // INTELLIGENCE
              </p>
              <h1 className="text-2xl font-bold tracking-wide text-white sm:text-3xl">
                SOF.IA
              </h1>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Sistema de OrientaciÃ³n y Flujo Inteligente
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <p className="text-[9px] tracking-widest text-slate-500">OPERADOR</p>
              <p className="mt-1 max-w-36 truncate text-xs text-slate-200">
                {player.name}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <p className="text-[9px] tracking-widest text-slate-500">NIVEL</p>
              <p className="mt-1 text-xs text-cyan-200">{player.level}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <p className="text-[9px] tracking-widest text-slate-500">MAGNOPOINTS</p>
              <p className="mt-1 text-xs text-fuchsia-200">
                {player.magnoPoints.toLocaleString()} MP
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] bg-black/20 px-5 py-3">
          <div className="flex items-center gap-2 text-[10px] tracking-wider text-slate-400">
            <Activity size={14} className="text-cyan-300" />
            <span>NUCLEO DE ORIENTACIÃ“N</span>
            <ChevronRight size={12} />
            <span className="text-slate-300">CHAT</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            {connectionState === "connected" ? (
              <>
                <Wifi size={13} className="text-emerald-400" />
                <span className="text-emerald-300">Respuesta recibida</span>
              </>
            ) : connectionState === "error" ? (
              <>
                <CircleAlert size={13} className="text-amber-300" />
                <span className="text-amber-200">Enlace con incidencias</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-cyan-300/70" />
                <span className="text-slate-400">En espera de transmisiÃ³n</span>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#090b12]/95 shadow-[0_0_40px_rgba(0,114,255,0.07)]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-300" />
            <span className="text-xs font-semibold tracking-widest text-slate-200">
              CANAL PRIVADO // SOF.IA
            </span>
          </div>
          <button
            type="button"
            onClick={clearConversation}
            disabled={isLoading}
            title="Limpiar conversaciÃ³n"
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[10px] text-slate-400 transition hover:border-fuchsia-300/40 hover:text-fuchsia-200 disabled:opacity-40"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">REINICIAR</span>
          </button>
        </div>
        <div
          className="flex min-h-[340px] max-h-[55vh] flex-col gap-5 overflow-y-auto p-4 sm:min-h-[420px] sm:p-6"
          aria-live="polite"
          aria-label="Historial de conversaciÃ³n con SOF.IA"
        >
          {messages.map((message) => (
            <article
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  message.role === "sofia"
                    ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
                    : "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-200"
                }`}
              >
                {message.role === "sofia" ? (
                  <Bot size={18} />
                ) : (
                  <UserRound size={18} />
                )}
              </div>
              <div
                className={`min-w-0 max-w-[88%] sm:max-w-[80%] ${
                  message.role === "user" ? "text-right" : ""
                }`}
              >
                <div className="mb-1.5 flex items-center gap-2 text-[10px] text-slate-500">
                  {message.role === "user" ? (
                    <>
                      <span>{formatTime(message.timestamp)}</span>
                      <span className="font-semibold text-fuchsia-200">
                        {player.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold tracking-wider text-cyan-200">
                        SOF.IA
                      </span>
                      <span>{formatTime(message.timestamp)}</span>
                    </>
                  )}
                </div>
                <div
                  className={`rounded-2xl border px-4 py-3 text-left text-sm leading-7 [overflow-wrap:anywhere] ${
                    message.role === "sofia"
                      ? "rounded-tl-sm border-cyan-300/15 bg-cyan-300/[0.045] text-slate-200"
                      : "rounded-tr-sm border-fuchsia-300/15 bg-fuchsia-300/[0.05] text-slate-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </article>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3" role="status">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                <Bot size={18} />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04] px-4 py-3 text-xs text-cyan-100">
                <LoaderCircle size={15} className="animate-spin" />
                Sof.IA estÃ¡ procesando la transmisiÃ³nâ€¦
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {messages.length === 1 && !isLoading && (
          <div className="border-t border-white/[0.06] px-4 py-4 sm:px-6">
            <p className="mb-3 text-[10px] tracking-widest text-slate-500">
              INICIAR UNA RUTA DE EXPLORACIÃ“N
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04] px-3 py-2 text-left text-[11px] leading-relaxed text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-100"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        <form
          onSubmit={sendMessage}
          className="border-t border-cyan-300/15 bg-black/25 p-3 sm:p-5"
        >
          {error && (
            <div
              role="alert"
              className="mb-3 flex items-start gap-2 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-3 text-xs leading-relaxed text-amber-100"
            >
              <CircleAlert size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-[#05060a] p-2 transition focus-within:border-cyan-300/40 focus-within:shadow-[0_0_18px_rgba(0,240,255,0.07)]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Escribe tu seÃ±al para SOF.IAâ€¦"
              aria-label="Mensaje para SOF.IA"
              rows={2}
              maxLength={4000}
              disabled={isLoading}
              className="max-h-36 min-h-[48px] flex-1 resize-y bg-transparent px-3 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-slate-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300 text-[#05060a] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Enviar mensaje"
              title="Enviar mensaje"
            >
              {isLoading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-[9px] tracking-wide text-slate-600">
            <span>ENTER PARA ENVIAR Â· SHIFT + ENTER PARA SALTO DE LÃNEA</span>
            <span>{input.length}/4000</span>
          </div>
        </form>
      </div>
      <footer className="mt-4 px-1 text-center text-[10px] leading-relaxed text-slate-600">
        SOF.IA // MAGNOPVS Â· Las respuestas de IA pueden contener errores.
        Verifica la informaciÃ³n importante.
      </footer>
    </section>
  );
};
