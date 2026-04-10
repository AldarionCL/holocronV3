import { createBrowserRouter } from "react-router";
import GalaxyView from "./components/GalaxyView";
import SolarSystemView from "./components/SolarSystemView";
import PlanetView from "./components/PlanetView";
import SectorView from "./components/SectorView";
import BuildingView from "./components/BuildingView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: GalaxyView,
  },
  {
    path: "/system/:systemId",
    Component: SolarSystemView,
  },
  {
    path: "/system/:systemId/body/:bodyId",
    Component: PlanetView,
  },
  {
    path: "/system/:systemId/body/:bodyId/sector/:sectorId",
    Component: SectorView,
  },
  {
    path: "/system/:systemId/body/:bodyId/sector/:sectorId/building/:buildingId",
    Component: BuildingView,
  },
]);
