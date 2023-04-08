import { createBrowserRouter } from "react-router-dom";
import BasicLogin from "./pages/BasicLogin";
import AdminLogin from "../src/pages/LoginForm";
import App from "../src/pages/App";
import Signup from "./pages/signUp";
import AdminPage from "./pages/Admin";

const router = createBrowserRouter([
    {
        path:"/adminlogin",
        element: <AdminLogin/>
    },
    {
        path:"/login",
        element: <BasicLogin/>
    },
    {
        path:"/signUp",
        element: <Signup/>
    },
    {
        path:"/",
        element: <App/>
    },
    {
        path:"/admin",
        element: <AdminPage/>
    }
]);

export default router;