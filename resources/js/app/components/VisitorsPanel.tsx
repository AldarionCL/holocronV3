import { motion, AnimatePresence } from "motion/react";
import { Users, Activity, Swords, ShoppingCart, ChevronRight, ChevronLeft } from "lucide-react";
import { VisitorUser } from "../data/gameData";
import { useState } from "react";
import UserInteractionModal from "./UserInteractionModal";
import PvPDuelEncounter from "./PvPDuelEncounter";

interface VisitorsPanelProps {
  visitors: VisitorUser[];
  sectorName: string;
}

export default function VisitorsPanel({ visitors, sectorName }: VisitorsPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedUser, setSelectedUser] = useState<VisitorUser | null>(null);
  const [showDuel, setShowDuel] = useState(false);
  const [duelOpponent, setDuelOpponent] = useState<VisitorUser | null>(null);
  const getStatusIcon = (status: VisitorUser['status']) => {
    switch (status) {
      case 'in_combat':
        return <Swords className="w-3 h-3" />;
      case 'trading':
        return <ShoppingCart className="w-3 h-3" />;
      case 'exploring':
        return <Activity className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: VisitorUser['status']) => {
    switch (status) {
      case 'in_combat':
        return 'text-red-400 bg-red-500/20';
      case 'trading':
        return 'text-green-400 bg-green-500/20';
      case 'exploring':
        return 'text-cyan-400 bg-cyan-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getStatusText = (status: VisitorUser['status']) => {
    switch (status) {
      case 'in_combat':
        return 'En combate';
      case 'trading':
        return 'Comerciando';
      case 'exploring':
        return 'Explorando';
      default:
        return 'Inactivo';
    }
  };

  // Contar usuarios por estado
  const statusCounts = visitors.reduce((acc, visitor) => {
    acc[visitor.status] = (acc[visitor.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleUserClick = (visitor: VisitorUser) => {
    setSelectedUser(visitor);
  };

  const handleDuel = (userId: string) => {
    const opponent = visitors.find(v => v.id === userId);
    if (opponent) {
      setDuelOpponent(opponent);
      setShowDuel(true);
    }
  };

  const handleDuelComplete = (playerWon: boolean) => {
    setShowDuel(false);
    setDuelOpponent(null);
  };

  return (
    <div className="absolute right-8 bottom-8 z-20">
      {/* Botón de colapsar/expandir - FUERA del panel */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-10 top-3 bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-l-lg shadow-lg z-50 transition-all border-2 border-cyan-400"
        style={{
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
        }}
      >
        {isCollapsed ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>

      {/* Panel de visitantes */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{
          opacity: 1,
          x: 0,
          width: isCollapsed ? 'auto' : '20rem'
        }}
        transition={{ duration: 0.3 }}
        className="sw-panel sw-glow-cyan max-h-96 overflow-hidden"
      >

      <AnimatePresence mode="wait">
        {isCollapsed ? (
          /* Vista Colapsada - Solo iconos y números */
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-3"
          >
            {/* Header compacto */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-cyan-500/30">
              <Users className="w-5 h-5 text-cyan-400 sw-glow-cyan" />
              <span className="text-lg font-bold text-cyan-400">{visitors.length}</span>
            </div>

            {/* Iconos de estado con contadores */}
            <div className="space-y-2">
              {statusCounts.in_combat !== undefined && statusCounts.in_combat > 0 && (
                <div className="flex items-center gap-2 bg-red-500/20 rounded p-2">
                  <Swords className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-red-400">
                    {statusCounts.in_combat}
                  </span>
                </div>
              )}

              {statusCounts.trading !== undefined && statusCounts.trading > 0 && (
                <div className="flex items-center gap-2 bg-green-500/20 rounded p-2">
                  <ShoppingCart className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-green-400">
                    {statusCounts.trading}
                  </span>
                </div>
              )}

              {statusCounts.exploring !== undefined && statusCounts.exploring > 0 && (
                <div className="flex items-center gap-2 bg-cyan-500/20 rounded p-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-400">
                    {statusCounts.exploring}
                  </span>
                </div>
              )}

              {statusCounts.idle !== undefined && statusCounts.idle > 0 && (
                <div className="flex items-center gap-2 bg-slate-500/20 rounded p-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-400">
                    {statusCounts.idle}
                  </span>
                </div>
              )}
            </div>

            {/* Indicador de actualización */}
            <div className="mt-3 pt-2 border-t border-cyan-500/30">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse mx-auto" />
            </div>
          </motion.div>
        ) : (
          /* Vista Expandida - Completa */
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-cyan-500/30 p-3 bg-slate-900/50">
              <Users className="w-5 h-5 text-cyan-400 sw-glow-cyan" />
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                  Usuarios en Zona
                </h3>
                <p className="text-xs text-slate-400">
                  {visitors.length} visitante{visitors.length !== 1 ? 's' : ''} en {sectorName}
                </p>
              </div>
            </div>

            {/* Lista de visitantes */}
            <div className="overflow-y-auto max-h-80 p-2">
              <div className="grid grid-cols-2 gap-2">
                {visitors.map((visitor, index) => (
                  <motion.div
                    key={visitor.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="group cursor-pointer"
                    onClick={() => handleUserClick(visitor)}
                  >
                    <div className="relative bg-slate-800/50 rounded-lg border border-slate-700 p-2 transition-all hover:border-cyan-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-cyan-500/20">
                      {/* Avatar */}
                      <div className="relative mb-2">
                        <div className="w-full aspect-square rounded-md overflow-hidden bg-slate-900 border border-slate-600">
                          <img
                            src={visitor.avatar}
                            alt={visitor.username}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Badge de nivel */}
                        <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-slate-900">
                          {visitor.level}
                        </div>

                        {/* Indicador de estado */}
                        <div className={`absolute -bottom-1 -right-1 ${getStatusColor(visitor.status)} rounded-full p-1 border-2 border-slate-900`}>
                          {getStatusIcon(visitor.status)}
                        </div>
                      </div>

                      {/* Info del usuario */}
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-white truncate">
                          {visitor.username}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 truncate">
                            {visitor.faction}
                          </span>
                        </div>
                        <div className={`text-xs ${getStatusColor(visitor.status).split(' ')[0]} flex items-center gap-1`}>
                          {getStatusIcon(visitor.status)}
                          <span>{getStatusText(visitor.status)}</span>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 rounded-lg bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mensaje si no hay visitantes */}
              {visitors.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="w-12 h-12 text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500">
                    No hay otros usuarios en esta zona
                  </p>
                </div>
              )}
            </div>

            {/* Footer con animación de escaneo */}
            <div className="border-t border-cyan-500/30 p-2 bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs text-slate-400">
                  Actualización en tiempo real
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>

      {/* Modal de interacción con usuario */}
      <AnimatePresence>
        {selectedUser && (
          <UserInteractionModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onDuel={handleDuel}
          />
        )}
      </AnimatePresence>

      {/* Pantalla de duelo PvP */}
      {showDuel && duelOpponent && (
        <PvPDuelEncounter
          opponent={duelOpponent}
          onComplete={handleDuelComplete}
        />
      )}
    </div>
  );
}
