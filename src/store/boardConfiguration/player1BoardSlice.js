import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  board: [],
  ships: [
    {
      name: 'Carrier',
      position: [16, 17, 18, 19],
    },
    {
      name: 'Cruiser',
      position: [58, 68, 78],
    },
    {
      name: 'Cruiser',
      position: [53, 54, 55],
    },
    {
      name: 'Cruiser',
      position: [81, 82, 83],
    },
    {
      name: 'Submarine',
      position: [22, 32],
    },
  ],
  availableFireOptions: [],
  shipsPositions: [],
};

const player1Board = createSlice({
  name: 'player1Board',
  initialState,
  reducers: {
    setPlayer1Board: (state, action) => {
      state.board = action.payload;
    },
    setPlayer1AvailableFireOptions: (state, action) => {
      state.availableFireOptions = action.payload;
    },
    setPlayer1Ships: (state, action) => {
      state.ships = action.payload;
    },
    setPlayer1ShipsPositions: (state, action) => {
      state.shipsPositions = action.payload;
    },
  },
});

export const {
  setPlayer1Board,
  setPlayer1AvailableFireOptions,
  setPlayer1Ships,
  setPlayer1ShipsPositions,
} = player1Board.actions;

export const getPlayer1Board = (state) => state.player1Board.board;
export const getPlayer1AvailableFireOptions = (state) => state.player1Board.availableFireOptions;
export const getPlayer1Ships = (state) => state.player1Board.ships;
export const getPlayer1ShipsPositions = (state) => state.player1Board.shipsPositions;

export default player1Board.reducer;
