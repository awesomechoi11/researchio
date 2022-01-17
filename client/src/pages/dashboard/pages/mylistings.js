import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import { useMongoDB } from "../../../initMongo";
import DashboardGridBlock from "../components/DashboardGridBlock";
import DashboardGridBlockItem from "../components/DashboardGridBlockItem";
import "./mylisting.scss";

export default function MyListingsPage() {
    const [data, setData] = useState();
    const { db, user } = useMongoDB();
    let navigate = useNavigate();
    const rowCount = 2;
    //get listings and divide into 4s
    useEffect(() => {
        if (!db) return;

        db.collection("listings")
            .find({ userId: user.id })
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

    return (
        <div id="mylistings-page" className="dashboard-page">
            <div className="page-title fs-jumbo fw-bold">My Listings</div>
            {data &&
                data.map((rowArr, index) => (
                    <div className="dashboard-row" key={index}>
                        {rowArr.map((itemData, index) => (
                            <DashboardGridBlock
                                width={4}
                                height={2}
                                title={itemData.title}
                                className="mylisting-block "
                                key={index}
                            >
                                <div className="item-wrapper">
                                    <DashboardGridBlockItem
                                        handleOptions={{
                                            onDelete: async () => {},
                                            onEdit: async () => {},
                                            onDuplicate: async () => {},
                                        }}
                                        contentProps={{
                                            className:
                                                "content item-select-area",
                                            onClick: () => {
                                                navigate(
                                                    itemData.listingId.toString()
                                                );
                                            },
                                        }}
                                    >
                                        <div className="description">
                                            <div className="label">
                                                description
                                            </div>
                                            <div className="body">
                                                {itemData.description}
                                            </div>
                                        </div>
                                        <OpeningDetailTable
                                            itemData={itemData.opening}
                                        />
                                        <SettingsDetailTable
                                            itemData={itemData.settings}
                                        />
                                    </DashboardGridBlockItem>
                                </div>
                            </DashboardGridBlock>
                        ))}
                    </div>
                ))}
        </div>
    );
}

function SettingsDetailTable({ itemData }) {
    const columns = useMemo(
        () => [
            {
                Header: "Visibility",
                accessor: "visibility",
            },
            {
                Header: "Publish Date",
                accessor: "publishDate",
            },
            {
                Header: "Expire Date",
                accessor: "expireDate",
            },
        ],
        []
    );
    const data = useMemo(
        () => [
            {
                visibility: itemData.visibility.label,
                publishDate: itemData.publishDate.toDateString(),
                expireDate: itemData.expireDate.toDateString(),
            },
        ],
        []
    );
    // console.log(data);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({
            columns,
            data,
        });
    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((group) => (
                    <tr {...group.getHeaderGroupProps()}>
                        {group.headers.map((column) => (
                            <th {...column.getHeaderProps()}>
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

function OpeningDetailTable({ itemData }) {
    const columns = useMemo(
        () => [
            {
                Header: "deadline",
                accessor: "deadline",
            },
            {
                Header: "location",
                accessor: "location",
            },
            {
                Header: "opportunity type",
                accessor: "opportunityType",
            },
            {
                Header: "department",
                accessor: "department",
            },
            {
                Header: "start date",
                accessor: "startDate",
            },
        ],
        []
    );
    const data = useMemo(
        () => [
            {
                deadline: itemData.deadline.toDateString(),
                location:
                    itemData.remote === "remote" ? "remote" : itemData.state,
                opportunityType: itemData.opportunityType.label,
                department: itemData.department,
                startDate: itemData.startend[0].toDateString(),
            },
        ],
        []
    );
    // console.log(data);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({
            columns,
            data,
        });
    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((group) => (
                    <tr {...group.getHeaderGroupProps()}>
                        {group.headers.map((column) => (
                            <th {...column.getHeaderProps()}>
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
