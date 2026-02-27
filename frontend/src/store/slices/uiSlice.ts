import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isMobileMenuOpen: boolean;
  isCartSidebarOpen: boolean;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
}

const initialState: UiState = {
  isMobileMenuOpen: false,
  isCartSidebarOpen: false,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.isMobileMenuOpen = action.payload;
    },
    toggleCartSidebar(state) {
      state.isCartSidebarOpen = !state.isCartSidebarOpen;
    },
    setCartSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isCartSidebarOpen = action.payload;
    },
    showNotification(state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    },
  },
});

export const {
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleCartSidebar,
  setCartSidebarOpen,
  showNotification,
  clearNotification,
} = uiSlice.actions;
export default uiSlice.reducer;
