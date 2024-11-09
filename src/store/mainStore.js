import { create } from "zustand";

const useStore = create((set) => ({
  userType: "student", // Default user type
  setUserType: (type) => set({ userType: type }),
}));

export default useStore;
