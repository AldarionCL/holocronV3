import '../css/app.css'; // Importar tu CSS personalizado
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { GameProvider } from './app/context/GameContext';

const appName = 'Galactic Explorer';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <GameProvider>
                <App {...props} />
            </GameProvider>
        );
    },
    progress: {
        color: '#fbbf24',
    },
});
