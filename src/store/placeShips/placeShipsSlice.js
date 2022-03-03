import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shipsPlacementBoard: [],
  currentShipName: null,
  currentShipSize: null,
  orientation: 'horizontal',
  currentPreSelection: [],
};

const placeShips = createSlice({
  name: 'placeShips',
  initialState,
  reducers: {
    setShipsPlacementBoard: (state, action) => {
      state.shipsPlacementBoard = action.payload;
    },
    setCurrentShipName: (state, action) => {
      state.currentShipName = action.payload;
    },
    setCurrentShipSize: (state, action) => {
      state.currentShipSize = action.payload;
    },
    setOrientation: (state, action) => {
      state.orientation = action.payload;
    },
    setCurrentPreSelection: (state, action) => {
      state.currentPreSelection = action.payload;
    },
  },
});

export const {
  setShipsPlacementBoard,
  setCurrentShipName,
  setCurrentShipSize,
  setOrientation,
  setCurrentPreSelection,
} = placeShips.actions;

export const getShipsPlacementBoard = (state) => state.placeShips.shipsPlacementBoard;
export const getCurrentShipName = (state) => state.placeShips.currentShipName;
export const getCurrentShipSize = (state) => state.placeShips.currentShipSize;
export const getOrientation = (state) => state.placeShips.orientation;
export const getCurrentPreSelection = (state) => state.placeShips.currentPreSelection;

export default placeShips.reducer;
