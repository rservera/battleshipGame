import { Link } from 'react-router-dom';

export default function CreateGame() {
  return (
    <>
      <h1>CreateGame</h1>
      <Link to="/game">
        <button type="button">Go to game</button>
      </Link>
      <Link to="/game-result">
        <button type="button">Go to result</button>
      </Link>
      <Link to="/place-ships">
        <button type="button">Go to place ships</button>
      </Link>
    </>
  );
}
