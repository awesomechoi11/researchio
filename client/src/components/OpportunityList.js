import { useEffect, useMemo, useState } from "react";
import { useMongoDB } from "../initMongo";
import useQueryParam from "./useQueryParam";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSetRecoilState } from "recoil";
import { modalAtomFamily } from "./atoms";
import DefaultProfileImg from "../assets/default profile.png";
dayjs.extend(relativeTime);

export default function OpportunityList({ filterData }) {
    let { db } = useMongoDB();
    let [filter, setFilter] = useQueryParam("opportunitesFilter");

    const [opportunities, setOpportunities] = useState(null);
    useEffect(() => {
        // return;
        if (!filterData || !filter) return;
        let filterDataKeys = Object.keys(filterData);
        let selectedKeys = Object.keys(filter);

        // scuffed validation
        let allFilled = filterDataKeys.every(
            (filterKey) =>
                filterKey === "_id" ||
                selectedKeys.includes(`opportunities-${filterKey}`)
        );

        if (!allFilled) return;
        if (!db) return;
        // console.log("fetch time!", parseFilter(filter, filterData));
        // return;
        db.collection("listings")
            .find(parseFilter(filter, filterData))
            .then(setOpportunities);
    }, [filter, db, filterData]);
    console.log(opportunities);
    return (
        <div className="opportunities-list">
            {opportunities &&
                opportunities.map((listData) => (
                    <ListItem key={listData.listingId} listData={listData} />
                ))}
        </div>
    );
}

function parseFilter(filter, filterData) {
    let query = {};
    // console.log(filter, filterData);
    // return;
    Object.entries(filterData).forEach(([filterDataKey, filterDetails]) => {
        const {
            field: { path, type },
        } = filterDetails;
        let itemValue;
        // console.log(
        //     filterDataKey,
        //     filter[`opportunities-${filterDataKey}`],
        //     filterDetails
        // );
        switch (type) {
            case "Array":
                itemValue = filter[`opportunities-${filterDataKey}`];
                query[path] = { $all: [itemValue] };
                break;
            default:
                itemValue = filter[`opportunities-${filterDataKey}`].value;
                query[path] = itemValue;
        }
    });
    console.log(query);
    return query;
}

function ListItem({ listData }) {
    // console.log(listData);

    const { recruiter, opening, settings, applied, title } = listData;

    let relativePostDate = useMemo(
        () => dayjs(settings.publishDate).fromNow(),
        [settings]
    );
    const setModal = useSetRecoilState(modalAtomFamily("opportunity"));

    return (
        <div className="list-item">
            <div className="left">
                <img src={DefaultProfileImg} alt={recruiter.firstName} />
            </div>
            <div className="middle">
                <div>
                    <span className="facility-name fs-big ">
                        {opening.department}
                    </span>

                    <span>
                        {[relativePostDate, applied + " applied"].join(" · ")}
                    </span>
                </div>
                <div className="fc-light">{title}</div>
                <div className="fc-light">
                    {[
                        opening.majorsConsidered[0].label +
                            (opening.majorsConsidered.length > 1
                                ? ` & ${opening.majorsConsidered.length} more`
                                : ""),
                        opening.remote === "remote" ? "remote" : opening.state,
                        opening.opportunityType.label,
                    ].join(" · ")}
                </div>
            </div>
            <div className="right">
                <button
                    onClick={() => {
                        setModal({
                            open: true,
                            data: listData,
                        });
                    }}
                >
                    view more
                </button>
            </div>
        </div>
    );
}
