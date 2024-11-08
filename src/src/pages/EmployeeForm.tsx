import React, { useEffect, useState } from "react";
import { TextField, Grid, Box, Typography, Button } from "@mui/material";
import { EmployeeFormData, FormErrors } from '../types/employeeTypes';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearForm, setEmployees, setErrors, setFormData } from "../redux/slices/EmployeeSlice";
import { RootState } from "../redux/store";

const EmployeeForm: React.FC<{ action: "create" | "edit" }> = ({ action }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const { formData, errors, employees } = useSelector((state: RootState) => state.employee);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setFormData({
      ...formData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (action === "edit" && employeeId) {
      const currentEmployee = employees.find((data) => data.id == employeeId);
      if (currentEmployee) {
        dispatch(setFormData({ ...currentEmployee, id: undefined }));
      }
    }
    return () => {
      dispatch(clearForm())
    }
  }, [employeeId, action]);

  const handleSubmit = async () => {
    const { name, email, phoneNumber, address } = formData;
    const newErrors: any = { name: "", email: "", phoneNumber: "", address: "" };

    const phoneNumberRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.trim() === "") {
      newErrors.name = "Name field is required";
    }
    if (email.trim() === "") {
      newErrors.email = "Email field is required";
    } else if (!email.match(emailRegex)) {
      newErrors.email = "Invalid email format";
    }
    if (phoneNumber.trim() === "") {
      newErrors.phoneNumber = "Phone number field is required";
    } else if (!phoneNumber.match(phoneNumberRegex)) {
      newErrors.phoneNumber = "Invalid phone number";
    }
    if (address.trim() === "") {
      newErrors.address = "Address field is required";
    }

    if (Object.keys(newErrors).some((key) => newErrors[key])) {
      dispatch(setErrors(newErrors));
      return;
    }

    const data = { name, email, phoneNumber, address };

    try {
      if (action === "edit" && employeeId) {
        // Update employee API call
        const response = await fetch(`/api/employees/${employeeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const updatedEmployee = await response.json();
          const updatedEmployees = employees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp));
          dispatch(setEmployees(updatedEmployees));
          navigate("/");
        } else {
          throw new Error("Failed to update employee");
        }
      } else {
        // Create new employee API call
        const response = await fetch('/api/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const newEmployee = await response.json();
          dispatch(setEmployees([...employees, newEmployee]));
          navigate("/");
        } else {
          throw new Error("Failed to create employee");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch(setErrors({ form: "An error occurred while saving the employee data." }));
    } finally {
      dispatch(clearForm());
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Typography variant="h5">{action === "create" ? "Create" : "Update"} Employee</Typography>
      </Box>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TextField
            label="Name*"
            name="name"
            variant="outlined"
            value={formData.name}
            error={!!errors.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          {!!errors.name && (
            <Typography color="error" variant="body2">
              {errors.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email*"
            name="email"
            error={!!errors.email}
            type="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          {!!errors.email && (
            <Typography color="error" variant="body2">
              {errors.email}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone Number*"
            name="phoneNumber"
            error={!!errors.phoneNumber}
            type="tel"
            variant="outlined"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          {!!errors.phoneNumber && (
            <Typography color="error" variant="body2">
              {errors.phoneNumber}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address*"
            name="address"
            error={!!errors.address}
            variant="outlined"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          {!!errors.address && (
            <Typography color="error" variant="body2">
              {errors.address}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Box sx={{ textAlign: "right", marginTop: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {action === "create" ? "Save" : "Update"}
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeForm;
