import { Link } from 'react-router-dom';

export default function PlaceShips() {
  return (
    <div>
      <h1>Place Ships</h1>
      <Link to="/game">
        <button type="button">Go to game</button>
      </Link>
      <Link to="/game-result">
        <button type="button">Go to result</button>
      </Link>
      <Link to="/create-game">
        <button type="button">Go to new game</button>
      </Link>
    </div>
  );
}
