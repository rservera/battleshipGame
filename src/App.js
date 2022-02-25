import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import CreateGame from './pages/createGame';
import Game from './pages/game';
import GameResult from './pages/gameResult';
import PlaceShips from './pages/placeShips';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<CreateGame />} />
        <Route path="/create-game" element={<CreateGame />} />
        <Route path="/place-ships" element={<PlaceShips />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game-result" element={<GameResult />} />
      </Routes>
    </BrowserRouter>
  );
}
