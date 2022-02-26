import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  board: [],
  ships: [
    {
      name: 'Carrier',
      position: [0, 1, 2, 3],
    },
    {
      name: 'Cruiser',
      position: [42, 43, 44],
    },
    {
      name: 'Cruiser',
      position: [38, 48, 58],
    },
    {
      name: 'Cruiser',
      position: [74, 84, 94],
    },
    {
      name: 'Submarine',
      position: [40, 50],
    },
  ],
  availableFireOptions: [],
  shipsPositions: [],
};

const player2Board = createSlice({
  name: 'player2Board',
  initialState,
  reducers: {
    setPlayer2Board: (state, action) => {
      state.board = action.payload;
    },
    setPlayer2AvailableFireOptions: (state, action) => {
      state.availableFireOptions = action.payload;
    },
    setPlayer1Ships: (state, action) => {
      state.ships = action.payload;
    },
    setPlayer2ShipsPositions: (state, action) => {
      state.shipsPositions = action.payload;
    },
  },
});

export const {
  setPlayer2Board,
  setPlayer2AvailableFireOptions,
  setPlayer1Ships,
  setPlayer2ShipsPositions,
} = player2Board.actions;

export const getPlayer2Board = (state) => state.player2Board.board;
export const getPlayer2AvailableFireOptions = (state) => state.player2Board.availableFireOptions;
export const getPlayer2Ships = (state) => state.player2Board.ships;
export const getPlayer2ShipsPositions = (state) => state.player2Board.shipsPositions;

export default player2Board.reducer;
