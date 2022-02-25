import { useSelector } from 'react-redux';
import { getColumns } from 'store/gameConfiguration/gameConfigurationSlice';
import { getBoardConfiguration } from 'store/boardConfiguration/boardConfigurationSlice';
import { Link } from 'react-router-dom';

export default function PlaceShips() {
  const board = useSelector(getBoardConfiguration);
  const columns = useSelector(getColumns);
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 20 }}>
        {board.map((cell, index) => {
          const key = `BOARD_CELL_${index}`;
          return (
            <div key={key}>
              <div>{index}</div>
              <div>{cell.isFirstRow ? 'first row' : ''}</div>
              <div>{cell.isLastRow ? 'last row' : ''}</div>
              <div>{cell.isFirstInRow ? 'first in row' : ''}</div>
              <div>{cell.isLastInRow ? 'last in row' : ''}</div>
            </div>
          );
        })}
      </div>
      <div>
        <Link to="/game">
          <button type="button">Go to game</button>
        </Link>
        <Link to="/game-result">
          <button type="button">Go to result</button>
        </Link>
        <Link to="/create-game">
          <button type="button">Go to new game</button>
        </Link>
      </div>
    </>
  );
}
