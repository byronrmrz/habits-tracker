import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHabits } from "./habitApi";

type Habit = {
  id: string;
  title: string;
  description: string;
  // createdAt: string;
  // updatedAt: string;
};
type HabitsState = {
  habits: Habit[];
};

const initialState: HabitsState = {
  habits: [],
};

export const fetchHabitsThunk = createAsyncThunk("habit/fetchHabits", async () => {
    const response = await fetchHabits();
    return response;
    });


const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    addHabit(state, action) {
      state.habits.push(action.payload);
    },
    removeHabit(state, action) {
      state.habits = state.habits.filter(
        (habit) => habit.id !== action.payload
      );
    },
    addHabits: (state, action) => {
      state.habits = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase( fetchHabitsThunk.fulfilled, (state, action) => {
        state.habits = action.payload;
        });
        },
});
export const { addHabit, removeHabit, addHabits } = habitsSlice.actions;
export default habitsSlice.reducer;
