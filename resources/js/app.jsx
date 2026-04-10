import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

const Home = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Holocron V3</h1>
            <p className="text-gray-600">Laravel + Filament + React 18 + Vite 6 + Tailwind 4 + React Router 7</p>
        </div>
    </div>
);

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    </BrowserRouter>
);

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
