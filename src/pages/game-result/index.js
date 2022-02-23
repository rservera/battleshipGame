import { Link } from 'react-router-dom';

export default function GameResult() {
  return (
    <div>
      <h1>GameResult</h1>
      <Link to="/game">
        <button type="button">Go to game</button>
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
