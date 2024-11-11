import React, { useEffect } from "react";
import { TextField, Grid, Box, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearForm, setErrors, setFormData } from "../redux/slices/EmployeeSlice";
import { RootState } from "../redux/store";
import axios from "axios";

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
   
  }, [employeeId, action]);

  useEffect(() => {
    const fetchEmployee = () => {
      axios.get(`/api/employees/${employeeId}`)
        .then(response => {
          dispatch(setFormData({ ...response.data.employee, id: undefined }));
        })
        .catch(error => {
          console.log("errr");
        })
        .finally(() => {

        });
    };
  
    fetchEmployee();
    return () => {
      dispatch(clearForm());
    };
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
    axios.put(`/api/employees/${employeeId}`, data)
      .then(response => {
        if (response.status === 200) {
          navigate("/");
        } else {
          throw new Error("Failed to update employee");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        dispatch(setErrors({ form: "An error occurred while saving the employee data." }));
      })
      .finally(() => {
        dispatch(clearForm());
      });
  } else {
    // Create new employee API call
    axios.post('/api/employees', data)
      .then(response => {
        if (response.status === 201) {
          navigate("/");
        } else {
          throw new Error("Failed to create employee");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        dispatch(setErrors({ form: "An error occurred while saving the employee data." }));
      })
      .finally(() => {
        dispatch(clearForm());
      });
  }
} catch (error) {
      console.log(error)
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
