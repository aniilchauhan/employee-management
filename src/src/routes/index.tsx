

// routes
import { useRoutes } from "react-router-dom";
import EmployeeList from "../pages/EmployeeList";
import EmployeeForm from "../pages/EmployeeForm";
import NoPageFound from "../pages/NoPageFount";
import EmployeeProfile from "../pages/EmployeeProfile";


export default function AllRoutes() {
    return useRoutes([
        {
            path: "",
            element: <EmployeeList />,
        },
        {
            path: "employee-list",
            element: <EmployeeList />,
        },
        {
            path: "create-employee",
            element: <EmployeeForm action={"create"} />,
        },
        {
            path: "edit-employee/:employeeId",
            element: <EmployeeForm action={"edit"}/>,
        },
        {
            path: "employee-profile/:employeeId",
            element: <EmployeeProfile/>,
        },
        {
            path: "*",
            element: <NoPageFound />,
        },
    ]);
}
