import { combineReducers, createSlice } from '@reduxjs/toolkit';
import React, { useState, useEffect } from "react";
import produce from 'immer';

const skillsSlice = createSlice({
  name: 'skills',
  initialState: { skills: [] },
  reducers: {
    addSkill: (state, action) => {
      const newSkills = action.payload;
      state.skills = newSkills;
    },
    addLevel: (state, action) => {
      const { skillIndex, levelIncrease } = action.payload;
      state.skills[skillIndex].level += levelIncrease;
    },
  }
});

export const { addSkill , addLevel } = skillsSlice.actions;

// Async action creator to load initial skills data from file
export const loadSkills = () => dispatch => {
  fetch('/skills.json')
    .then(response => response.json())
    .then(data => {
      dispatch(addSkills(data.skills));
      console.log(data.skills);
    })
    .catch(error => {
      console.error('Error loading skills data:', error);
    });
};

// Helper action creator to add an array of skills to the state
const addSkills = skills => ({ type: addSkill.type, payload: skills });

export default skillsSlice.reducer;
