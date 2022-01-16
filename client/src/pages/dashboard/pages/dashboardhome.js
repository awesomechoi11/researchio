import DashboardGridBlock from "../components/DashboardGridBlock";
import HomeFeatureRequest from "../components/HomePage/HomeFeatureRequest";
import HomeGettingStarted from "../components/HomePage/HomeGettingStarted";
import "./dashboardhome.scss";

export default function DashboardHome() {
    return (
        <div id="create-listing-page" className="dashboard-page">
            <div className="page-title fs-jumbo fw-bold">Home</div>
            <div className="dashboard-row">
                <HomeGettingStarted />
                <HomeFeatureRequest />
            </div>
        </div>
    );
}
