import { ReactComponent as TeamSvg } from "../../../assets/dashboard/team.svg";
import { ReactComponent as ProjectsSvg } from "../../../assets/dashboard/projects.svg";
import { ReactComponent as CandidatesSvg } from "../../../assets/dashboard/candidates.svg";
import DashboardSidebarButton from "../components/DashboardSidebarButton";

export default function RecruiterSidebar() {
    return (
        <div id="recruiter-sidebar" className="button-wrapper">
            <DashboardSidebarButton
                Iconsvg={TeamSvg}
                label="Create Listing"
                to="create-listing"
            />
            <DashboardSidebarButton
                Iconsvg={TeamSvg}
                label="Teams"
                to="teams"
            />
            <DashboardSidebarButton
                Iconsvg={ProjectsSvg}
                label="Projects"
                to="projects"
            />
            <DashboardSidebarButton
                Iconsvg={CandidatesSvg}
                label="Candidates"
                to="candidates"
            />
        </div>
    );
}
