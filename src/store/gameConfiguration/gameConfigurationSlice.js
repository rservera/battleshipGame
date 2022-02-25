import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  columns: 10,
  rows: 10,
  player1Name: 'Player 1',
  player2Name: 'CPU',
  player2User: 'CPU',
  shipSunkFeedback: false,
};

const gameConfiguration = createSlice({
  name: 'gameConfiguration',
  initialState,
  reducers: {
    setColumns: (state, action) => {
      state.columns = action.payload;
    },
    setRows: (state, action) => {
      state.rows = action.payload;
    },
    setPlayer1Name: (state, action) => {
      state.player1Name = action.payload;
    },
    setPlayer2Name: (state, action) => {
      state.player2Name = action.payload;
    },
    setPlayer2User: (state, action) => {
      state.player2User = action.payload;
    },
    setShipSunkFeedback: (state, action) => {
      state.shipSunkFeedback = action.payload;
    },
  },
});

export const {
  setColumns,
  setRows,
  setPlayer1Name,
  setPlayer2Name,
  setPlayer2User,
  setShipSunkFeedback,
} = gameConfiguration.actions;

export const getColumns = (state) => state.gameConfiguration.columns;
export const getRows = (state) => state.gameConfiguration.rows;
export const getPlayer1Name = (state) => state.gameConfiguration.player1Name;
export const getPlayer2Name = (state) => state.gameConfiguration.player2Name;
export const getPlayer2User = (state) => state.gameConfiguration.player2User;
export const getShipSunkFeedback = (state) => state.gameConfiguration.shipSunkFeedback;

export default gameConfiguration.reducer;
