import React, { useState } from 'react';

export default function SetBoardSize() {
  const [columnsAmount, setColumnsAmount] = useState(10);
  const [rowsAmount, setRowsAmount] = useState(10);
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

  function changeBoardColumnsAmount(columns) {
    if (columns !== columnsAmount) {
      setColumnsAmount(columns);
    }
  }

  function changeBoardRowsAmount(rows) {
    if (rows !== rowsAmount) {
      setRowsAmount(rows);
    }
  }

  function changeBoardSize(columns, rows) {
    setCustomSize(false);
    changeBoardColumnsAmount(columns);
    changeBoardRowsAmount(rows);
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
              onChange={(e) => changeBoardColumnsAmount(e.target.value)}
              value={columnsAmount}
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
                onChange={(e) => changeBoardRowsAmount(e.target.value)}
                value={rowsAmount}
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
        {columnsAmount}
      </div>
      <div>
        Rows:
        {' '}
        {rowsAmount}
      </div>
    </div>
  );
}
