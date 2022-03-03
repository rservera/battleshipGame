import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  board: [],
  ships: [],
  availableFireOptions: [],
  shipsPositions: [],
  shipsSunk: 0,
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
    setPlayer1ShipsSunk: (state, action) => {
      state.shipsSunk = action.payload;
    },
  },
});

export const {
  setPlayer1Board,
  setPlayer1AvailableFireOptions,
  setPlayer1Ships,
  setPlayer1ShipsPositions,
  setPlayer1ShipsSunk,
} = player1Board.actions;

export const getPlayer1Board = (state) => state.player1Board.board;
export const getPlayer1AvailableFireOptions = (state) => state.player1Board.availableFireOptions;
export const getPlayer1Ships = (state) => state.player1Board.ships;
export const getPlayer1ShipsPositions = (state) => state.player1Board.shipsPositions;
export const getPlayer1ShipsSunk = (state) => state.player1Board.shipsSunk;

export default player1Board.reducer;
