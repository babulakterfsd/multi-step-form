/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  step: number;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  jobSchedule: string;
  cv: File | null;
  coverLetter: string;
}
const initialState: FormState = {
  step: 1,
  name: "",
  email: "",
  phone: "",
  jobTitle: "",
  jobSchedule: "",
  cv: null,
  coverLetter: "",
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ field: keyof FormState; value: any }>
    ) => {
      (state[action.payload.field] as FormState[keyof FormState]) =
        action.payload.value;
    },
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      state.step -= 1;
    },
    resetForm: () => initialState,
  },
});

export const { updateField, nextStep, prevStep, resetForm } = formSlice.actions;
export const selectFormState = (state: { form: FormState }) => state.form;
export default formSlice.reducer;
