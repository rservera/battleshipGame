import { configureStore, combineReducers } from '@reduxjs/toolkit';
import gameConfiguration from './gameConfiguration/gameConfigurationSlice';

const allReducers = combineReducers({
  gameConfiguration,
});

const store = configureStore({
  reducer: allReducers,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
