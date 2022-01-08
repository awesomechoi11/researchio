import RecruiterSidebar from "../recruiter/RecruiterSidebar";
import { ReactComponent as HomeSvg } from "../../../assets/dashboard/home.svg";

import DashboardSidebarButton from "./DashboardSidebarButton";

export default function DashboardSidebar() {
    return (
        <div id="dashboard-sidebar">
            <div className="logo fs-jumbo fw-bold fc-primary">Re:Search</div>
            <div id="common-sidebar" className="button-wrapper">
                <DashboardSidebarButton Iconsvg={HomeSvg} label="Home" to="" />
            </div>
            <RecruiterSidebar />
        </div>
    );
}
