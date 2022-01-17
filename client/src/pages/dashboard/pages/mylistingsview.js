import { useParams } from "react-router-dom";
import { useMemo, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { createListingProjectAtom } from "../../../components/atoms";
import { useTable } from "react-table";
import { randomId } from "../../../misc";
import { useMongoDB, useRealmApp } from "../../../initMongo";
import DashboardGridBlock from "../components/DashboardGridBlock";
import DashboardGridBlockItem from "../components/DashboardGridBlockItem";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormikInput, FormikTextarea } from "../../../components/formikhelpers";

export default function MyListingsViewPage() {
    let { listingId } = useParams();

    const [mode, setMode] = useState({ label: "default" });
    const [data, setData] = useState();
    const { db, user } = useMongoDB();

    //get listing
    useEffect(() => {
        if (!db) return;

        db.collection("listings")
            .findOne({ userId: user.id, listingId })
            .then(setData);
    }, [db, listingId]);

    console.log(listingId, data);

    if (!data) return <div>loading</div>;

    return (
        <div className="dashboard-page">
            <div className="page-title fs-jumbo fw-bold">My Listings</div>
            <DashboardGridBlock width={4}>
                <div className="description">
                    <div className="body">
                        <b>Last Modified: </b>{" "}
                        {data.lastModified.toDateString()}
                    </div>
                </div>
                {/* project */}
                <div className="fw-bold fs-big finalize-title">Project</div>
                <div className="item-wrapper">
                    <DashboardGridBlockItem
                        handleOptions={{
                            onEdit: async () => {
                                setMode({ label: "edit" });
                            },
                        }}
                    >
                        <div>
                            <div className="fs-big fw-bold">{data.title}</div>
                            <div className="description">
                                {data.description}
                            </div>
                        </div>
                    </DashboardGridBlockItem>
                </div>
                {/* opening */}
                <div className="fw-bold fs-big finalize-title">Opening</div>
                <div className="item-wrapper">
                    <DashboardGridBlockItem>
                        <div className="item-inner-wrapper">
                            <OpeningDetailTable itemData={data.opening} />
                            <div className="description">
                                <div className="label fc-light">
                                    opening description
                                </div>
                                <div className="body">
                                    {data.opening.description}
                                </div>
                            </div>
                            <div className="item-section">
                                <div className="label fc-light">
                                    majors considered
                                </div>
                                {data.opening.majorsConsidered && (
                                    <div className="body">
                                        {data.opening.majorsConsidered.map(
                                            (major) => (
                                                <span
                                                    className="pill"
                                                    key={major.value}
                                                >
                                                    {major.value}
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                            {data.opening.desiredTechnicalSkills && (
                                <div className="item-section">
                                    <div className="label fc-light">
                                        technical skills
                                    </div>
                                    <div className="body">
                                        {data.opening.desiredTechnicalSkills.map(
                                            (item) => (
                                                <span
                                                    className="pill"
                                                    key={item.value}
                                                >
                                                    {item.value}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </DashboardGridBlockItem>
                </div>

                {/* questions */}
                <div className="fw-bold fs-big finalize-title">
                    Pre-Screening Questions
                </div>
                <div className="item-wrapper">
                    {data.questions && data.questions.length ? (
                        data.questions.map((itemData, index) => (
                            <DashboardGridBlockItem
                                key={index}
                                // handleOptions={{
                                //     onEdit: async () => {
                                //         // scroll
                                //     },
                                // }}
                            >
                                <div className="item-inner-wrapper">
                                    <div className="description">
                                        <div className="label fc-light">
                                            Question
                                        </div>
                                        <div className="body">
                                            {itemData.question}
                                        </div>
                                    </div>
                                    <QuestionsDetailTable itemData={itemData} />
                                </div>
                            </DashboardGridBlockItem>
                        ))
                    ) : (
                        <DashboardGridBlockItem>None</DashboardGridBlockItem>
                    )}
                </div>

                {/* settings */}
                <div className="fw-bold fs-big finalize-title">
                    Listing Settings
                </div>
                <div className="item-wrapper">
                    <DashboardGridBlockItem>
                        <div className="item-inner-wrapper">
                            <SettingsDetailTable itemData={data.settings} />
                        </div>
                    </DashboardGridBlockItem>
                </div>
            </DashboardGridBlock>
        </div>
    );
}

function SettingsDetailTable({ itemData }) {
    const columns = useMemo(
        () => [
            {
                Header: "Listing Visibility",
                accessor: "visibility",
            },
            {
                Header: "Listing Publish Date",
                accessor: "publishDate",
            },
            {
                Header: "Listing Expire Date",
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
        [itemData]
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
        [itemData]
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

function QuestionsDetailTable({ itemData }) {
    const columns = useMemo(
        () => [
            {
                Header: "Question Type",
                accessor: "type",
            },
            {
                Header: "Max Word Count",
                accessor: "maxCount",
            },
            {
                Header: "Answer Required For Submission",
                accessor: "required",
            },
        ],
        []
    );
    const data = useMemo(
        () => [
            {
                required: itemData.required,
                maxCount: itemData.maxCount.$numberInt,
                type: itemData.type.label,
            },
        ],
        [itemData]
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

function ProjectForm({ setMode, mode }) {
    const { refreshUserData } = useRealmApp();
    const { updateUserData, user, db } = useMongoDB();

    const onSubmit = useCallback(async (values, { resetForm }) => {
        try {
            const idPrefix = "dashboard-newproject-";
            const dataFields = ["title", "description", "website"];
            const newValues = {};
            dataFields.forEach(
                (fieldname) =>
                    (newValues[fieldname] = values[idPrefix + fieldname])
            );

            // await updateUserData(
            //     {
            //         $set: {
            //             "projects.$": {
            //                 projectId: mode.data.projectId,
            //                 ...newValues,
            //             },
            //         },
            //     },
            //     {
            //         userId: user.id,
            //         "projects.projectId": mode.data.projectId,
            //     }
            // );

            // db.collection("listings").updateMany(
            //     {
            //         userId: user.id,
            //         projectId: mode.data.projectId,
            //     },
            //     {
            //         $set: {
            //             "projects.$": {
            //                 projectId: mode.data.projectId,
            //                 ...newValues,
            //             },
            //         },
            //     }
            // );

            await refreshUserData();

            toast.success("Successfully Saved!");
            resetForm();
        } catch {
            toast.error("Uh Oh! An error occured");
        }
    }, []);

    const validationSchema = useMemo(
        () =>
            Yup.object({
                "dashboard-newproject-title": Yup.string().required("Required"),
                "dashboard-newproject-description":
                    Yup.string().required("Required"),
                "dashboard-newproject-website": Yup.string().url().required(),
            }),
        []
    );

    const formik = useFormik({
        initialValues: {
            "dashboard-newproject-title": "",
            "dashboard-newproject-description": "",
            "dashboard-newproject-website": "",
        },
        validationSchema,
        onSubmit,
    });

    return (
        <div>
            <div className="divider" />
            <div className="fw-bold fs-big">Create A New Project</div>
            <form onSubmit={formik.handleSubmit}>
                <FormikInput
                    id="dashboard-newproject-title"
                    label="project title"
                    formik={formik}
                />
                <FormikTextarea
                    id="dashboard-newproject-description"
                    label="description"
                    formik={formik}
                />
                <FormikInput
                    id="dashboard-newproject-website"
                    label="website link"
                    formik={formik}
                />
                <div className="submit-wrapper">
                    {mode.label === "edit" ? (
                        <span
                            className="span-button"
                            onClick={() => {
                                setMode({ label: "add" });
                            }}
                            href="#"
                        >
                            cancel edit
                        </span>
                    ) : (
                        <span
                            className="span-button"
                            onClick={() => {
                                setMode({ label: "default" });
                            }}
                            href="#"
                        >
                            cancel
                        </span>
                    )}
                    <button type="submit">{mode.label}</button>
                </div>
            </form>
        </div>
    );
}
