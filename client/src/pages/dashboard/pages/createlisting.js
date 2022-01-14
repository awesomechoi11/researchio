import { useRecoilValue } from "recoil";
import { createListingProjectAtom } from "../../../components/atoms";
// import { createListingProjectAtom } from "../../../components/atoms";

import CreateListingOpening from "../components/CreateListing/CreateListingOpening";
import CreateListingQuestions from "../components/CreateListing/CreateListingQuestions";
import CreateListingSettings from "../components/CreateListing/CreateListingSettings";
import CreateListingFinalize from "../components/CreateListing/CreateListingFinalize";
import CreateListingProject from "../components/CreateListing/CreateListingProject";

export default function CreateListingPage() {
    const listingProjectData = useRecoilValue(createListingProjectAtom);

    return (
        <div id="create-listing-page" className="dashboard-page">
            <div className="page-title fs-jumbo fw-bold">Create Listing</div>
            <CreateListingProject />
            {listingProjectData.project && <CreateListingOpening />}
            {listingProjectData.opening && <CreateListingQuestions />}
            {listingProjectData.opening && <CreateListingSettings />}
            {listingProjectData.settings && <CreateListingFinalize />}
        </div>
    );
}
