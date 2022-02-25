import { configureStore, combineReducers } from '@reduxjs/toolkit';
import gameConfiguration from './gameConfiguration/gameConfigurationSlice';
import boardConfiguration from './boardConfiguration/boardConfigurationSlice';

const allReducers = combineReducers({
  gameConfiguration,
  boardConfiguration,
});

const store = configureStore({
  reducer: allReducers,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
