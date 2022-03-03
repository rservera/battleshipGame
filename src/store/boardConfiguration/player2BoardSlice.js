import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  board: [],
  ships: [],
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
