import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { Employee } from "../types/employeeTypes";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const EmployeeProfile: React.FC = () => {
  const { employeeId } = useParams(); // Typing the id from useParams
  const [user, setUser] = useState<Employee | null>(null); // Typing user state
  const { employees } = useSelector((state: RootState) => state.employee);
  useEffect(() => {
    const currentEmployee = employees.find((data, index) => data.id == employeeId);
    setUser(currentEmployee || null); // If no user is found, set null
  }, [employeeId]);

  return (
    <Box
      style={{
        padding: "20px",
        margin: "20px auto",
        maxWidth: "600px",
        border: "1px solid grey",
        borderRadius: "5px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      {user ? (
        <Box>
          <Typography variant="body1">
            <strong>Name:</strong> {user.name}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {user.phoneNumber ? user.phoneNumber : "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user.email ? user.email : "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Address:</strong> {user.address ? user.address : "-"}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1">User not found</Typography>
      )}
    </Box>
  );
};

export default EmployeeProfile;
