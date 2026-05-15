import PlanetView from '../app/components/PlanetView';

interface PlanetProps {
    systemId: string;
    bodyId: string;
}

export default function Planet({ systemId, bodyId }: PlanetProps) {
    return <PlanetView systemId={systemId} bodyId={bodyId} />;
}
