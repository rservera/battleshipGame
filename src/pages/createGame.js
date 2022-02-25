import { useNavigate } from 'react-router-dom';
import SetPlayers from 'components/CreateGame/components/SetPlayers';
import SetBoardSize from 'components/CreateGame/components/SetBoardSize';
import { useSelector, useDispatch } from 'react-redux';
import {
  getShipSunkFeedback, setShipSunkFeedback, getColumns, getRows,
} from 'store/gameConfiguration/gameConfigurationSlice';
import { setBoardConfiguration } from 'store/boardConfiguration/boardConfigurationSlice';

export default function CreateGame() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shipSunkFeedback = useSelector(getShipSunkFeedback);
  const columnsAmount = useSelector(getColumns);
  const rowsAmount = useSelector(getRows);

  function handleCreateBoard(columns, rows) {
    const totalCells = columns * rows;
    const board = [];
    const tempBoard = JSON.parse(JSON.stringify(board));
    // Add objects to board array for each board cell
    for (let i = 0; i < totalCells; i++) {
      const cellInfo = {};
      cellInfo.index = i;
      cellInfo.isFirstRow = i < columns;
      cellInfo.isLastRow = i > totalCells - columns - 1;
      cellInfo.isFirstInRow = i % columns === 0;
      cellInfo.isLastInRow = (i + 1) % columns === 0;
      tempBoard.push(cellInfo);
    }
    dispatch(setBoardConfiguration(tempBoard));
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
