import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";

const NoPageFound: React.FC = () => {
  const navigate = useNavigate();

  const goToHomePage = (): void => {
    navigate("/");
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4">No Page Found</Typography>
      <Typography variant="body1">
        The page you are looking for does not exist.
      </Typography>
      <Button onClick={goToHomePage}>Go to Home</Button>
    </Box>
  );
};

export default NoPageFound;
