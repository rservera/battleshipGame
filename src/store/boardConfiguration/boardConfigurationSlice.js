import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  board: [],
};

const boardConfiguration = createSlice({
  name: 'boardConfiguration',
  initialState,
  reducers: {
    setBoardConfiguration: (state, action) => {
      state.board = action.payload;
    },
  },
});

export const {
  setBoardConfiguration,
} = boardConfiguration.actions;

export const getBoardConfiguration = (state) => state.boardConfiguration.board;

export default boardConfiguration.reducer;
