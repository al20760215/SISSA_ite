import { create } from "zustand";

export const useCounterStore = create((set) => ({
  // estado inicial initial state.count
  count: 0,
  increment: () => {
    set((state) => ({ count: state.count + 1 }));
  },
  decrement: () => {
    set((state) => ({ count: state.count - 1 }));
  },
  reset: () => {
    set((state) => ({ ...state, count: 0 }));
  },
  double: () => {
    set((state) => ({ count: state.count * 2 }));
  },
  triple: () => {
    set((state) => ({ count: state.count * 3 }));
  },
  incrementBy: (amount) => {
    set((state) => ({ count: state.count + amount }));
  },
  decrementBy: (amount) => {
    set((state) => ({ ...state, count: state.count - amount }));
  },
  resetTo: (amount) => {
    set((state) => ({ ...state, count: amount }));
  },
  isEven: () => {
    state.count % 2 === 0;
  },
  isOdd: () => {
    state.count % 2 !== 0;
  },
  isPrime: () => {
    if (state.count <= 1) return false;
  },
}));
