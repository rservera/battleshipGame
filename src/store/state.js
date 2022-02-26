import { configureStore, combineReducers } from '@reduxjs/toolkit';
import gameConfiguration from './gameConfiguration/gameConfigurationSlice';
import player1Board from './boardConfiguration/player1BoardSlice';
import player2Board from './boardConfiguration/player2BoardSlice';
import game from './game/gameSlice';

const allReducers = combineReducers({
  gameConfiguration,
  player1Board,
  player2Board,
  game,
});

const store = configureStore({
  reducer: allReducers,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
