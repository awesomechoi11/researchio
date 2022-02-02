import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { modalAtomFamily } from "../atoms";
import { useTable } from "react-table";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import DefaultProfileImg from "../../assets/default profile.png";

export default function OpportunityModal() {
    const [modal, setModal] = useRecoilState(modalAtomFamily("opportunity"));

    return (
        <div className="modal-wrapper">
            <AnimatePresence>
                {modal.open && (
                    <motion.div
                        id="opportunity-modal"
                        className="modal-container"
                        onClick={() => setModal({ open: false })}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                    >
                        <Inner
                            key={modal.data.listingId}
                            listData={modal.data}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Inner({ listData }) {
    const { recruiter, opening, settings, description, applied, title, views } =
        listData;

    let relativePostDate = useMemo(
        () => dayjs(settings.publishDate).fromNow(),
        [settings]
    );
    let relativeStartDate = useMemo(
        () => dayjs(opening.startend[0]).fromNow(),
        [opening]
    );
    let relativeDeadline = useMemo(
        () => dayjs(opening.deadline).fromNow(),
        [opening]
    );

    const tableData = useMemo(
        () => [
            {
                deadline: relativeDeadline,
                location: opening.remote ? "remote" : opening.state,
                opportunityType: opening.opportunityType.label,
                department: opening.department,
                startDate: relativeStartDate,
            },
        ],
        []
    );
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

    return (
        <div
            className="inner"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <div className="basic-info">
                <div className="left">
                    <img src={DefaultProfileImg} alt={recruiter.firstName} />
                </div>
                <div className="right">
                    <div>
                        <span className="facility-name fs-big ">
                            {opening.department}
                        </span>
                    </div>
                    <div>
                        <span>
                            {[
                                relativePostDate,
                                applied + " applied",
                                views + " views",
                            ].join(" · ")}
                        </span>
                    </div>
                    <div className="fc-light">{title}</div>
                </div>
            </div>
            <div className="user-utility">
                <SaveButton />
                <ApplyButton />
            </div>
            <div className="divider" />
            <div className="detailed-info">
                <div>
                    <DetailTable columns={columns} data={tableData} />
                </div>
                <div className="description">
                    <div className="label fc-light">description</div>
                    <div className="body">{description}</div>
                </div>
                <div>
                    <div className="label fc-light">majors considered</div>
                    <div className="body pill-container">
                        {opening.majorsConsidered.map((major, index) => (
                            <span className="pill" key={index + major.label}>
                                {major.label}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="label fc-light">principal investigator</div>
                    <div className="body principal-investigator">
                        <div className="left">
                            <img
                                src={DefaultProfileImg}
                                alt={recruiter.general.firstName}
                            />
                        </div>
                        <div className="right">
                            <div>
                                {recruiter.general.firstName}{" "}
                                {recruiter.general.lastName}
                            </div>
                            <div className="fc-light">
                                {recruiter.general.role.label}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SaveButton() {
    let navigate = useNavigate();
    const [modal, setModal] = useRecoilState(modalAtomFamily("opportunity"));

    return (
        <div
            className="save-button fw-bold"
            onClick={() => {
                navigate("/newsletter");
                setModal({
                    open: false,
                });
            }}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13.5144 18.4326C12.9942 18.8565 12.4846 19.2724 12.0036 19.6809C11.5732 19.3163 11.1197 18.9441 10.6575 18.5649C10.6016 18.519 10.5457 18.4731 10.4896 18.427L10.2129 18.1999H10.202C7.51958 16.0033 4.8068 13.7073 3.60543 11.0464L3.6055 11.0464L3.60046 11.0356C3.21473 10.2077 3.01003 9.30704 3 8.39378C2.99867 7.21384 3.47238 6.08296 4.31442 5.25623C5.15743 4.42855 6.29845 3.97558 7.47961 3.9997L7.48903 3.99989L7.49844 3.9999C8.48687 4.00146 9.45403 4.287 10.2848 4.8225C10.6424 5.05478 10.966 5.33567 11.2463 5.6571L11.9964 6.51742L12.7506 5.66065C13.034 5.33875 13.3594 5.05645 13.718 4.82135C14.5479 4.28648 15.5141 4.00134 16.5015 3.9999L16.511 3.99989L16.5204 3.9997C17.7016 3.97558 18.8426 4.42855 19.6856 5.25624C20.5277 6.08303 21.0015 7.21402 21 8.39407C20.9907 9.30893 20.786 10.2112 20.3996 11.0406L20.3995 11.0406L20.3946 11.0514C19.1525 13.8025 16.2957 16.1627 13.5275 18.4221L13.5214 18.427L13.5213 18.427L13.5144 18.4326Z"
                    stroke="#252253"
                    stroke-width="2"
                />
            </svg>
            save
        </div>
    );
}
function ApplyButton() {
    const [modal, setModal] = useRecoilState(modalAtomFamily("opportunity"));

    return (
        <Link
            className="button"
            to="/newsletter"
            onClick={() => {
                setModal({
                    open: false,
                });
            }}
        >
            Apply
        </Link>
    );
}

function DetailTable({ columns, data }) {
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
