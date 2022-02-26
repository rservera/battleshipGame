import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playerTurn: 'player1',
};

const game = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPlayerTurn: (state, action) => {
      state.playerTurn = action.payload;
    },
  },
});

export const {
  setPlayerTurn,
} = game.actions;

export const getPlayerTurn = (state) => state.game.playerTurn;

export default game.reducer;
