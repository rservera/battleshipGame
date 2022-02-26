import { Link } from 'react-router-dom';
import { useSelector /* useDispatch */ } from 'react-redux';
import {
  getPlayer1Name, getPlayer2Name, getColumns, /* getPlayer2User, */
} from 'store/gameConfiguration/gameConfigurationSlice';
import {
  getPlayer1Board, /* getPlayer1Ships, getPlayer1ShipsPositions,
    setPlayer1ShipsPositions, setPlayer1Board, */
} from 'store/boardConfiguration/player1BoardSlice';
import {
  getPlayer2Board, /* getPlayer2Ships, getPlayer2ShipsPositions,
    setPlayer2ShipsPositions, setPlayer2Board, */
} from 'store/boardConfiguration/player2BoardSlice';

export default function Game() {
  const player1Name = useSelector(getPlayer1Name);
  const player2Name = useSelector(getPlayer2Name);
  const player1Board = useSelector(getPlayer1Board);
  const player2Board = useSelector(getPlayer2Board);
  const columns = useSelector(getColumns);
  return (
    <div>
      <h1>Game</h1>
      <div className="game-main-wrapper">
        <div className="player-1-board-wrapper">
          <h2>{player1Name}</h2>
          <div className="board" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {player1Board.map((cell) => (
              <div className="board-cell" key={cell.id}>
                {cell.hasShip ? 'x' : ''}
              </div>
            ))}
          </div>
        </div>
        <div className="game-controls-wrapper">
          <div className="player-turn-indicator">
            Player 1 turn
          </div>
          <button type="button">Resign</button>
        </div>
        <div className="player-2-board-wrapper">
          <h2>{player2Name}</h2>
          <div className="board" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {player2Board.map((cell) => (
              <div className="board-cell" key={cell.id}>
                {cell.hasShip ? 'x' : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
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
