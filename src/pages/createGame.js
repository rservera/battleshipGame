import { useNavigate } from 'react-router-dom';
import SetPlayers from 'components/CreateGame/components/SetPlayers';
import SetBoardSize from 'components/CreateGame/components/SetBoardSize';
import { useSelector, useDispatch } from 'react-redux';
import {
  getShipSunkFeedback, setShipSunkFeedback, getColumns, getRows,
} from 'store/gameConfiguration/gameConfigurationSlice';
import {
  setPlayer1Board, setPlayer1AvailableFireOptions,
} from 'store/boardConfiguration/player1BoardSlice';
import {
  setPlayer2Board, setPlayer2AvailableFireOptions,
} from 'store/boardConfiguration/player2BoardSlice';

export default function CreateGame() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shipSunkFeedback = useSelector(getShipSunkFeedback);
  const columnsAmount = useSelector(getColumns);
  const rowsAmount = useSelector(getRows);

  function handleCreateBoard(columns, rows) {
    const totalCells = columns * rows;
    const board = [];
    const availableFireOptions = [];
    const tempBoard = JSON.parse(JSON.stringify(board));
    const tempAvailableFireOptions = JSON.parse(JSON.stringify(availableFireOptions));
    // Add objects to boards arrays for each board cell
    for (let i = 0; i < totalCells; i++) {
      const cellInfo = {};
      cellInfo.id = i;
      cellInfo.isInFirstRow = i < columns;
      cellInfo.isInLastRow = i > totalCells - columns - 1;
      cellInfo.isFirstInRow = i % columns === 0;
      cellInfo.isLastInRow = (i + 1) % columns === 0;
      cellInfo.hasShip = false;
      cellInfo.wasFired = false;
      cellInfo.hasShipSunk = false;
      cellInfo.fireDirection = null;
      tempBoard.push(cellInfo);
      tempAvailableFireOptions.push(i);
    }
    // Create players boards and configurations
    dispatch(setPlayer1Board(tempBoard));
    dispatch(setPlayer2Board(tempBoard));
    dispatch(setPlayer1AvailableFireOptions(Array.from(Array(tempBoard.length).keys())));
    dispatch(setPlayer2AvailableFireOptions(Array.from(Array(tempBoard.length).keys())));
    // Redirect user to Place Ships page
    navigate('/place-ships');
  }

  return (
    <>
      <h1>CreateGame</h1>
      <SetPlayers />
      <SetBoardSize />
      <div className="allow-sink-ship-feedback-wrapper">
        <label htmlFor="sink-feedback-option">
          <input
            type="checkbox"
            checked={shipSunkFeedback}
            onChange={() => dispatch(setShipSunkFeedback(!shipSunkFeedback))}
            id="sink-feedback-option"
          />
          Let me know when a ship has been sunk
        </label>
      </div>
      <div>
        <button type="button" onClick={() => handleCreateBoard(columnsAmount, rowsAmount)}>
          Create new game
        </button>
      </div>
    </>
  );
}
