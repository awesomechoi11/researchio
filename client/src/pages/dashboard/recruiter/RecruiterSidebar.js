import { ReactComponent as TeamSvg } from "../../../assets/dashboard/team.svg";
import { ReactComponent as ProjectsSvg } from "../../../assets/dashboard/projects.svg";
import { ReactComponent as CandidatesSvg } from "../../../assets/dashboard/candidates.svg";
import { ReactComponent as CreatelistingSvg } from "../../../assets/dashboard/fileadd.svg";
import { ReactComponent as ViewlistingSvg } from "../../../assets/dashboard/fileview.svg";

import DashboardSidebarButton from "../components/DashboardSidebarButton";

export default function RecruiterSidebar() {
    return (
        <div id="recruiter-sidebar" className="button-wrapper">
            {/* <DashboardSidebarButton
                Iconsvg={ProjectsSvg}
                label="Projects"
                to="projects"
            /> */}
            <DashboardSidebarButton
                Iconsvg={CreatelistingSvg}
                label="Create Listing"
                to="create-listing"
            />

            <DashboardSidebarButton
                Iconsvg={ViewlistingSvg}
                label="My Listings"
                to="mylistings"
            />
            <DashboardSidebarButton
                Iconsvg={TeamSvg}
                label="Teams"
                to="teams"
            />

            <DashboardSidebarButton
                Iconsvg={CandidatesSvg}
                label="Candidates"
                to="candidates"
            />
        </div>
    );
}
