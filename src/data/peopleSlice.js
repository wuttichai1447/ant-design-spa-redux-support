import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  people: [],
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    addPerson: (state, action) => {
      state.people.push(action.payload);
    },
    deletePerson: (state, action) => {
      state.people = state.people.filter(person => person.id !== action.payload);
    },
    updatePerson: (state, action) => {
      const { id, updatedPerson } = action.payload;
      const index = state.people.findIndex(person => person.id === id);
      if (index !== -1) {
        state.people[index] = { ...state.people[index], ...updatedPerson };
      }
    },
  },
});

export const { addPerson, deletePerson, updatePerson } = peopleSlice.actions;

export default peopleSlice.reducer;
