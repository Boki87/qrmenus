import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  Store,
} from "@reduxjs/toolkit";

interface ThunkExtraArguments {
  store: Store;
}

interface ModalsState {
  alertDialog: {
    isOpen: boolean;
    isConfirmed: boolean;
    isDeclinded: boolean;
    message: string;
  };
  previewStoreDrawer: {
    isOpen: boolean;
    storeId: string;
  };
}

const initialState: ModalsState = {
  alertDialog: {
    isOpen: false,
    message: "",
    isConfirmed: false,
    isDeclinded: false,
  },
  previewStoreDrawer: {
    isOpen: false,
    storeId: "",
  },
};

const modals = createSlice({
  name: "modals",
  initialState,
  reducers: {
    alertOpen(state, action: PayloadAction<{ message: string }>) {
      state.alertDialog.message = action.payload.message;
      state.alertDialog.isOpen = true;
      state.alertDialog.isConfirmed = false;
      state.alertDialog.isDeclinded = false;
    },
    alertConfirm(state) {
      state.alertDialog.isOpen = false;
      state.alertDialog.isConfirmed = true;
      state.alertDialog.isDeclinded = false;
      state.alertDialog.message = "";
    },
    alertDecline(state) {
      state.alertDialog.isOpen = false;
      state.alertDialog.isConfirmed = false;
      state.alertDialog.isDeclinded = true;
      state.alertDialog.message = "";
    },
    alertClose(state) {
      state.alertDialog.isOpen = false;
      state.alertDialog.isConfirmed = false;
      state.alertDialog.isDeclinded = false;
      state.alertDialog.message = "";
    },
    openPreview(state, action: PayloadAction<string>) {
      state.previewStoreDrawer.storeId = action.payload;
      state.previewStoreDrawer.isOpen = true;
    },
    closePreview(state) {
      state.previewStoreDrawer.isOpen = false;
    },
  },
});

export const {
  alertOpen,
  alertDecline,
  alertConfirm,
  alertClose,
  openPreview,
  closePreview,
} = modals.actions;
export default modals.reducer;

export const openConfirmDialog = createAsyncThunk<
  boolean,
  string,
  { extra: ThunkExtraArguments }
>("modals/confirmModal", async (message, { extra, dispatch }) => {
  const store = extra.store;
  dispatch(modals.actions.alertOpen({ message }));

  return new Promise<boolean>((res) => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state.modals.alertDialog.isConfirmed) {
        unsubscribe();
        res(true);
      }
      if (state.modals.alertDialog.isDeclinded) {
        unsubscribe();
        res(false);
      }
    });
  });
});
