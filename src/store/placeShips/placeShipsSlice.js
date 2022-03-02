import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shipsPlacementBoard: [],
  currentShipSize: null,
  orientation: 'horizontal',
};

const placeShips = createSlice({
  name: 'placeShips',
  initialState,
  reducers: {
    setShipsPlacementBoard: (state, action) => {
      state.shipsPlacementBoard = action.payload;
    },
    setCurrentShipSize: (state, action) => {
      state.currentShipSize = action.payload;
    },
    setOrientation: (state, action) => {
      state.orientation = action.payload;
    },
  },
});

export const {
  setShipsPlacementBoard,
  setCurrentShipSize,
  setOrientation,
} = placeShips.actions;

export const getShipsPlacementBoard = (state) => state.placeShips.availableCells;
export const getCurrentShipSize = (state) => state.placeShips.currentShipSize;
export const getOrientation = (state) => state.placeShips.orientation;

export default placeShips.reducer;
