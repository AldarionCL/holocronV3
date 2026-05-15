import { RouterProvider } from 'react-router';
import { router } from './routes';
import { GameProvider } from './context/GameContext';
import React from "react";

export default function App() {
  return (
    <GameProvider>
      <RouterProvider router={router} />
    </GameProvider>
  );
}
