import { createSlice  } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHabits } from "./habitApi";
type Habit = {
    id: string;
    title: string;
    description: string;
    createdAt: Date; //OJO CON LA FECHA ACA
}

type HabitsState = {
    habits: Habit[];
}

const initialState: HabitsState = {
    habits: []
}

export const fetchHabitsThunk = createAsyncThunk("habit/fetchHabits", async () => {
    return await fetchHabits();
});

const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        addHabits(state, action) {
            state.habits = action.payload;
        },
        addHabit(state, action) {
            state.habits.push(action.payload);
        },
        removeHabit(state, action) {
            state.habits = state.habits.filter(habit => habit.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchHabitsThunk.fulfilled, (state, action) => {
            state.habits = action.payload;
        });
    }
});

export const { addHabits, addHabit, removeHabit } = habitSlice.actions;
export default habitSlice.reducer;  //exportamos el reducer para que pueda ser utilizado en el store