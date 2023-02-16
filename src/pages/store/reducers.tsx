import { combineReducers, createSlice } from '@reduxjs/toolkit';import React, { useState, useEffect } from "react";

const testSlice = createSlice({
  name: 'test',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment } = testSlice.actions; // Extract the `increment` action creator from the `reducers` object in `testSlice`
export const testReducer = testSlice.reducer; // Export the `testReducer` function as a named export

const rootReducer = combineReducers({
  test: testReducer,
  // Add your other reducers here
});

export default rootReducer;