import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  board: [],
  ships: [
    {
      name: 'Carrier',
      position: [0, 1, 2, 3],
      size: 4,
      hitsReceived: 0,
      isSunk: false,
    },
    {
      name: 'Cruiser #1',
      position: [42, 43, 44],
      size: 3,
      hitsReceived: 0,
      isSunk: false,
    },
    {
      name: 'Cruiser #2',
      position: [38, 48, 58],
      size: 3,
      hitsReceived: 0,
      isSunk: false,
    },
    {
      name: 'Cruiser #3',
      position: [74, 84, 94],
      size: 3,
      hitsReceived: 0,
      isSunk: false,
    },
    {
      name: 'Submarine',
      position: [40, 50],
      size: 2,
      hitsReceived: 0,
      isSunk: false,
    },
  ],
  shipsPositions: [],
  shipsSunk: 0,
};

const player2Board = createSlice({
  name: 'player2Board',
  initialState,
  reducers: {
    setPlayer2Board: (state, action) => {
      state.board = action.payload;
    },
    setPlayer2Ships: (state, action) => {
      state.ships = action.payload;
    },
    setPlayer2ShipsPositions: (state, action) => {
      state.shipsPositions = action.payload;
    },
    setPlayer2ShipsSunk: (state, action) => {
      state.shipsSunk = action.payload;
    },
  },
});

export const {
  setPlayer2Board,
  setPlayer2Ships,
  setPlayer2ShipsPositions,
  setPlayer2ShipsSunk,
} = player2Board.actions;

export const getPlayer2Board = (state) => state.player2Board.board;
export const getPlayer2Ships = (state) => state.player2Board.ships;
export const getPlayer2ShipsPositions = (state) => state.player2Board.shipsPositions;
export const getPlayer2ShipsSunk = (state) => state.player2Board.shipsSunk;

export default player2Board.reducer;
