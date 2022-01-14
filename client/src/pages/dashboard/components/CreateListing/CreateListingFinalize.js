import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as Realm from "realm-web";
import {
    FormikDropdown,
    FormikInput,
    FormikInputNumber,
    FormikRadioGroup,
} from "../../../../components/formikhelpers";
import { useRealmApp, useMongoDB } from "../../../../initMongo";
import DashboardGridBlockItem from "../DashboardGridBlockItem";
import DashboardGridBlock from "../DashboardGridBlock";
import { useRecoilState } from "recoil";
import { createListingProjectAtom } from "../../../../components/atoms";
import { useTable } from "react-table";

export default function CreateListingFinalize() {
    const [listingProjectData, setListingProjectData] = useRecoilState(
        createListingProjectAtom
    );

    console.log(listingProjectData);
    const { user } = useMongoDB();
    const projectData = user.customData.projects.find(
        (proj) => proj.id.$oid === listingProjectData.project.id.$oid
    );
    const openingData = projectData.openings.find(
        (opening) => opening.id.$oid === listingProjectData.opening.id.$oid
    );
    const questionsArr = listingProjectData.questions
        ? openingData.questions.filter((question) =>
              listingProjectData.questions.has(question.id.$oid)
          )
        : [];

    return (
        <DashboardGridBlock width={4} title="Review Listing/ Publish">
            <div className="description">
                <div className="body">
                    <b>Double-Check</b> to ensure everythings is <b>correct!</b>
                </div>
            </div>
            {/* project */}
            <div className="fw-bold fs-big finalize-title">Project</div>
            <div className="item-wrapper">
                <DashboardGridBlockItem
                    handleOptions={{
                        onEdit: async () => {
                            // scroll up
                        },
                    }}
                >
                    <div>
                        <div className="fs-big fw-bold">
                            {listingProjectData.project.title}
                        </div>
                        <div className="description">
                            {listingProjectData.project.description}
                        </div>
                    </div>
                </DashboardGridBlockItem>
            </div>
            {/* opening */}
            <div className="fw-bold fs-big finalize-title">Opening</div>
            <div className="item-wrapper">
                <DashboardGridBlockItem
                    handleOptions={{
                        onEdit: async () => {
                            // scroll
                        },
                    }}
                >
                    <div className="item-inner-wrapper">
                        <OpeningDetailTable
                            itemData={listingProjectData.opening}
                        />
                        <div className="description">
                            <div className="label fc-light">
                                opening description
                            </div>
                            <div className="body">
                                {listingProjectData.opening.description}
                            </div>
                        </div>
                        <div className="item-section">
                            <div className="label fc-light">
                                majors considered
                            </div>
                            {listingProjectData.opening.majorsConsidered && (
                                <div className="body">
                                    {listingProjectData.opening.majorsConsidered.map(
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
                        {listingProjectData.opening.desiredTechnicalSkills && (
                            <div className="item-section">
                                <div className="label fc-light">
                                    technical skills
                                </div>
                                <div className="body">
                                    {listingProjectData.opening.desiredTechnicalSkills.map(
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
                {listingProjectData.questions &&
                listingProjectData.questions.size ? (
                    questionsArr.map((itemData, index) => (
                        <DashboardGridBlockItem
                            key={index}
                            handleOptions={{
                                onEdit: async () => {
                                    // scroll
                                },
                            }}
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
                        <SettingsDetailTable
                            itemData={listingProjectData.settings}
                        />
                    </div>
                </DashboardGridBlockItem>
            </div>
            <div>
                <PublishForm />
            </div>
        </DashboardGridBlock>
    );
}

function PublishForm() {
    const [listingProjectData, setListingProjectData] = useRecoilState(
        createListingProjectAtom
    );
    const { db, user } = useMongoDB();

    const onSubmit = useCallback(async (e) => {
        e.preventDefault();

        try {
            console.log(listingProjectData);
            let listingId = new Realm.BSON.ObjectID();
            let recruiter = {
                general: user.general,
                education: user.education,
                contact: user.contact,
                researchexperience: user.researchexperience,
            };
            let data = {};
            Object.values(listingProjectData).forEach((val) => {
                data = { ...data, ...val };
            });

            await db.collection("listings").updateOne(
                {
                    userId: user.id,
                    recruiter,
                    listingId,
                },
                {
                    $currentDate: { lastModified: true },
                    $set: {
                        ...data,
                        userId: user.id,
                        listingId,
                    },
                },
                { upsert: true }
            );

            if (
                !(
                    user &&
                    user.customData &&
                    user.customData.has_completed_publish
                )
            )
                await await db.collection("users").updateOne(
                    { userId: user.id },
                    {
                        $set: {
                            has_completed_publish: new Date(),
                        },
                    }
                );
            // console.log({
            //     ...data,
            //     userId: user.id,
            //     listingId,
            // });
            toast.success("Successfully Published!");
        } catch {
            toast.error("Uh Oh! An error occured");
        }
    }, []);

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="submit-wrapper">
                    <button type="submit">Publish</button>
                </div>
            </form>
        </div>
    );
}

function mongoToDate(obj) {
    if (obj && "$date" in obj && "$numberLong" in obj.$date) {
        return new Date(Number(obj.$date.$numberLong));
    }
    return "";
}

function SettingsDetailTable({ itemData }) {
    const columns = useMemo(
        () => [
            {
                Header: "Listing Visibility Date",
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
                deadline: mongoToDate(itemData.deadline).toDateString(),
                location:
                    itemData.remote === "remote" ? "remote" : itemData.state,
                opportunityType: itemData.opportunityType.label,
                department: itemData.department,
                startDate: mongoToDate(itemData.startend[0]).toDateString(),
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
