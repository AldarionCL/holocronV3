import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { sectors, buildings, sectorVisitors, celestialBodies } from "../data/gameData";
import { ArrowLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useState } from "react";
import PlayerHUD from "./PlayerHUD";
import VisitorsPanel from "./VisitorsPanel";
import GroundTravelModal from "./GroundTravelModal";

export default function SectorView() {
  const { systemId, bodyId, sectorId } = useParams<{
    systemId: string;
    bodyId: string;
    sectorId: string;
  }>();
  const navigate = useNavigate();
  const [travelingToBuilding, setTravelingToBuilding] = useState<string | null>(null);

  const sector = Object.values(sectors)
    .flat()
    .find((s) => s.id === sectorId);

  const sectorBuildings = buildings[sectorId || ""] || [];
  const visitors = sectorVisitors[sectorId || ""] || [];

  // Obtener el cuerpo celeste para el nivel de hostilidad
  const body = celestialBodies[systemId || ""]?.find((b) => b.id === bodyId);

  const handleBuildingClick = (buildingId: string) => {
    // Iniciar viaje terrestre al edificio
    setTravelingToBuilding(buildingId);
  };

  const handleTravelComplete = () => {
    if (travelingToBuilding) {
      navigate(
        `/system/${systemId}/body/${bodyId}/sector/${sectorId}/building/${travelingToBuilding}`
      );
      setTravelingToBuilding(null);
    }
  };

  if (!sector) {
    return <div>Sector no encontrado</div>;
  }

  // Mostrar modal de viaje terrestre si está viajando
  if (travelingToBuilding) {
    const targetBuilding = sectorBuildings.find(b => b.id === travelingToBuilding);
    return (
      <GroundTravelModal
        fromName={sector.name}
        toName={targetBuilding?.name || "Edificio"}
        hostilityLevel={body?.hostilityLevel || 1}
        onComplete={handleTravelComplete}
        travelType="building"
      />
    );
  }

  return (
    <div className="relative size-full overflow-hidden">
      {/* HUD del jugador */}
      <PlayerHUD />

      {/* Fondo de ciudad futurística */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1747499967281-c0c5eec9933c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwY2l0eSUyMHNreWxpbmUlMjBuaWdodHxlbnwxfHx8fDE3NzIzMDg2NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
        }}
      />

      {/* Overlay de color del sector */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${sector.color}30, rgba(15, 23, 42, 0.85))`,
        }}
      />

      {/* Botón volver */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(`/system/${systemId}/body/${bodyId}`)}
        className="sw-button absolute left-8 top-8 z-20 flex items-center gap-2 px-4 py-2"
      >
        <ArrowLeft className="h-5 w-5" />
        Volver
      </motion.button>

      {/* Información del sector */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="sw-panel sw-glow absolute right-8 top-8 z-20 p-4"
      >
        <h2 className="mb-2 text-2xl font-bold uppercase tracking-wider text-amber-400 sw-text-glow">
          {sector.name}
        </h2>
        <p className="text-sm text-slate-300">{sector.description}</p>
      </motion.div>

      {/* Vista de los edificios */}
      <div className="flex size-full items-center justify-center p-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sectorBuildings.map((building, index) => {
            // Obtener el icono dinámicamente
            const IconComponent = (LucideIcons as any)[building.icon] || LucideIcons.Building;

            return (
              <motion.div
                key={building.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="cursor-pointer"
                onClick={() => handleBuildingClick(building.id)}
              >
                <div className="sw-card sw-glow group relative p-8 transition-all hover:sw-glow">
                  {/* Icono del edificio */}
                  <div className="mb-6 flex justify-center">
                    <div
                      className="rounded-full p-6 sw-glow transition-all group-hover:scale-110"
                      style={{
                        backgroundColor: `${sector.color}40`,
                      }}
                    >
                      <IconComponent className="h-16 w-16 text-amber-400" />
                    </div>
                  </div>

                  {/* Nombre del edificio */}
                  <h3 className="mb-2 text-center text-xl font-bold uppercase tracking-wide text-amber-400">
                    {building.name}
                  </h3>

                  {/* Tipo de edificio */}
                  <div className="flex justify-center">
                    <span
                      className="rounded-full border-2 px-4 py-1 text-sm uppercase tracking-wider text-amber-300"
                      style={{
                        borderColor: sector.color,
                        backgroundColor: `${sector.color}20`,
                      }}
                    >
                      {building.type}
                    </span>
                  </div>

                  {/* Botón de entrar */}
                  <div className="mt-6 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="sw-button-cyan px-6 py-2">
                      Entrar
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Instrucciones */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-lg bg-slate-900/80 px-6 py-3 text-center backdrop-blur-sm"
      >
        <p className="text-sm text-cyan-300">
          Selecciona un edificio para interactuar con NPCs
        </p>
      </motion.div>

      {/* Panel de visitantes */}
      <VisitorsPanel visitors={visitors} sectorName={sector.name} />
    </div>
  );
}