import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSetRecoilState } from "recoil";
// import { modalAtomFamily } from "./atoms";
import useQueryParam from "../../../components/useQueryParam";
import DefaultProfileImg from "../../../assets/default profile.png";
import { useMongoDB } from "../../../initMongo";
import { useTable } from "react-table";
import clsx from "clsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormikDropdown } from "../../../components/formikhelpers";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useToggle } from "rooks";
import { AnimatePresence, motion } from "framer-motion";

dayjs.extend(relativeTime);

export default function SearchResults() {
    let { db } = useMongoDB();
    let [filter, setFilter] = useQueryParam("discoverysearch");

    const [results, setResults] = useState(null);
    useEffect(() => {
        if (!db || !filter) return;

        db.collection("researchers.2")
            .aggregate(parseFilter(filter))
            .then(setResults);
    }, [filter, db]);

    return (
        <div className="opportunities-list">
            {results &&
                results.map((listData) => (
                    <ListItem key={listData._id} listData={listData} />
                ))}

            <div className="message">
                <div className=" fs-big fc-secondary-light">
                    Search results is limited to 35.
                </div>

                <div className="fw-bold fs-jumbo">
                    browse over 55000+ researchers
                </div>
                <div className=" fs-big fc-secondary-light">
                    more researchers are being added to our list daily!
                </div>
                <CallToAction />
            </div>
        </div>
    );
}

function CallToAction() {
    let navigate = useNavigate();

    return (
        <button
            className="fw-bold"
            onClick={() => {
                navigate("/newsletter");
            }}
        >
            sign up now!
        </button>
    );
}

function parseFilter(filter) {
    let search = {
        $search: {
            index: "default",
            text: {
                query: filter["discovery-text"],
                fuzzy: {},
                path: {
                    wildcard: "*",
                },
            },
        },
    };

    return [
        search,
        {
            $limit: 35,
        },
    ];
}

function ListItem({ listData }) {
    // console.log(listData);

    const {
        fullName,
        title,
        profileImage: imgSrc,
        currentInstitution,
    } = listData;

    // let relativePostDate = useMemo(
    //     () => dayjs(settings.publishDate).fromNow(),
    //     [settings]
    // );
    // const setModal = useSetRecoilState(modalAtomFamily("opportunity"));
    console.log(listData);
    return (
        <div className="list-item">
            <div className="top">
                <div className="left">
                    <img src={imgSrc || DefaultProfileImg} alt={fullName} />
                </div>
                <div className="middle">
                    <div>
                        <div>
                            <span className="facility-name fs-big fw-bold ">
                                {fullName}
                            </span>
                        </div>

                        <div>{title[0]}</div>
                    </div>
                </div>
                <div className="right">
                    <span className={clsx("pill", currentInstitution)}>
                        {currentInstitution}
                    </span>
                </div>
            </div>
            <div className="bottom">
                <DetailTable itemData={listData} />
            </div>
            <AdditionalContent listData={listData} />
        </div>
    );
}

