import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getColumns, setColumns, getRows, setRows,
} from 'store/gameConfiguration/gameConfigurationSlice';

export default function SetBoardSize() {
  const dispatch = useDispatch();
  const columns = useSelector(getColumns);
  const rows = useSelector(getRows);
  const [customSize, setCustomSize] = useState(false);

  const defaultBoardSizes = [
    {
      columns: 10,
      rows: 10,
    },
    {
      columns: 12,
      rows: 12,
    },
    {
      columns: 14,
      rows: 14,
    },
    {
      columns: 16,
      rows: 16,
    },
  ];

  const boardSizesOptions = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  function changeBoardColumnsAmount(columnsAmount) {
    dispatch(setColumns(columnsAmount));
  }

  function changeBoardRowsAmount(rowsAmount) {
    dispatch(setRows(rowsAmount));
  }

  function changeBoardSize(columnsAmount, rowsAmount) {
    setCustomSize(false);
    dispatch(setColumns(columnsAmount));
    dispatch(setRows(rowsAmount));
  }

  return (
    <div className="set-board-size-wrapper">
      { defaultBoardSizes.map((option, index) => {
        const key = `BOARD_SIZE_OPTION_${index}`;
        return (
          <button
            onClick={() => changeBoardSize(option.columns, option.rows)}
            type="button"
            key={key}
          >
            {option.columns}
            {' x '}
            {option.rows}
          </button>
        );
      })}
      <button type="button" onClick={() => setCustomSize(true)}>Custom</button>
      { customSize && (
      <div className="set-custom-board-size-wrapper">
        <div className="set-custom-board-size-columns-wrapper">
          <label htmlFor="custom-columns">
            Columns
            <select
              onChange={(e) => changeBoardColumnsAmount(Number(e.target.value))}
              value={columns}
            >
              {boardSizesOptions.map((option) => (
                <option value={option} key={`BOARD_SIZE_COLUMNS_OPTION_${option}`}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="set-custom-board-size-wrapper">
          <div className="set-custom-board-size-rows-wrapper">
            <label htmlFor="custom-rows">
              Rows
              <select
                onChange={(e) => changeBoardRowsAmount(Number(e.target.value))}
                value={rows}
              >
                {boardSizesOptions.map((option) => (
                  <option value={option} key={`BOARD_SIZE_ROWS_OPTION_${option}`}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      )}
      <div>
        Columns:
        {' '}
        {columns}
      </div>
      <div>
        Rows:
        {' '}
        {rows}
      </div>
    </div>
  );
}
