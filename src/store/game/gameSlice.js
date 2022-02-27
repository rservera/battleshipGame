import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playerTurn: 'player1',
  CPUBestFireOptions: [],
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
  },
});

export const {
  setPlayerTurn,
  setCPUBestFireOptions,
} = game.actions;

export const getPlayerTurn = (state) => state.game.playerTurn;
export const getCPUBestFireOptions = (state) => state.game.CPUBestFireOptions;

export default game.reducer;
