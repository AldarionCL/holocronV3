import BuildingView from '../app/components/BuildingView';

interface BuildingProps {
    systemId: string;
    bodyId: string;
    sectorId: string;
    buildingId: string;
}

export default function Building({ systemId, bodyId, sectorId, buildingId }: BuildingProps) {
    return (
        <BuildingView
            systemId={systemId}
            bodyId={bodyId}
            sectorId={sectorId}
            buildingId={buildingId}
        />
    );
}
