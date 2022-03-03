import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getPlayer1Name, getPlayer2Name, getPlayer2User,
  getColumns, getRows, getShips,
  setShips,
  setResetShips,
} from 'store/gameConfiguration/gameConfigurationSlice';
import {
  getPlayer1Board, getPlayer1Ships, getPlayer1ShipsPositions,
  setPlayer1ShipsPositions, setPlayer1Board,
  setPlayer1Ships,
} from 'store/boardConfiguration/player1BoardSlice';
import {
  getPlayer2Board, getPlayer2Ships, getPlayer2ShipsPositions,
  setPlayer2ShipsPositions, setPlayer2Board,
  setPlayer2Ships,
} from 'store/boardConfiguration/player2BoardSlice';
import {
  getOrientation, setOrientation,
  getCurrentShipSize, setCurrentShipSize,
  getShipsPlacementBoard,
  setShipsPlacementBoard,
  setCurrentPreSelection,
  setCurrentShipName, getCurrentShipName,
  getCurrentPreSelection,
  // setResetShipsPlacementBoard,
} from 'store/placeShips/placeShipsSlice';

export default function PlaceShips() {
  const [currentUser, setCurrentUser] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const player1Name = useSelector(getPlayer1Name);
  const player1Board = useSelector(getPlayer1Board);
  const player1Ships = useSelector(getPlayer1Ships);
  const player1ShipsPositions = useSelector(getPlayer1ShipsPositions);

  const player2Name = useSelector(getPlayer2Name);
  const player2User = useSelector(getPlayer2User);
  const player2Board = useSelector(getPlayer2Board);
  const player2Ships = useSelector(getPlayer2Ships);
  const player2ShipsPositions = useSelector(getPlayer2ShipsPositions);

  const columns = useSelector(getColumns);
  const rows = useSelector(getRows);
  const ships = useSelector(getShips);
  const orientation = useSelector(getOrientation);
  const currentShipSize = useSelector(getCurrentShipSize);
  const currentShipName = useSelector(getCurrentShipName);
  const currentPreSelection = useSelector(getCurrentPreSelection);
  const shipsPlacementBoard = useSelector(getShipsPlacementBoard);

  const tempShipsPlacementBoard = JSON.parse(JSON.stringify(shipsPlacementBoard));

  // Redirect user to Create Game page if this page is reloaded
  useEffect(() => {
    if (player1Board.length === 0) {
      navigate('/create-game');
    }
  });

  // Rotate ships if spacebar is pressed
  document.body.onkeyup = function handleRotateShip(e) {
    if (e.keyCode === 32) {
      dispatch(setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal'));
    }
  };

  function getUsersHeader(activeUser, player2UserMode) {
    return (
      <div className="place-ships-user-header">
        <h1>
          {activeUser === 1 ? player1Name : player2Name }
          {' '}
          place your boats
        </h1>
        { player2UserMode === 'User' && (
        <h2>
          {activeUser === 1 ? player2Name : player1Name }
          {' '}
          please dont look
        </h2>
        )}
      </div>
    );
  }

  function selectShipToBePlaced(name, size) {
    if (currentShipSize !== size) { dispatch(setCurrentShipSize(size)); }
    if (currentShipName !== name) { dispatch(setCurrentShipName(name)); }
  }

  function buildShip(name, size, shipKey) {
    const sizeArray = Array.from(Array(size).keys());
    return (
      <div className="ship-wrapper" key={shipKey}>
        <div className="ship-name">
          {name}
        </div>
        <div className={`ship orientation-${orientation}`} onClick={() => selectShipToBePlaced(name, size)}>
          {sizeArray.map((cell, index) => {
            const key = `SHIP_CELL_${index}`;
            return <div key={key} />;
          })}
        </div>
      </div>
    );
  }

  function getHorizontalPlacementOption(shipSize, column, row, board, columnsAmount) {
    // Get the board row
    const boardRow = [];
    board.map((cell) => (
      cell.row === row ? boardRow.push(cell) : null
    ));
    // Get n cells to left (ship size)
    const pivotNumber = column - 1;
    const tempMinNumber = pivotNumber - shipSize + 1;
    const minNumber = tempMinNumber < 0 ? 0 : tempMinNumber;
    // Loop through the row getting consecutive cells that contains the given cell
    let option = [];
    const horizontalPlacementOptions = [];
    for (let startingPoint = pivotNumber; startingPoint >= minNumber; startingPoint--) {
      for (let i = startingPoint + shipSize - 1; i >= startingPoint; i--) {
        // Check if the cell exists and doesn't have a ship
        const preSelectedCell = board[(row - 1) * columnsAmount + i];
        if (i < columnsAmount && preSelectedCell?.hasShip === false) {
          option.push(i);
        }
      }
      // Check that the option array has the same size than the ship
      if (option.length === shipSize) {
        horizontalPlacementOptions.push(option);
      }
      option = [];
    }
    return horizontalPlacementOptions;
  }

  function getVerticalPlacementOption(shipSize, column, row, board, rowsAmount) {
    // Get the board column
    const boardColumn = [];
    board.map((cell) => (
      cell.column === column ? boardColumn.push(cell) : null
    ));
    // Get n cells to bottom (ship size)
    const pivotNumber = row - 1;
    const tempMinNumber = pivotNumber - shipSize + 1;
    const minNumber = tempMinNumber < 0 ? 0 : tempMinNumber;
    // Loop through the column getting consecutive cells that contains the given cell
    let option = [];
    const verticalPlacementOptions = [];
    for (let startingPoint = pivotNumber; startingPoint >= minNumber; startingPoint--) {
      for (let i = startingPoint + shipSize - 1; i >= startingPoint; i--) {
        // Check if the cell exists and doesn't have a ship
        const preSelectedCell = board[(column + rowsAmount * i) - 1];
        if (i < rowsAmount && preSelectedCell?.hasShip === false) {
          option.push(i);
        }
      }
      // Check that the option array has the same size than the ship
      if (option.length === shipSize) {
        verticalPlacementOptions.push(option);
      }
      option = [];
    }
    return verticalPlacementOptions;
  }

  function findShipPosition(cell, board, shipSize, columnsAmount, rowsAmount, direction) {
    const currentRow = cell.row;
    const currentColumn = cell.column;
    const horizontalPlacementOptions = getHorizontalPlacementOption(shipSize, currentColumn, currentRow, board, columnsAmount);
    const verticalPlacementOptions = getVerticalPlacementOption(shipSize, currentColumn, currentRow, board, rowsAmount);
    // Remove stored isPreSelected info
    tempShipsPlacementBoard.map((tempShipsPlacementBoardCell) => { tempShipsPlacementBoardCell.isPreSelected = false; });
    dispatch(setShipsPlacementBoard(tempShipsPlacementBoard));
    // Only get options related to the current direction
    if (direction === 'horizontal') {
      // Get the board row
      const boardRow = [];
      board.map((boardCell) => (
        boardCell.row === cell.row ? boardRow.push(boardCell) : null
      ));
      // Get cell in board row that has the columns id that are stored in horizontalPlacementOptions
      const preferredOption = horizontalPlacementOptions[0];
      // Build and dispatch the ShipsPlacementBoard with isPreSelected cells
      const shipsPlacementBoardToDispatch = [];
      tempShipsPlacementBoard.map((tempShipsPlacementBoardCell) => {
        const cellToModify = JSON.parse(JSON.stringify(tempShipsPlacementBoardCell));
        if (cellToModify.row === currentRow && preferredOption?.includes(cellToModify.column - 1)) {
          cellToModify.isPreSelected = true;
        }
        shipsPlacementBoardToDispatch.push(cellToModify);
      });
      dispatch(setShipsPlacementBoard(shipsPlacementBoardToDispatch));
      const preferredOptionToDispatch = [];
      preferredOption?.map((cellToModifyColumn) => preferredOptionToDispatch.push(columnsAmount * (currentRow - 1) + cellToModifyColumn));
      dispatch(setCurrentPreSelection(preferredOptionToDispatch));
    } else {
      // Get the board column
      const boardColumn = [];
      board.map((boardCell) => (
        boardCell.column === cell.column ? boardColumn.push(boardCell) : null
      ));
      // Get cell in board column that has the columns id that are stored in verticalPlacementOptions;
      const preferredOption = verticalPlacementOptions[0];
      // Build and dispatch the ShipsPlacementBoard with isPreSelected cells
      const shipsPlacementBoardToDispatch = [];
      tempShipsPlacementBoard.map((tempShipsPlacementBoardCell) => {
        const cellToModify = JSON.parse(JSON.stringify(tempShipsPlacementBoardCell));
        if (cellToModify.column === currentColumn && preferredOption?.includes(cellToModify.row - 1)) {
          cellToModify.isPreSelected = true;
        }
        shipsPlacementBoardToDispatch.push(cellToModify);
      });
      dispatch(setShipsPlacementBoard(shipsPlacementBoardToDispatch));
      const preferredOptionToDispatch = [];
      preferredOption?.map((cellToModifyRow) => preferredOptionToDispatch.push(rowsAmount * (currentColumn - 1) + cellToModifyRow));
      dispatch(setCurrentPreSelection(preferredOptionToDispatch));
    }
  }

  function setShipPosition() {
    // Dispatch shipsPlacementBoard modifications
    const boardToDispatch = [];
    tempShipsPlacementBoard.map((cellToModify) => {
      if (cellToModify.isPreSelected) { cellToModify.hasShip = true; }
      boardToDispatch.push(cellToModify);
    });
    dispatch(setShipsPlacementBoard(boardToDispatch));
    // Dispatch player ships modification
    const shipToAdd = {};
    shipToAdd.name = currentShipName;
    shipToAdd.position = currentPreSelection;
    shipToAdd.size = currentShipSize;
    shipToAdd.hitsReceived = 0;
    shipToAdd.isSunk = false;
    if (currentUser === 1) {
      const tempPlayer1Ships = JSON.parse(JSON.stringify(player1Ships));
      tempPlayer1Ships.push(shipToAdd);
      dispatch(setPlayer1Ships(tempPlayer1Ships));
    } else {
      const tempPlayer2Ships = JSON.parse(JSON.stringify(player2Ships));
      tempPlayer2Ships.push(shipToAdd);
      dispatch(setPlayer2Ships(tempPlayer2Ships));
    }
    // Remove ship from ships to be placed
    const tempShips = JSON.parse(JSON.stringify(ships));
    const shipsToDispatch = tempShips.filter((ship) => ship.name !== currentShipName);
    dispatch(setShips(shipsToDispatch));
    dispatch(setCurrentShipSize(null));
    dispatch(setCurrentShipName(null));
    // Add ship position to all ships positions
    if (currentUser === 1) {
      const tempPlayer1ShipsPositions = JSON.parse(JSON.stringify(player1ShipsPositions));
      const player1ShipsPositionToDispatch = tempPlayer1ShipsPositions.concat(currentPreSelection);
      dispatch(setPlayer1ShipsPositions(player1ShipsPositionToDispatch));
    } else {
      const tempPlayer2ShipsPositions = JSON.parse(JSON.stringify(player2ShipsPositions));
      const player2ShipsPositionToDispatch = tempPlayer2ShipsPositions.concat(currentPreSelection);
      dispatch(setPlayer2ShipsPositions(player2ShipsPositionToDispatch));
    }
    // Modify player board when all ships had been placed
    if (ships.length === 1) {
      if (currentUser === 1) {
        const tempPlayer1Board = JSON.parse(JSON.stringify(player1Board));
        player1ShipsPositions.map((cellID) => { tempPlayer1Board[cellID].hasShip = true; });
        dispatch(setPlayer1Board(tempPlayer1Board));
      } else {
        const tempPlayer2Board = JSON.parse(JSON.stringify(player2Board));
        player2ShipsPositions.map((cellID) => { tempPlayer2Board[cellID].hasShip = true; });
        dispatch(setPlayer2Board(tempPlayer2Board));
      }
    }
  }

  function handleChangeTurn() {
    setCurrentUser(2);
    dispatch(setResetShips());
    tempShipsPlacementBoard.map((cell) => { cell.hasShip = false; });
    dispatch(setShipsPlacementBoard(tempShipsPlacementBoard));
  }

  function handleStartGame() {
    // Map players ships and dispatch ship positions to state
    const tempPlayer1ShipsPositions = JSON.parse(JSON.stringify(player1ShipsPositions));
    const tempPlayer2ShipsPositions = JSON.parse(JSON.stringify(player2ShipsPositions));
    player1Ships.map((ship) => (
      tempPlayer1ShipsPositions.push(...ship.position)
    ));
    player2Ships.map((ship) => (
      tempPlayer2ShipsPositions.push(...ship.position)
    ));
    dispatch(setPlayer1ShipsPositions(tempPlayer1ShipsPositions));
    dispatch(setPlayer2ShipsPositions(tempPlayer2ShipsPositions));
    // Update players board cells indicating which cells has ships
    const tempPlayer1Board = JSON.parse(JSON.stringify(player1Board));
    tempPlayer1ShipsPositions.forEach((id) => {
      tempPlayer1Board[id].hasShip = true;
    });
    dispatch(setPlayer1Board(tempPlayer1Board));
    const tempPlayer2Board = JSON.parse(JSON.stringify(player2Board));
    tempPlayer2ShipsPositions.forEach((id) => {
      tempPlayer2Board[id].hasShip = true;
    });
    dispatch(setPlayer2Board(tempPlayer2Board));
    // Redirect user to game
    navigate('/game');
  }

  const goToGameButton = <button type="button" onClick={() => handleStartGame()}>Go to game</button>;

  return (
    <div className="place-ships-wrapper">
      { getUsersHeader(currentUser, player2User) }
      <div className="place-ships-board-wrapper">
        <div className="board" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {shipsPlacementBoard.map((cell, index) => {
            const key = `SHIPS_PLACEMENT_BOARD_CELL_${index}`;
            return (
              <div
                className="board-cell"
                key={key}
                onMouseEnter={() => (currentShipSize ? findShipPosition(cell, shipsPlacementBoard, currentShipSize, columns, rows, orientation) : null)}
                onClick={() => setShipPosition()}
              >
                {cell.isPreSelected ? '-' : ''}
                {cell.hasShip ? 'x' : ''}
              </div>
            );
          })}
        </div>
      </div>
      <div className="ship-selection-controls-wrapper">
        <div className={`ships-wrapper orientation-${orientation}`}>
          {ships.map((ship, index) => {
            const shipKey = `SHIP_${index}`;
            return buildShip(ship.name, ship.size, shipKey);
          })}
        </div>
        {ships.length > 0 && (
        <>
          <div>
            Current ship size:
            {currentShipSize}
          </div>
          <div>
            Click rotate button or press space bar to rotate ships
          </div>
          <div>
            <button
              type="button"
              onClick={() => dispatch(setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal'))}
            >
              Rotate
            </button>
          </div>
        </>
        )}
        { (currentUser === 1 && player2User === 'User')
          ? <button type="button" onClick={() => handleChangeTurn()}>Place Player 2 boats</button>
          : goToGameButton }
      </div>
    </div>
  );
}
