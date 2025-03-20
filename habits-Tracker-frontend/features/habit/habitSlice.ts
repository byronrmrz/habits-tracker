import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHabits } from "./habitApi";

type Habit = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  days: number;
  lastDone: Date;
  lastUpdate: Date;
  startedAt: Date;
  // updatedAt: string;
};
type HabitsState = {
  habits: Habit[];
  status: Record<string, "idle" | "loading" | "success" |"failed">;
  error: Record<string, string | null>;
};

const initialState: HabitsState = {
  habits: [],
  status: {},
  error: {},
};

export const fetchHabitsThunk = createAsyncThunk(
  "habit/fetchHabits",
  async () => {
    const response = await fetchHabits();
    return response;
  }
);

export const markAsDoneThunk = createAsyncThunk(
  "habit/markasdone",
  async (habitId: string, {rejectWithValue}) => {
    const response = await fetch(
      `http://localhost:3001/habits/markasdone/${habitId}`,
      {
        method: "PATCH",
      }
    );
    const responseJson = await response.json();
    if( !response.ok){
      return rejectWithValue("Failed to mark habit as done")
    }else if( responseJson.message.toString() === "Habit restarted"){
      return rejectWithValue(responseJson.message)
    }else{
      return responseJson.message;
    }
  }
);

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
    builder.addCase(fetchHabitsThunk.fulfilled, (state, action) => {
      state.habits = action.payload;
    }).addCase(markAsDoneThunk.fulfilled, (state, action) => {
      state.status[action.meta.arg] = "success";
      state.error[action.meta.arg]= null;
    }).addCase(markAsDoneThunk.rejected, (state, action) => {
      state.status[action.meta.arg] = "failed";
      state.error[action.meta.arg] = action.payload as string;
      });
  },
});
export const { addHabit, removeHabit, addHabits } = habitsSlice.actions;
export default habitsSlice.reducer;
