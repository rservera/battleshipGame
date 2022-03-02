import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playerTurn: 'player1',
  CPUBestFireOptions: [],
  CPUPreferredFireDirection: null,
  CPUFirstFireSuccessCellID: null,
};

const game = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPlayerTurn: (state, action) => {
      state.playerTurn = action.payload;
    },
    setCPUBestFireOptions: (state, action) => {
      state.CPUBestFireOptions = action.payload;
    },
    setCPUPreferredFireDirection: (state, action) => {
      state.CPUPreferredFireDirection = action.payload;
    },
    setCPUFirstFireSuccessCellID: (state, action) => {
      state.CPUFirstFireSuccessCellID = action.payload;
    },
  },
});

export const {
  setPlayerTurn,
  setCPUBestFireOptions,
  setCPUPreferredFireDirection,
  setCPUFirstFireSuccessCellID,
} = game.actions;

export const getPlayerTurn = (state) => state.game.playerTurn;
export const getCPUBestFireOptions = (state) => state.game.CPUBestFireOptions;
export const getCPUPreferredFireDirection = (state) => state.game.CPUPreferredFireDirection;
export const getCPUFirstFireSuccessCellID = (state) => state.game.CPUFirstFireSuccessCellID;

export default game.reducer;