function AdditionalContent({ listData }) {
    const [isOpen, toggleAdditionalContent] = useToggle(false);

    const {
        awards,
        education,
        researchActivities,
        publications,
        overview,
        _id,
        // fax,
        // phone,
    } = listData;
    let navigate = useNavigate();

    return (
        <div className="additional-content">
            {isOpen && listData && (
                <div className="content">
                    {!!overview && (
                        <div className="description">
                            <div className="label fc-light">Overview</div>
                            <div className="body">{overview}</div>
                        </div>
                    )}
                    {!!awards?.length && (
                        <div className="description">
                            <div className="label fc-light">
                                Awards & Honors
                            </div>
                            {awards.map(({ title, year }) => (
                                <>
                                    {!!title && !!year && (
                                        <div className="body">
                                            <div className="fw-bold">
                                                {title}
                                            </div>
                                            <div>{year}</div>
                                        </div>
                                    )}
                                </>
                            ))}
                            {awards.length > 3 && (
                                <div
                                    className=" body cursor-pointer"
                                    onClick={() => navigate(`/profiles/${_id}`)}
                                >
                                    and{" "}
                                    <span className="fw-bold">
                                        {awards.length - 3}
                                    </span>{" "}
                                    more...{" "}
                                    <span className="fw-bold">
                                        Go To Profile
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    {!!education?.length && (
                        <div className="description">
                            <div className="label fc-light">Education</div>
                            {education.map(
                                ({
                                    institution,
                                    level,
                                    discipline,
                                    yearCompleted,
                                }) => (
                                    <>
                                        {!!institution && (
                                            <div className="body">
                                                <div className="fs-big">
                                                    {institution}
                                                </div>
                                                {!!discipline && !!level && (
                                                    <div className="fw-bold">
                                                        {level} - {discipline}
                                                    </div>
                                                )}
                                                {!!yearCompleted && (
                                                    <div>{yearCompleted}</div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )
                            )}
                            {education.length > 3 && (
                                <div
                                    className=" body cursor-pointer"
                                    onClick={() => navigate(`/profiles/${_id}`)}
                                >
                                    and{" "}
                                    <span className="fw-bold">
                                        {education.length - 3}
                                    </span>{" "}
                                    more...{" "}
                                    <span className="fw-bold">
                                        Go To Profile
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    {!!researchActivities?.length && (
                        <div className="description">
                            <div className="label fc-light">
                                Research Activities
                            </div>
                            {researchActivities.map(
                                ({ title, type, grant, date }, index) => (
                                    <>
                                        {index < 3 && !!title && (
                                            <div className="body">
                                                <div className="fs-big">
                                                    {title}
                                                </div>
                                                {!!type && !!grant && (
                                                    <div className="fw-bold">
                                                        {type} - {grant}
                                                    </div>
                                                )}
                                                {!!date && <div>{date}</div>}
                                            </div>
                                        )}
                                    </>
                                )
                            )}
                            {researchActivities.length > 3 && (
                                <div
                                    className=" body cursor-pointer"
                                    onClick={() => navigate(`/profiles/${_id}`)}
                                >
                                    and{" "}
                                    <span className="fw-bold">
                                        {researchActivities.length - 3}
                                    </span>{" "}
                                    more...{" "}
                                    <span className="fw-bold">
                                        Go To Profile
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    {!!publications?.length && (
                        <div className="description">
                            <div className="label fc-light">Publications</div>
                            {publications.map(
                                ({ label, pmid, citationCount }, index) => (
                                    <>
                                        {!!label && index < 3 && (
                                            <div className="body">
                                                <div>{label}</div>
                                                <div>
                                                    {!!pmid && (
                                                        <span className="fw-bold">
                                                            <a
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`}
                                                            >
                                                                PMID: {pmid}
                                                            </a>
                                                        </span>
                                                    )}
                                                    {" - "}
                                                    {!!citationCount && (
                                                        <span className="fw-bold">
                                                            Cited By:{" "}
                                                            {citationCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )
                            )}
                            {publications.length > 3 && (
                                <div
                                    className=" body cursor-pointer"
                                    onClick={() => navigate(`/profiles/${_id}`)}
                                >
                                    and{" "}
                                    <span className="fw-bold">
                                        {publications.length - 3}
                                    </span>{" "}
                                    more...{" "}
                                    <span className="fw-bold">
                                        Go To Profile
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <motion.div
                className={clsx("toggle fw-bold fs-big", isOpen && "isOpen")}
                onClick={toggleAdditionalContent}
            >
                <AnimatePresence>
                    {isOpen ? (
                        <motion.span
                            key="view less"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            view less
                        </motion.span>
                    ) : (
                        <motion.span
                            key="view more"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            view more
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function DetailTable({ itemData }) {
    const columns = useMemo(
        () => [
            {
                Header: "Department",
                accessor: "department",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "ORCID",
                accessor: "orcid",
            },
        ],
        []
    );
    const data = useMemo(
        () => [
            {
                department: itemData.department[0] || "N/A",
                email: itemData.email[0] || "N/A",
                orcid: itemData.orcid[0] || "N/A",
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
                                        <span
                                            className={clsx(
                                                "cursor-pointer",
                                                cell.value !== "N/A" &&
                                                    "copyable"
                                            )}
                                            onClick={() => {
                                                if (cell.value === "N/A")
                                                    return;
                                                navigator.clipboard.writeText(
                                                    cell.value
                                                );
                                                toast.success(() => (
                                                    <span>
                                                        <b>
                                                            {cell.render(
                                                                "Header"
                                                            )}
                                                        </b>{" "}
                                                        : Copied To Clipboard!!
                                                    </span>
                                                ));
                                            }}
                                        >
                                            {cell.render("Cell")}
                                        </span>
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
