import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, MessageCircle, ArrowLeftRight, Swords, Send } from "lucide-react";
import { VisitorUser } from "../data/gameData";

interface UserInteractionModalProps {
  user: VisitorUser;
  onClose: () => void;
  onDuel: (userId: string) => void;
}

type TabType = 'message' | 'trade' | 'duel';

export default function UserInteractionModal({ user, onClose, onDuel }: UserInteractionModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('message');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Array<{ from: string; text: string; timestamp: Date }>>([]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessages([...messages, {
        from: 'Tú',
        text: messageText,
        timestamp: new Date()
      }]);
      setMessageText('');

      // Simular respuesta automática del NPC
      setTimeout(() => {
        const responses = [
          "¡Hola! ¿Cómo estás?",
          "Interesante propuesta...",
          "Gracias por el mensaje.",
          "No tengo tiempo ahora, estoy ocupado.",
          "¡Nos vemos en el espacio!"
        ];
        setMessages(prev => [...prev, {
          from: user.username,
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        }]);
      }, 1500);
    }
  };

  const handleDuel = () => {
    onDuel(user.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="sw-panel sw-glow relative w-full max-w-2xl p-6"
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-red-400"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header con info del usuario */}
        <div className="mb-6 flex items-center gap-4 border-b border-slate-700 pb-4">
          <img
            src={user.avatar}
            alt={user.username}
            className="h-16 w-16 rounded-full border-2 border-amber-400"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-amber-400">
              {user.username}
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-cyan-400">Nivel {user.level}</span>
              <span className="text-slate-400">|</span>
              <span className="text-purple-400">{user.faction}</span>
              <span className="text-slate-400">|</span>
              <span
                className={
                  user.status === "in_combat"
                    ? "text-red-400"
                    : user.status === "trading"
                    ? "text-green-400"
                    : user.status === "exploring"
                    ? "text-cyan-400"
                    : "text-slate-400"
                }
              >
                {user.status === "in_combat"
                  ? "En combate"
                  : user.status === "trading"
                  ? "Comerciando"
                  : user.status === "exploring"
                  ? "Explorando"
                  : "Inactivo"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('message')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold uppercase tracking-wider transition-all ${
              activeTab === 'message'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            Mensaje
          </button>
          <button
            onClick={() => setActiveTab('trade')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold uppercase tracking-wider transition-all ${
              activeTab === 'trade'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <ArrowLeftRight className="h-5 w-5" />
            Intercambio
          </button>
          <button
            onClick={() => setActiveTab('duel')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold uppercase tracking-wider transition-all ${
              activeTab === 'duel'
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Swords className="h-5 w-5" />
            Duelo
          </button>
        </div>

        {/* Contenido según tab activo */}
        <AnimatePresence mode="wait">
          {activeTab === 'message' && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Chat de mensajes */}
              <div className="h-64 space-y-2 overflow-y-auto rounded-lg bg-slate-900/50 p-4">
                {messages.length === 0 ? (
                  <p className="text-center text-sm text-slate-500">
                    No hay mensajes. Inicia la conversación.
                  </p>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-3 ${
                        msg.from === 'Tú'
                          ? 'ml-auto max-w-[80%] bg-cyan-600/30 text-right'
                          : 'mr-auto max-w-[80%] bg-slate-700/50'
                      }`}
                    >
                      <p className="text-xs font-bold text-amber-400">{msg.from}</p>
                      <p className="text-sm text-slate-200">{msg.text}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Input de mensaje */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="sw-button-cyan flex items-center gap-2 px-6 py-2"
                >
                  <Send className="h-5 w-5" />
                  Enviar
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'trade' && (
            <motion.div
              key="trade"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="rounded-lg bg-slate-900/50 p-6">
                <h3 className="mb-4 text-lg font-bold uppercase text-green-400">
                  Sistema de Intercambio
                </h3>

                {/* Tus items */}
                <div className="mb-4">
                  <p className="mb-2 text-sm font-bold text-amber-400">Tus Items:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="cursor-pointer rounded-lg border-2 border-slate-600 bg-slate-800 p-4 text-center transition-all hover:border-green-400 hover:bg-slate-700"
                      >
                        <div className="mb-2 text-2xl">📦</div>
                        <p className="text-xs text-slate-400">Item {item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items del otro jugador */}
                <div className="mb-4">
                  <p className="mb-2 text-sm font-bold text-amber-400">
                    Items de {user.username}:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="cursor-pointer rounded-lg border-2 border-slate-600 bg-slate-800 p-4 text-center transition-all hover:border-green-400 hover:bg-slate-700"
                      >
                        <div className="mb-2 text-2xl">🎁</div>
                        <p className="text-xs text-slate-400">Item {item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de intercambio */}
                <button className="sw-button-green w-full py-3 font-bold uppercase">
                  Proponer Intercambio
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'duel' && (
            <motion.div
              key="duel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="rounded-lg border-2 border-red-500 bg-slate-900/50 p-6">
                <div className="mb-6 text-center">
                  <Swords className="mx-auto mb-4 h-16 w-16 text-red-400" />
                  <h3 className="mb-2 text-2xl font-bold uppercase text-red-400">
                    Desafío a Duelo
                  </h3>
                  <p className="text-sm text-slate-400">
                    Reta a {user.username} a un combate jugador vs jugador
                  </p>
                </div>

                {/* Advertencia */}
                <div className="mb-6 rounded-lg bg-red-900/20 p-4">
                  <p className="mb-2 text-sm font-bold text-red-400">⚠️ Advertencia:</p>
                  <ul className="space-y-1 text-xs text-slate-300">
                    <li>• El duelo será un combate honesto sin intervención</li>
                    <li>• El ganador puede recibir recompensas del perdedor</li>
                    <li>• Ambos jugadores deben aceptar el desafío</li>
                    <li>• No se puede huir una vez iniciado el duelo</li>
                  </ul>
                </div>

                {/* Stats comparison */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-cyan-900/20 p-4">
                    <p className="mb-2 text-center font-bold text-cyan-400">Tú</p>
                    <div className="space-y-1 text-xs text-slate-300">
                      <p>⚔️ Ataque: 50</p>
                      <p>🛡️ Defensa: 40</p>
                      <p>❤️ Salud: 100</p>
                      <p>⚡ Agilidad: 35</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-red-900/20 p-4">
                    <p className="mb-2 text-center font-bold text-red-400">
                      {user.username}
                    </p>
                    <div className="space-y-1 text-xs text-slate-300">
                      <p>⚔️ Ataque: {user.level * 2 + 30}</p>
                      <p>🛡️ Defensa: {user.level * 2 + 20}</p>
                      <p>❤️ Salud: {user.level * 5 + 50}</p>
                      <p>⚡ Agilidad: {user.level + 25}</p>
                    </div>
                  </div>
                </div>

                {/* Botón de desafío */}
                <button
                  onClick={handleDuel}
                  className="sw-button w-full bg-red-600 py-3 font-bold uppercase tracking-wider text-white shadow-lg shadow-red-500/50 transition-all hover:bg-red-700 hover:shadow-red-500/70"
                >
                  🗡️ Iniciar Duelo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
