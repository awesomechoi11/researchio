import DashboardGridBlock from "../components/DashboardGridBlock";
import HomeGettingStarted from "../components/HomePage/HomeGettingStarted";
import "./dashboardhome.scss";

export default function DashboardHome() {
    return (
        <div id="create-listing-page" className="dashboard-page">
            <div className="page-title fs-jumbo fw-bold">Home</div>
            <HomeGettingStarted />
        </div>
    );
}
