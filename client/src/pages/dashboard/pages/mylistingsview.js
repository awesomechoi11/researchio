import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMongoDB } from "../../../initMongo";

export default function MyListingsViewPage() {
    let { listingId } = useParams();

    const [data, setData] = useState();
    const { db, user } = useMongoDB();
    // let navigate = useNavigate();
    const rowCount = 2;
    //get listing
    useEffect(() => {
        if (!db) return;

        db.collection("listings")
            .findOne({ userId: user.id, listingId })
            .then((data) => {
                let main = [];
                let sub = [];
                data.forEach((element, index) => {
                    sub.push(element);
                    if (
                        index % rowCount === rowCount - 1 ||
                        index === data.length - 1
                    ) {
                        main.push(sub);
                        sub = [];
                    }
                });
                setData(main);
            });
    }, [db]);
}
