import { Outlet, Route, Routes } from "react-router-dom";
import DashboardSidebar from "./components/DashboardSidebar";
import "./dashboard.scss";

export default function DashboardPage() {
    // determine user type

    return (
        <div id="dashboard-page">
            <DashboardSidebar />
            <Outlet />
        </div>
    );
}
