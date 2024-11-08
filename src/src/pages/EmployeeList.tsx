import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Delete, Edit, Search, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Button, Box, IconButton } from "@mui/material";
import ConfirmationModal from "../modals/ConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setEmployees } from "../redux/slices/EmployeeSlice";
import axios from "axios";

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { employees } = useSelector((state: RootState) => state.employee);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/employees');
        dispatch(setEmployees(response.data.employees));
      } catch (error) {
        dispatch(setEmployees([]));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      headerAlign: "center",
      width: 200,
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      width: 200,
      align: "center",
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      headerAlign: "center",
      width: 200,
      align: "center",
    },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "center",
      width: 300,
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      width: 250,
      renderCell: (params) => (
        <Grid container spacing={1} alignItems="center" justifyContent="center">
          <Grid item>
            <IconButton onClick={() => handleViewDetails(params.row.id)}>
              <Visibility />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={() => handleEdit(params.row)}>
              <Edit />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton color="error"
              onClick={() => {
                setItemToDelete(params.row.id);
                setShowConfirmationModal(true);
              }}>
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];

  const handleDelete = async () => {
    if (itemToDelete === null) return;

    setIsLoading(true);

    try {
      const response = await axios.delete(`/api/employees/${itemToDelete}`);
      if (response.status === 204) {
        const updatedEmployees = employees.filter((employee) => employee.id !== itemToDelete);
        dispatch(setEmployees(updatedEmployees));
        localStorage.setItem("employeesData", JSON.stringify(updatedEmployees));
        setItemToDelete(null);
        setShowConfirmationModal(false);
        alert("Deleted Successfully")
      } else {
        console.error("Failed to delete employee.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/employee-profile/${id}`);
  };

  const handleEdit = (employee: any) => {
    navigate(`/edit-employee/${employee.id}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleDelete}
      />
      <Box>
        <Grid container justifyContent="space-between" style={{ marginBottom: "20px" }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "150px" }}
              onClick={() => navigate("create-employee")}
            >
              Create
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={employees}
            columns={columns}
            hideFooterPagination
            hideFooter
            sx={{
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f0f0f0",
                borderBottom: "1px solid #ddd",
                borderRight: "1px solid #ddd",
              },
              "& .MuiDataGrid-columnHeader:last-child": {
                borderRight: "none",
              },
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid #ddd",
              },
              "& .MuiDataGrid-cell:last-child": {
                borderRight: "none",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeList;
