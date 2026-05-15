import SolarSystemView from '../app/components/SolarSystemView';

interface SolarSystemProps {
    systemId: string;
}

export default function SolarSystem({ systemId }: SolarSystemProps) {
    return <SolarSystemView systemId={systemId} />;
}
