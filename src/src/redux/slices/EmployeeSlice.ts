import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormErrors } from '../../types/employeeTypes';

// Initial state for the form data and errors
interface EmployeeState {
  formData: {
    name: string,
    phoneNumber: string,
    address: string,
    email: string,
  };
  errors: any;
  employees:any[]
}

const initialFormData = {
  name: "",
  phoneNumber: "",
  address: "",
  email: "",
}
const initialState: EmployeeState = {
  formData: initialFormData,
  errors: {}, 
  employees:[]
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<any>) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    setEmployees: (state, action: PayloadAction<any>) => {
      state.employees = action.payload;
    },
    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload;
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    clearForm: (state) => {
      state.formData = initialFormData;
      state.errors = {};
    },
  },
});

export const { setFormData, setErrors, clearErrors, clearForm,setEmployees } = employeeSlice.actions;

export default employeeSlice.reducer;
