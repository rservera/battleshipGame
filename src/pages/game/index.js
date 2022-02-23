import { Link } from 'react-router-dom';

export default function Game() {
  return (
    <div>
      <h1>Game</h1>
      <Link to="/game-result">
        <button type="button">Go to results</button>
      </Link>
      <Link to="/">
        <button type="button">New game</button>
      </Link>
      <Link to="/place-ships">
        <button type="button">Go to place ships</button>
      </Link>
    </div>
  );
}
