import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { buildings, npcs, sectors } from "../data/gameData";
import { ArrowLeft, MessageCircle, ScrollText, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import PlayerHUD from "./PlayerHUD";

export default function BuildingView() {
  const { systemId, bodyId, sectorId, buildingId } = useParams<{
    systemId: string;
    bodyId: string;
    sectorId: string;
    buildingId: string;
  }>();
  const navigate = useNavigate();
  const [selectedNPC, setSelectedNPC] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dialogue' | 'missions' | 'shop'>('dialogue');
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

  const building = Object.values(buildings)
    .flat()
    .find((b) => b.id === buildingId);

  const sector = Object.values(sectors)
    .flat()
    .find((s) => s.id === sectorId);

  const buildingNPCs = npcs[buildingId || ""] || [];
  const selectedNPCData = buildingNPCs.find((npc) => npc.id === selectedNPC);

  const IconComponent = building ? ((LucideIcons as any)[building.icon] || LucideIcons.Building) : LucideIcons.Building;

  if (!building) {
    return <div>Edificio no encontrado</div>;
  }

  const nextDialogue = () => {
    if (selectedNPCData && currentDialogueIndex < selectedNPCData.dialogue.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
    } else {
      setCurrentDialogueIndex(0);
    }
  };

  return (
    <div className="relative size-full overflow-hidden">
      {/* HUD del jugador */}
      <PlayerHUD />

      {/* Fondo de interior futurista */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1662049262033-9a24a3303b00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBpbnRlcmlvciUyMGJhciUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzcyMzEzMDI5fDA&ixlib=rb-4.1.0&q=80&w=1080')`,
        }}
      />
      
      {/* Overlay oscuro */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(2, 6, 23, 0.95))`,
        }}
      />

      {/* Patrón de grid sutil */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

      {/* Botón volver */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(`/system/${systemId}/body/${bodyId}/sector/${sectorId}`)}
        className="sw-button absolute left-8 top-8 z-20 flex items-center gap-2 px-4 py-2"
      >
        <ArrowLeft className="h-5 w-5" />
        Salir
      </motion.button>

      {/* Información del edificio */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="sw-panel sw-glow absolute right-8 top-8 z-20 p-4"
      >
        <div className="flex items-center gap-3">
          <div
            className="rounded-full p-2 sw-glow"
            style={{
              backgroundColor: sector ? `${sector.color}40` : '#334155',
            }}
          >
            <IconComponent className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide text-amber-400">{building.name}</h2>
            <p className="text-sm uppercase tracking-wider text-amber-300/70">{building.type}</p>
          </div>
        </div>
      </motion.div>

      {/* NPCs en el edificio */}
      <div className="flex size-full items-center justify-center p-8 pt-32">
        {buildingNPCs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center backdrop-blur-sm"
          >
            <p className="text-lg text-slate-300">
              No hay NPCs disponibles en este edificio actualmente.
            </p>
          </motion.div>
        ) : (
          <div className="grid w-full max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {buildingNPCs.map((npc, index) => (
              <motion.div
                key={npc.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSelectedNPC(npc.id);
                  setCurrentDialogueIndex(0);
                }}
                className="sw-card sw-glow cursor-pointer p-6 transition-all hover:sw-glow"
              >
                {/* Avatar del NPC */}
                <div className="mb-4 flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-3xl font-bold uppercase text-black shadow-lg sw-glow">
                    {npc.name.charAt(0)}
                  </div>
                </div>

                {/* Información del NPC */}
                <h3 className="mb-2 text-center text-xl font-bold uppercase tracking-wide text-amber-400">
                  {npc.name}
                </h3>
                <p className="mb-4 text-center text-sm uppercase tracking-wider text-amber-300/70">{npc.role}</p>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-2">
                  {npc.missions.length > 0 && (
                    <span className="flex items-center gap-1 rounded-full border border-yellow-500 bg-yellow-600/20 px-3 py-1 text-xs uppercase tracking-wider text-yellow-400">
                      <ScrollText className="h-3 w-3" />
                      {npc.missions.length} Misiones
                    </span>
                  )}
                  {npc.items.length > 0 && (
                    <span className="flex items-center gap-1 rounded-full border border-green-500 bg-green-600/20 px-3 py-1 text-xs uppercase tracking-wider text-green-400">
                      <ShoppingBag className="h-3 w-3" />
                      {npc.items.length} Objetos
                    </span>
                  )}
                </div>

                {/* Botón de interacción */}
                <div className="mt-4 flex justify-center">
                  <button className="sw-button-cyan flex items-center gap-2 px-4 py-2 text-sm">
                    <MessageCircle className="h-4 w-4" />
                    Hablar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de diálogo con NPC */}
      <AnimatePresence>
        {selectedNPC && selectedNPCData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedNPC(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-2xl border-2 border-cyan-500/50 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl"
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setSelectedNPC(null)}
                className="absolute right-4 top-4 rounded-full bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header del NPC */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg">
                  {selectedNPCData.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedNPCData.name}
                  </h2>
                  <p className="text-cyan-400">{selectedNPCData.role}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6 flex gap-2 border-b border-slate-700">
                <button
                  onClick={() => setActiveTab('dialogue')}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                    activeTab === 'dialogue'
                      ? 'border-b-2 border-cyan-500 text-cyan-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  Diálogo
                </button>
                <button
                  onClick={() => setActiveTab('missions')}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                    activeTab === 'missions'
                      ? 'border-b-2 border-cyan-500 text-cyan-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <ScrollText className="h-4 w-4" />
                  Misiones ({selectedNPCData.missions.length})
                </button>
                <button
                  onClick={() => setActiveTab('shop')}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                    activeTab === 'shop'
                      ? 'border-b-2 border-cyan-500 text-cyan-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Tienda ({selectedNPCData.items.length})
                </button>
              </div>

              {/* Contenido de las tabs */}
              <div className="min-h-[300px]">
                {activeTab === 'dialogue' && (
                  <motion.div
                    key="dialogue"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="rounded-lg bg-slate-800/50 p-6">
                      <p className="text-lg text-white">
                        {selectedNPCData.dialogue[currentDialogueIndex]}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        {currentDialogueIndex + 1} / {selectedNPCData.dialogue.length}
                      </span>
                      <button
                        onClick={nextDialogue}
                        className="rounded-lg bg-cyan-600 px-6 py-2 text-white transition-colors hover:bg-cyan-500"
                      >
                        {currentDialogueIndex < selectedNPCData.dialogue.length - 1
                          ? 'Siguiente'
                          : 'Reiniciar'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'missions' && (
                  <motion.div
                    key="missions"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    {selectedNPCData.missions.length === 0 ? (
                      <div className="rounded-lg bg-slate-800/50 p-6 text-center">
                        <p className="text-slate-400">
                          Este NPC no tiene misiones disponibles actualmente.
                        </p>
                      </div>
                    ) : (
                      selectedNPCData.missions.map((mission) => (
                        <div
                          key={mission.id}
                          className="rounded-lg border border-yellow-500/30 bg-slate-800/50 p-6"
                        >
                          <h3 className="mb-2 text-xl font-bold text-yellow-400">
                            {mission.title}
                          </h3>
                          <p className="mb-3 text-slate-300">{mission.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-green-400">
                              Recompensa: {mission.reward}
                            </span>
                            <button className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-yellow-500">
                              Aceptar Misión
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'shop' && (
                  <motion.div
                    key="shop"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    {selectedNPCData.items.length === 0 ? (
                      <div className="rounded-lg bg-slate-800/50 p-6 text-center">
                        <p className="text-slate-400">
                          Este NPC no tiene objetos para vender actualmente.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {selectedNPCData.items.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg border border-green-500/30 bg-slate-800/50 p-4"
                          >
                            <div className="mb-2 flex items-start justify-between">
                              <h3 className="font-bold text-white">{item.name}</h3>
                              <span className="rounded bg-green-600 px-2 py-1 text-sm font-bold text-white">
                                {item.price} cr
                              </span>
                            </div>
                            <p className="mb-3 text-sm text-slate-400">
                              {item.description}
                            </p>
                            <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-500">
                              Comprar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}