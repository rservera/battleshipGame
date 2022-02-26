import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setPlayerTurn, getPlayerTurn,
} from 'store/game/gameSlice';
import {
  getPlayer1Name, getPlayer2Name, getColumns,
  getShipSunkFeedback, getPlayer2User,
} from 'store/gameConfiguration/gameConfigurationSlice';
import {
  getPlayer1Board, setPlayer1Board,
  setPlayer1AvailableFireOptions, getPlayer1AvailableFireOptions,
  getPlayer1Ships, setPlayer1Ships,
  getPlayer1ShipsSunk, setPlayer1ShipsSunk,
} from 'store/boardConfiguration/player1BoardSlice';
import {
  getPlayer2Board, setPlayer2Board,
  setPlayer2AvailableFireOptions, getPlayer2AvailableFireOptions,
  getPlayer2Ships, setPlayer2Ships,
  getPlayer2ShipsSunk, setPlayer2ShipsSunk,
} from 'store/boardConfiguration/player2BoardSlice';

export default function Game() {
  const dispatch = useDispatch();
  const player1Name = useSelector(getPlayer1Name);
  const player2Name = useSelector(getPlayer2Name);
  const player1Board = useSelector(getPlayer1Board);
  const player2Board = useSelector(getPlayer2Board);
  const player1Ships = useSelector(getPlayer1Ships);
  const player2Ships = useSelector(getPlayer2Ships);
  const columns = useSelector(getColumns);
  const playerTurn = useSelector(getPlayerTurn);
  const player1AvailableFireOptions = useSelector(getPlayer1AvailableFireOptions);
  const player2AvailableFireOptions = useSelector(getPlayer2AvailableFireOptions);
  const shipSunkFeedback = useSelector(getShipSunkFeedback);
  let player1ShipsSunk = useSelector(getPlayer1ShipsSunk);
  let player2ShipsSunk = useSelector(getPlayer2ShipsSunk);
  const player2User = useSelector(getPlayer2User);

  function doCPUFire() {
    alert('Turno de la CPU');
  }

  function doFire(id, player, hasShip) {
    const tempPlayer1Board = JSON.parse(JSON.stringify(player1Board));
    const tempPlayer2Board = JSON.parse(JSON.stringify(player2Board));
    const tempPlayer1AvailableFireOptions = JSON.parse(JSON.stringify(player1AvailableFireOptions));
    const tempPlayer2AvailableFireOptions = JSON.parse(JSON.stringify(player2AvailableFireOptions));
    const tempPlayer1Ships = JSON.parse(JSON.stringify(player1Ships));
    const tempPlayer2Ships = JSON.parse(JSON.stringify(player2Ships));
    // Remove cell from available options array
    if (player === 'player1') {
      const player2FiredCell = tempPlayer2AvailableFireOptions.indexOf(id);
      if (player2FiredCell > -1) {
        tempPlayer2AvailableFireOptions.splice(player2FiredCell, 1);
      }
    } else {
      const player1FiredCell = tempPlayer1AvailableFireOptions.indexOf(id);
      if (player1FiredCell > -1) {
        tempPlayer1AvailableFireOptions.splice(player1FiredCell, 1);
      }
    }
    // Change player board indicating than the cell was fired
    if (player === 'player1') {
      tempPlayer2Board.find((data) => data.id === id).wasFired = true;
    } else {
      tempPlayer1Board.find((data) => data.id === id).wasFired = true;
    }
    // Check if a ship was hit
    if (hasShip) {
      let shipHit;
      if (player === 'player1') {
        shipHit = tempPlayer2Ships.find((data) => data.position.includes(id));
      } else {
        shipHit = tempPlayer1Ships.find((data) => data.position.includes(id));
      }
      shipHit.hitsReceived += 1;
      // Check if the ship was sunk
      if (shipHit.hitsReceived === shipHit.size) {
        shipHit.isSunk = true;
        const shipSunkPosition = shipHit.position;
        if (player === 'player1') {
          player2ShipsSunk += 1;
          dispatch(setPlayer2ShipsSunk(player2ShipsSunk));
        } else {
          player1ShipsSunk += 1;
          dispatch(setPlayer1ShipsSunk(player1ShipsSunk));
        }
        if (player === 'player1') {
          shipSunkPosition.map((position) => { tempPlayer2Board[position].hasShipSunk = true; });
        } else {
          shipSunkPosition.map((position) => { tempPlayer1Board[position].hasShipSunk = true; });
        }
        // Inform user than a ship was sunk
        if (shipSunkFeedback) {
          console.log('Barco hundido');
        }
        // Check if the last ships was sunk
        if ((player1ShipsSunk === player1Ships.length) || (player2ShipsSunk === player2Ships.length)) {
          alert('Juego terminado');
        }
      }
    }
    // Dispatch modifications
    if (player === 'player1') {
      dispatch(setPlayer2Ships(tempPlayer2Ships));
      dispatch(setPlayer2AvailableFireOptions(tempPlayer2AvailableFireOptions));
      dispatch(setPlayer2Board(tempPlayer2Board));
    } else {
      dispatch(setPlayer1Ships(tempPlayer1Ships));
      dispatch(setPlayer1AvailableFireOptions(tempPlayer1AvailableFireOptions));
      dispatch(setPlayer1Board(tempPlayer1Board));
    }
    // Change fire turn
    dispatch(setPlayerTurn(player === 'player1' ? 'player2' : 'player1'));
    if (player === 'player1' && player2User === 'CPU') {
      doCPUFire();
    }
  }
  return (
    <div>
      <h1>Game</h1>
      <div className="game-main-wrapper">
        <div className="player-1-board-wrapper">
          <h2>{player1Name}</h2>
          <div className="board" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {player1Board.map((cell) => (
              <div
                className={`
                    board-cell 
                    ${cell.wasFired ? 'was-fired' : ''} 
                    ${cell.hasShip ? 'has-ship' : ''}
                    ${(cell.hasShipSunk && shipSunkFeedback) ? 'is-sunk' : ''}
                `}
                onClick={(playerTurn === 'player2' && !cell.wasFired) ? () => doFire(cell.id, playerTurn, cell.hasShip) : null}
                key={cell.id}
              >
                {cell.hasShip ? 'x' : ''}
              </div>
            ))}
          </div>
        </div>
        <div className="game-controls-wrapper">
          <div className="player-turn-indicator">
            {(playerTurn === 'player1') ? player1Name : player2Name}
            {' '}
            turn
          </div>
          <button type="button">Resign</button>
        </div>
        <div className="player-2-board-wrapper">
          <h2>{player2Name}</h2>
          <div className="board" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {player2Board.map((cell) => (
              <div
                className={`
                    board-cell 
                    ${cell.wasFired ? 'was-fired' : ''} 
                    ${cell.hasShip ? 'has-ship' : ''}
                    ${(cell.hasShipSunk && shipSunkFeedback) ? 'is-sunk' : ''}
                `}
                onClick={(playerTurn === 'player1' && !cell.wasFired) ? () => doFire(cell.id, playerTurn, cell.hasShip) : null}
                key={cell.id}
              >
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
