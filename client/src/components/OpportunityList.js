import { useEffect, useMemo, useState } from "react";
import { useMongoDB } from "../initMongo";
import useQueryParam from "./useQueryParam";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSetRecoilState } from "recoil";
import { modalAtomFamily } from "./atoms";

dayjs.extend(relativeTime);

export default function OpportunityList({ filterData }) {
    let { db } = useMongoDB();
    let [filter, setFilter] = useQueryParam("opportunitesFilter");

    const [opportunities, setOpportunities] = useState(null);
    useEffect(() => {
        if (!filterData || !filter) return;
        let filterKeys = Object.keys(filterData);
        let selectedKeys = Object.keys(filter);

        let allFilled = filterKeys.every(
            (filterKey) =>
                filterKey === "_id" || selectedKeys.includes(filterKey)
        );

        if (allFilled) {
            if (!db) return;
            // console.log("fetch time!", parseFilter(filter));
            db.collection("listings")
                .find(parseFilter(filter))
                .then(setOpportunities);
        }
    }, [filter]);

    return (
        <div className="opportunities-list">
            {opportunities &&
                opportunities.map((listData) => (
                    <ListItem key={listData.listingId} listData={listData} />
                ))}
        </div>
    );
}

function parseFilter(filter) {
    let query = {};

    Object.entries(filter).forEach(([filterKey, filterDetails]) => {
        const {
            field: { path, type },
            itemValue,
        } = filterDetails;

        switch (type) {
            case "Array":
                query[path] = { $all: [itemValue] };
                break;
            default:
                query[path] = itemValue;
        }
    });

    return query;
}

function ListItem({ listData }) {
    // console.log(listData);

    const {
        recruiterData,
        topic,
        programTitle,
        views,
        applied,
        postDate,
        opportunityType,
        location,
        majorsConsidered,
        listingId,
    } = listData;

    let relativePostDate = useMemo(() => dayjs(postDate).fromNow(), [postDate]);
    const setModal = useSetRecoilState(modalAtomFamily("opportunity"));

    return (
        <div className="list-item">
            <div className="left">
                <img
                    src={recruiterData.imageSrc}
                    alt={recruiterData.facilityName}
                />
            </div>
            <div className="middle">
                <div>
                    <span className="facility-name fs-big ">
                        {recruiterData.facilityName}
                    </span>

                    <span>
                        {[relativePostDate, applied + " applied"].join(" · ")}
                    </span>
                </div>
                <div className="fc-light">{programTitle}</div>
                <div className="fc-light">
                    {[
                        majorsConsidered[0] +
                            (majorsConsidered.length > 1
                                ? ` & ${majorsConsidered.length} more`
                                : ""),
                        location === "remote" ? "remote" : location.state,
                        opportunityType,
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
