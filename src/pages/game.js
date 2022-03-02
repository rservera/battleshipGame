import { useSelector, useDispatch } from 'react-redux';
import {
  setPlayerTurn, getPlayerTurn,
  setCPUBestFireOptions, getCPUBestFireOptions,
  setCPUPreferredFireDirection, getCPUPreferredFireDirection,
  setCPUFirstFireSuccessCellID, getCPUFirstFireSuccessCellID,
} from 'store/game/gameSlice';
import {
  getPlayer1Name, getPlayer2Name, getColumns,
  getShipSunkFeedback, getPlayer2User,
} from 'store/gameConfiguration/gameConfigurationSlice';
import {
  setPlayer1Board, getPlayer1Board,
  setPlayer1AvailableFireOptions, getPlayer1AvailableFireOptions,
  getPlayer1Ships, setPlayer1Ships,
  getPlayer1ShipsSunk, setPlayer1ShipsSunk,
} from 'store/boardConfiguration/player1BoardSlice';
import {
  setPlayer2Board, getPlayer2Board,
  setPlayer2Ships, getPlayer2Ships,
  setPlayer2ShipsSunk, getPlayer2ShipsSunk,
} from 'store/boardConfiguration/player2BoardSlice';

export default function Game() {
  const dispatch = useDispatch();

  const player1Name = useSelector(getPlayer1Name);
  const player2Name = useSelector(getPlayer2Name);
  const player2User = useSelector(getPlayer2User);
  const columns = useSelector(getColumns);
  const player1Board = useSelector(getPlayer1Board);
  const player2Board = useSelector(getPlayer2Board);
  const player1Ships = useSelector(getPlayer1Ships);
  const player2Ships = useSelector(getPlayer2Ships);
  const playerTurn = useSelector(getPlayerTurn);
  const player1AvailableFireOptions = useSelector(getPlayer1AvailableFireOptions);
  const shipSunkFeedback = useSelector(getShipSunkFeedback);
  const CPUBestFireOptions = useSelector(getCPUBestFireOptions);
  const CPUPreferredFireDirection = useSelector(getCPUPreferredFireDirection);
  const CPUFirstFireSuccessCellID = useSelector(getCPUFirstFireSuccessCellID);
  let player1ShipsSunk = useSelector(getPlayer1ShipsSunk);
  let player2ShipsSunk = useSelector(getPlayer2ShipsSunk);

  function getRandomAvailableCell(opponentBoard, availableOptions) {
    const randomNumber = availableOptions[Math.floor(Math.random() * (availableOptions.length + 1))];
    const optionSelected = availableOptions[randomNumber];
    const availableCell = opponentBoard[optionSelected];
    return availableCell;
  }

  function buildSmartCPUFireOptions(opponentCellInfo, opponentBoard, columnsAmount) {
    const opponentCellID = opponentCellInfo.id;

    // If the cell to the right is available, get it
    const closestCellToRight = !opponentCellInfo.isLastInRow ? opponentBoard[opponentCellID + 1] : null;
    const hasClosestCellToRight = closestCellToRight !== null;
    let tempClosestCellToRight;
    if (hasClosestCellToRight && !closestCellToRight.wasFired) {
      // Store that is placed at the right
      tempClosestCellToRight = JSON.parse(JSON.stringify(closestCellToRight));
      tempClosestCellToRight.fireDirection = 'toRight';
    } else {
      tempClosestCellToRight = null;
    }

    // Do the same to the left
    const closestCellToLeft = !opponentCellInfo.isFirstInRow ? opponentBoard[opponentCellID - 1] : null;
    const hasClosestCellToLeft = closestCellToLeft !== null;
    let tempClosestCellToLeft;
    if (hasClosestCellToLeft && !closestCellToLeft.wasFired) {
      tempClosestCellToLeft = JSON.parse(JSON.stringify(closestCellToLeft));
      tempClosestCellToLeft.fireDirection = 'toLeft';
    } else {
      tempClosestCellToLeft = null;
    }

    // To top
    const closestCellToTop = !opponentCellInfo.isInFirstRow ? opponentBoard[opponentCellID - columnsAmount] : null;
    const hasClosestCellToTop = closestCellToTop !== null;
    let tempClosestCellToTop;
    if (hasClosestCellToTop && !closestCellToTop.wasFired) {
      tempClosestCellToTop = JSON.parse(JSON.stringify(closestCellToTop));
      tempClosestCellToTop.fireDirection = 'toTop';
    } else {
      tempClosestCellToTop = null;
    }

    // And to bottom
    const closestCellToBottom = !opponentCellInfo.isInLastRow ? opponentBoard[opponentCellID + columnsAmount] : null;
    const hasClosestCellToBottom = closestCellToBottom !== null;
    let tempClosestCellToBottom;
    if (hasClosestCellToBottom && !closestCellToBottom.wasFired) {
      tempClosestCellToBottom = JSON.parse(JSON.stringify(closestCellToBottom));
      tempClosestCellToBottom.fireDirection = 'toBottom';
    } else {
      tempClosestCellToBottom = null;
    }

    // Group all cells into an array and remove the null ones to create smart fire options
    const closestCells = [];
    closestCells.push(tempClosestCellToRight, tempClosestCellToLeft, tempClosestCellToTop, tempClosestCellToBottom);
    const smartFireOptions = closestCells.filter((e) => e != null);

    // Dispatch smart fire options to store
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
    const tempPlayer1Ships = JSON.parse(JSON.stringify(player1Ships));
    const tempPlayer2Ships = JSON.parse(JSON.stringify(player2Ships));
    const tempCPUBestFireOptions = JSON.parse(JSON.stringify(CPUBestFireOptions));

    // Inform than a cell was fired
    if (player === 'player1') {
      tempPlayer2Board.find((data) => data.id === id).wasFired = true;
    } else {
      tempPlayer1Board.find((data) => data.id === id).wasFired = true;
    }

    // Inform if a ship was hit
    if (hasShip) {
      let shipHit;
      if (player === 'player1') {
        shipHit = tempPlayer2Ships.find((data) => data.position.includes(id));
      } else {
        shipHit = tempPlayer1Ships.find((data) => data.position.includes(id));
      }
      shipHit.hitsReceived += 1;

      // Inform if a ship was sunk
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

        // If is configured to inform users about ships been sunk, inform it
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
    if (player === 'player2') {
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
          if (opponentCellInfo) {
            buildSmartCPUFireOptions(opponentCellInfo, tempPlayer1Board, columns);
            // If CPU fire is in a cell at the boundaries,
            // change the fire direction and build fire smart option
            // choosing the first hit cell as starting point
            if (opponentCellInfo.hasShip && (
              (opponentCellInfo.isLastInRow && CPUPreferredFireDirection === 'toRight')
                || (opponentCellInfo.isFirstInRow && CPUPreferredFireDirection === 'toLeft')
                || (opponentCellInfo.isInFirstRow && CPUPreferredFireDirection === 'toTop')
                || (opponentCellInfo.isInLastRow && CPUPreferredFireDirection === 'toBottom')
            )) {
              switchFireDirection(CPUPreferredFireDirection);
              buildSmartCPUFireOptions(tempPlayer1Board[CPUFirstFireSuccessCellID], tempPlayer1Board, columns);
            }
            // If there are a preferred fire direction but CPU fire hit water:
            // 1. Get first cell hit as new starting point
            // 2. Change the fire direction
            if (!opponentCellInfo.hasShip
                || (CPUPreferredFireDirection === 'toLeft' && tempPlayer1Board[CPUFirstFireSuccessCellID].isFirstInRow)
                || (CPUPreferredFireDirection === 'toRight' && tempPlayer1Board[CPUFirstFireSuccessCellID].isLastInRow)
                || (CPUPreferredFireDirection === 'toTop' && tempPlayer1Board[CPUFirstFireSuccessCellID].isInFirstRow)
                || (CPUPreferredFireDirection === 'toBottom' && tempPlayer1Board[CPUFirstFireSuccessCellID].isInLastRow)
            ) {
              buildSmartCPUFireOptions(tempPlayer1Board[CPUFirstFireSuccessCellID], tempPlayer1Board, columns);
              switchFireDirection(CPUPreferredFireDirection);
              opponentCellInfo = tempCPUBestFireOptions.find((data) => data.fireDirection === CPUPreferredFireDirection);
              if (opponentCellInfo.wasFired) {
                dispatch(setCPUBestFireOptions([]));
                dispatch(setCPUPreferredFireDirection(null));
                dispatch(setCPUFirstFireSuccessCellID(null));
                opponentCellInfo = getRandomAvailableCell(tempPlayer1Board, tempPlayer1AvailableFireOptions);
              }
            }
          } else {
            // There are cases in which can be an stored direction
            // and smart fire options and still doesn't have an available cell to be fired
            // (for example change direction and get a boundary cell without options in that direction)
            opponentCellInfo = getRandomAvailableCell(tempPlayer1Board, tempPlayer1AvailableFireOptions);
            dispatch(setCPUBestFireOptions([]));
            dispatch(setCPUPreferredFireDirection(null));
            dispatch(setCPUFirstFireSuccessCellID(null));
          }
        } else {
          // If there are smart option available
          // but there isn't a preferred fire direction
          // select the first item in the array
          [opponentCellInfo] = tempCPUBestFireOptions;
          // If a ship is hit again, store the fire direction
          if (opponentCellInfo.hasShip) {
            buildSmartCPUFireOptions(opponentCellInfo, tempPlayer1Board, columns);
            dispatch(setCPUPreferredFireDirection(opponentCellInfo.fireDirection));
          } else {
            // If the fire hits water, remove option from smart options stored
            tempCPUBestFireOptions.shift();
            dispatch(setCPUBestFireOptions(tempCPUBestFireOptions));
          }
        }
      } else {
        /** *************************** */
        /*                              */
        /*      ESTO ESTA FALLANDO      */
        /*       ALEATORIAMENTE         */
        /*                              */
        /** *************************** */
        // If there aren't best fire options stored fire to a random cell
        console.log('opponentCellInfo antes del random de 281', opponentCellInfo);
        opponentCellInfo = getRandomAvailableCell(tempPlayer1Board, tempPlayer1AvailableFireOptions);
        console.log('opponentCellInfo despues del random de 281', opponentCellInfo);
        if (opponentCellInfo?.hasShip) {
          // If a ship is hit, build smarter options for next shot
          buildSmartCPUFireOptions(opponentCellInfo, tempPlayer1Board, columns);
        }
      }

      // If random selection failed, give a next try
      if (!opponentCellInfo) {
        console.log('opponentCellInfo antes de 292', opponentCellInfo);
        opponentCellInfo = getRandomAvailableCell(tempPlayer1Board, tempPlayer1AvailableFireOptions);
        console.log('opponentCellInfo despues de 309', opponentCellInfo);
        dispatch(setCPUBestFireOptions([]));
        dispatch(setCPUPreferredFireDirection(null));
        dispatch(setCPUFirstFireSuccessCellID(null));
        if (opponentCellInfo?.hasShip) {
          // If a ship is hit, build smarter options for next shot
          buildSmartCPUFireOptions(opponentCellInfo, tempPlayer1Board, columns);
        }
      }

      // If random selection failed, give a next try
      if (!opponentCellInfo) {
        console.log('opponentCellInfo antes de 307', opponentCellInfo);
        opponentCellInfo = getRandomAvailableCell(tempPlayer1Board, tempPlayer1AvailableFireOptions);
        console.log('opponentCellInfo despues de 307', opponentCellInfo);
        dispatch(setCPUBestFireOptions([]));
        dispatch(setCPUPreferredFireDirection(null));
        dispatch(setCPUFirstFireSuccessCellID(null));
        if (opponentCellInfo?.hasShip) {
          // If a ship is hit, build smarter options for next shot
          buildSmartCPUFireOptions(opponentCellInfo, tempPlayer1Board, columns);
        }
      }

      // Remove cell from available options array
      const opponentCellID = opponentCellInfo.id;
      const CPUFiredCell = tempPlayer1AvailableFireOptions.indexOf(opponentCellID);
      if (CPUFiredCell > -1) {
        tempPlayer1AvailableFireOptions.splice(CPUFiredCell, 1);
      }

      // Change player board indicating than the cell was fired
      tempPlayer1Board.find((data) => data.id === opponentCellID).wasFired = true;

      // Perform modifications related the a successful fire
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

          // Inform than a ship was sunk - only if the configuration is done -
          if (shipSunkFeedback) {
            console.log('Barco hundido');
            dispatch(setCPUBestFireOptions([]));
            dispatch(setCPUPreferredFireDirection(null));
            dispatch(setCPUFirstFireSuccessCellID(null));
          }

          // Check if the last ships was sunk
          if (player1ShipsSunk === player1Ships.length) {
            alert('Juego terminado');
          }
        }

        // Store the id of the first cell hit after a if CPUFirstFireSuccessCellID is null
        if (!CPUFirstFireSuccessCellID) {
          dispatch(setCPUFirstFireSuccessCellID(opponentCellID));
        }
      }

      // Dispatch CPU fire modifications
      if (JSON.stringify(player1Ships) !== JSON.stringify(tempPlayer1Ships)) {
        dispatch(setPlayer1Ships(tempPlayer1Ships));
      }
      if (JSON.stringify(CPUBestFireOptions) !== JSON.stringify(tempCPUBestFireOptions)) {
        dispatch(setCPUBestFireOptions(tempCPUBestFireOptions));
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
    </div>
  );
}
