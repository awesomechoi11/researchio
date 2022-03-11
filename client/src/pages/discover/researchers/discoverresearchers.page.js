import "./discoverresearchers.scss";
import SearchBar from "./search";
import SearchResults from "./searchresults";

export default function DiscoverResearchersPage() {
    return (
        <div id="discoverresearchers">
            <div className="main">
                <div className="fs-jumbo fw-bold title">
                    Discover Researchers
                </div>
                <SearchBar />
                <SearchResults />
            </div>
        </div>
    );
}
