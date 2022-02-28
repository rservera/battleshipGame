import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setPlayerTurn, getPlayerTurn,
  getCPUBestFireOptions, /* setCPUBestFireOptions, */
  /* getCPULastFireWasSuccess, */ /* setCPULastFireWasSuccess, */
  getCPUPreferredFireDirection, /* setCPUPreferredFireDirection, */
  /*  setCPUFirstFireSuccessCellID, */ getCPUFirstFireSuccessCellID,
  setCPUBestFireOptions,
  setCPUFirstFireSuccessCellID,
  setCPUPreferredFireDirection,
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
  const CPUBestFireOptions = useSelector(getCPUBestFireOptions);
  // const CPULastFireWasSuccess = useSelector(getCPULastFireWasSuccess);
  const CPUPreferredFireDirection = useSelector(getCPUPreferredFireDirection);
  const CPUFirstFireSuccessCellID = useSelector(getCPUFirstFireSuccessCellID);

  function buildSmartCPUFireOptions(opponentCellInfo, opponentBoard, columnsAmount) {
    const opponentCellID = opponentCellInfo.id;

    const closestCellToRight = !opponentCellInfo.isLastInRow ? opponentBoard[opponentCellID + 1] : null;
    const hasClosestCellToRight = closestCellToRight !== null;
    let tempClosestCellToRight;
    if (hasClosestCellToRight) {
      tempClosestCellToRight = JSON.parse(JSON.stringify(closestCellToRight));
      tempClosestCellToRight.fireDirection = 'toRight';
      if (tempClosestCellToRight?.wasFired) {
        tempClosestCellToRight = null;
      }
    }

    const closestCellToLeft = !opponentCellInfo.isFirstInRow ? opponentBoard[opponentCellID - 1] : null;
    const hasClosestCellToLeft = closestCellToLeft !== null;
    let tempClosestCellToLeft;
    if (hasClosestCellToLeft) {
      tempClosestCellToLeft = JSON.parse(JSON.stringify(closestCellToLeft));
      tempClosestCellToLeft.fireDirection = 'toLeft';
      if (tempClosestCellToLeft?.wasFired) {
        tempClosestCellToLeft = null;
      }
    }

    const closestCellToTop = !opponentCellInfo.isInFirstRow ? opponentBoard[opponentCellID - columnsAmount] : null;
    const hasClosestCellToTop = closestCellToTop !== null;
    let tempClosestCellToTop;
    if (hasClosestCellToTop) {
      tempClosestCellToTop = JSON.parse(JSON.stringify(closestCellToTop));
      tempClosestCellToTop.fireDirection = 'toTop';
      if (tempClosestCellToTop?.wasFired) {
        tempClosestCellToTop = null;
      }
    }

    const closestCellToBottom = !opponentCellInfo.isInLastRow ? opponentBoard[opponentCellID + columnsAmount] : null;
    const hasClosestCellToBottom = closestCellToBottom !== null;
    let tempClosestCellToBottom;
    if (hasClosestCellToBottom) {
      tempClosestCellToBottom = JSON.parse(JSON.stringify(closestCellToBottom));
      tempClosestCellToBottom.fireDirection = 'toBottom';
      if (tempClosestCellToBottom?.wasFired) {
        tempClosestCellToBottom = null;
      }
    }

    // Group them into an array and remove the null ones to create smart fire options
    const closestCells = [];
    closestCells.push(tempClosestCellToRight, tempClosestCellToLeft, tempClosestCellToTop, tempClosestCellToBottom);
    const smartFireOptions = closestCells.filter((e) => e != null);

    console.log('opponentCellInfo ---> ', opponentCellInfo);
    console.log('smartFireOptions ---> ', smartFireOptions);

    // dispatch smart fir options to store
    dispatch(setCPUBestFireOptions(smartFireOptions));
  }

  function switchFireDirection(direction) {
    switch (direction) {
      case 'toRight':
        direction = 'toLeft';
        break;
      case 'toLeft':
        direction = 'toRight';
        break;
      case 'toTop':
        direction = 'toBottom';
        break;
      case 'toBottom':
        direction = 'toTop';
        break;
      default:
        direction = null;
    }
    dispatch(setCPUPreferredFireDirection(direction));
  }

  function doFire(id, player, hasShip) {
    const tempPlayer1Board = JSON.parse(JSON.stringify(player1Board));
    const tempPlayer2Board = JSON.parse(JSON.stringify(player2Board));
    const tempPlayer1AvailableFireOptions = JSON.parse(JSON.stringify(player1AvailableFireOptions));
    const tempPlayer2AvailableFireOptions = JSON.parse(JSON.stringify(player2AvailableFireOptions));
    const tempPlayer1Ships = JSON.parse(JSON.stringify(player1Ships));
    const tempPlayer2Ships = JSON.parse(JSON.stringify(player2Ships));
    const tempCPUBestFireOptions = JSON.parse(JSON.stringify(CPUBestFireOptions));

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

    // Dispatch modifications
    if (player === 'player1') {
      if (JSON.stringify(player2Ships) !== JSON.stringify(tempPlayer2Ships)) {
        dispatch(setPlayer2Ships(tempPlayer2Ships));
      }
      dispatch(setPlayer2AvailableFireOptions(tempPlayer2AvailableFireOptions));
      dispatch(setPlayer2Board(tempPlayer2Board));
    } else {
      if (JSON.stringify(player1Ships) !== JSON.stringify(tempPlayer1Ships)) {
        dispatch(setPlayer1Ships(tempPlayer1Ships));
      }
      dispatch(setPlayer1AvailableFireOptions(tempPlayer1AvailableFireOptions));
      dispatch(setPlayer1Board(tempPlayer1Board));
    }

    // Change fire turn
    dispatch(setPlayerTurn(player === 'player1' ? 'player2' : 'player1'));

    // If player2 is CPU, trigger CPU fire
    if (player === 'player1' && player2User === 'CPU') {
      let opponentCellInfo;
      // If there are best fire options stored, use them.
      if (tempCPUBestFireOptions.length) {
        // If there is a preferred fire direction, use it
        if (CPUPreferredFireDirection) {
          opponentCellInfo = tempCPUBestFireOptions.find((data) => data.fireDirection === CPUPreferredFireDirection);
          // If there isn't an available cell in the preferred direction, choose another cell
          if (
            !opponentCellInfo
              || (opponentCellInfo.isLastInRow && CPUPreferredFireDirection === 'toRight')
              || (opponentCellInfo.isFirstInRow && CPUPreferredFireDirection === 'toLeft')
              || (opponentCellInfo.isInFirstRow && CPUPreferredFireDirection === 'toTop')
              || (opponentCellInfo.isInLastRow && CPUPreferredFireDirection === 'toBottom')
          ) {
            switchFireDirection(CPUPreferredFireDirection);
            buildSmartCPUFireOptions(tempPlayer1Board[CPUFirstFireSuccessCellID], tempPlayer1Board, columns);
            if (opponentCellInfo?.wasFired) {
              opponentCellInfo = player1Board[Math.floor(Math.random() * player1Board.length)];
            }
          }
          // If CPU fire hit water:
          // 1. Change the fire direction,
          // 2. Get first cell hit as new starting point
          if (opponentCellInfo.hasShip) {
            buildSmartCPUFireOptions(opponentCellInfo, tempPlayer1Board, columns);
          } else {
            buildSmartCPUFireOptions(tempPlayer1Board[CPUFirstFireSuccessCellID], tempPlayer1Board, columns);
            switchFireDirection(CPUPreferredFireDirection);
            // If after switching direction a ship is hit continue firing in that direction
            // If water is hit, clear all CPU logic stored
            if (opponentCellInfo.hasShip) {
              buildSmartCPUFireOptions(opponentCellInfo, tempPlayer1Board, columns);
            } else {
              dispatch(setCPUBestFireOptions([]));
              dispatch(setCPUPreferredFireDirection(null));
              dispatch(setCPUFirstFireSuccessCellID(null));
            }
          }
        } else {
          // If there isn't a preferred fire direction, select the first item in the array
          [opponentCellInfo] = tempCPUBestFireOptions;
          if (opponentCellInfo.hasShip) {
            // If a ship is hit again, store the fire direction
            buildSmartCPUFireOptions(opponentCellInfo, tempPlayer1Board, columns);
            dispatch(setCPUPreferredFireDirection(opponentCellInfo.fireDirection));
          } else {
            // If the fire hits water, remove option from smart options stored
            tempCPUBestFireOptions.shift();
            dispatch(setCPUBestFireOptions(tempCPUBestFireOptions));
          }
        }
      } else {
        // If there aren't best fire options stored fire to a random cell
        opponentCellInfo = player1Board[Math.floor(Math.random() * player1Board.length)];
        if (opponentCellInfo.hasShip) {
          // If a ship is hit, get the closest cells to build a smart next shot
          buildSmartCPUFireOptions(opponentCellInfo, tempPlayer1Board, columns);
        }
      }

      console.log('opponentCellInfo ---> ', opponentCellInfo);

      // Remove cell from available options array
      const opponentCellID = opponentCellInfo.id;
      const CPUFiredCell = tempPlayer1AvailableFireOptions.indexOf(opponentCellID);
      if (CPUFiredCell > -1) {
        tempPlayer1AvailableFireOptions.splice(CPUFiredCell, 1);
      }

      // Change player board indicating than the cell was fired
      tempPlayer1Board.find((data) => data.id === opponentCellID).wasFired = true;

      if (opponentCellInfo.hasShip) {
        const shipHit = tempPlayer1Ships.find((data) => data.position.includes(opponentCellID));
        shipHit.hitsReceived += 1;

        // Check if the ship was sunk
        if (shipHit.hitsReceived === shipHit.size) {
          shipHit.isSunk = true;
          const shipSunkPosition = shipHit.position;

          player1ShipsSunk += 1;
          dispatch(setPlayer1ShipsSunk(player1ShipsSunk));

          shipSunkPosition.map((position) => { tempPlayer1Board[position].hasShipSunk = true; });

          // Inform user than a ship was sunk
          if (shipSunkFeedback) {
            console.log('Barco hundido');
          }

          // Check if the last ships was sunk
          if (player1ShipsSunk === player1Ships.length) {
            alert('Juego terminado');
          }
        }

        // Store the id of the first cell hit if CPUFirstFireSuccessCellID is null
        if (!CPUFirstFireSuccessCellID) {
          dispatch(setCPUFirstFireSuccessCellID(opponentCellID));
        }
      }

      // Dispatch CPU fire modifications
      if (JSON.stringify(player1Ships) !== JSON.stringify(tempPlayer1Ships)) {
        dispatch(setPlayer1Ships(tempPlayer1Ships));
      }
      dispatch(setPlayer1AvailableFireOptions(tempPlayer1AvailableFireOptions));
      dispatch(setPlayer1Board(tempPlayer1Board));
      dispatch(setPlayerTurn('player1'));
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
                {cell.id}
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
