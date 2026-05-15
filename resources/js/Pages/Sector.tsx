import SectorView from '../app/components/SectorView';

interface SectorProps {
    systemId: string;
    bodyId: string;
    sectorId: string;
}

export default function Sector({ systemId, bodyId, sectorId }: SectorProps) {
    return <SectorView systemId={systemId} bodyId={bodyId} sectorId={sectorId} />;
}
