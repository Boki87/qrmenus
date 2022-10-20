import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Store } from "../../types/Store";
import { UserProfile } from "../../types/UserProfile";

interface UserState {
  selectedStore: Store | null;
  selectedCategory: number;
  categoryToEdit: number;
}

const initialState: UserState = {
  selectedCategory: -1,
  selectedStore: null,
  categoryToEdit: -1,
};

const userSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    setSelectedStore(state, action: PayloadAction<Store | null>) {
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
