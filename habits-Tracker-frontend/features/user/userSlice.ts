import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchRegisterUsers, fetchLoginUsers } from "./userApi";

interface userThunk {
  username: string;
  password: string;
}
type User = {
  token: string;
};

type UserState = {
  users: User | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
};

const initialState: UserState = {
  users: null,
  status: "idle",
  error: null,
};

export const fetchRegisterUserThunk = createAsyncThunk(
  "user/fetchRegisterUser",
  async ({ username, password }: userThunk, { rejectWithValue }) => {
    const response = await fetchRegisterUsers(username, password);
    const responseJson = await response.json();
    if (!response.ok) {
      return rejectWithValue("Failed to register user");
    } else if (
      responseJson.message.toString() === "Usuario registrado correctamente"
    ) {
      return responseJson.message;
    } else {
      return rejectWithValue(responseJson.message);
    }
  }
);

export const fetchLoginUserThunk = createAsyncThunk(
  "user/fetchLoginUsers",
  async ({ username, password }: userThunk, { rejectWithValue }) => {
    const response = await fetchLoginUsers(username, password);
    const responseJson = await response.json();
    if (!response.ok) {
        console.log('responseJson',responseJson);

      return rejectWithValue("Failed to login user");
    } else if (responseJson.message.toString() === "Inicio de Sesión exitoso") {
        console.log('responseJson',responseJson);
      return responseJson.token;
    } else {
      return rejectWithValue(responseJson.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUserThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.users = null;
        state.error = action.payload as string;
        alert("Usuario Registrado correctamente");
      })
      .addCase(fetchRegisterUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.users = null;
        state.error = action.payload as string;
        alert("No es posible registrar al usuario en este momento");
      })
      .addCase(fetchLoginUserThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.users = action.payload;
        state.error = action.payload as string;
        alert("Inicio de sesión exitoso");
      })
      .addCase(fetchLoginUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.users = null;
        state.error = action.payload as string;
        alert("No es posible iniciar sesión en este momento");
      });
  },
});
export const {addUser} = userSlice.actions;
export default userSlice.reducer;
