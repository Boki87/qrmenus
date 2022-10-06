import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../../types/UserProfile";

interface UserState {
  selectedStore: string;
  selectedCategory: number;
  categoryToEdit: number;
}

const initialState: UserState = {
  selectedCategory: -1,
  selectedStore: "",
  categoryToEdit: -1,
};

const userSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    setSelectedStore(state, action: PayloadAction<string>) {
      state.selectedStore = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<number>) {
      state.selectedCategory = action.payload;
    },
    setCategoryToEdit(state, action: PayloadAction<number>) {
      state.categoryToEdit = action.payload;
    },
  },
});

export const { setSelectedStore, setSelectedCategory, setCategoryToEdit } =
  userSlice.actions;
export default userSlice.reducer;
