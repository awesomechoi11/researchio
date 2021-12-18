import { useEffect, useState } from "react";
import { useMongoDB } from "../initMongo";
import "react-dropdown/style.css";
import "./opportunities.scss";
import OpportunityFilter from "../components/OpportunityFilter";
import OpportunityList from "../components/OpportunityList";

export default function OpportunitiesPage() {
    let { db } = useMongoDB();

    const [filterData, setFilterData] = useState(null);

    useEffect(() => {
        if (!db) return;
        db.collection("misc")
            .findOne({ _id: "filters" })
            .then((data) => {
                delete data._id;
                setFilterData(data);
            });
    }, [db]);

    return (
        <div id="home">
            <div className="main">
                <div className="fs-jumbo fw-bold title">
                    Find Research Opportunities
                </div>
                {filterData && (
                    <>
                        <OpportunityFilter filterData={filterData} />
                        <OpportunityList filterData={filterData} />
                    </>
                )}
            </div>
        </div>
    );
}
