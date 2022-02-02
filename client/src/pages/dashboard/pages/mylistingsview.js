import { useParams } from "react-router-dom";
import { useMemo, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useTable } from "react-table";
import { useMongoDB, useRealmApp } from "../../../initMongo";
import DashboardGridBlock from "../components/DashboardGridBlock";
import DashboardGridBlockItem from "../components/DashboardGridBlockItem";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
    FormikCreatableDropdown,
    FormikDatePicker,
    FormikDateRangePicker,
    FormikDropdown,
    FormikInput,
    FormikInputNumber,
    FormikRadioGroup,
    FormikTextarea,
} from "../../../components/formikhelpers";
import arrayOfMajors from "../components/CreateListing/listOfMajors";
import arrayOfTechnicalSkills from "../components/CreateListing/arrayOfTechnicalSkills";

export default function MyListingsViewPage() {
    let { listingId } = useParams();

    const [mode, setMode] = useState({ label: "default" });
    const [data, setData] = useState();
    const { db, user } = useMongoDB();

    const fetchSetListing = useCallback(() => {
        if (!db) return undefined;
        return db
            .collection("listings")
            .findOne({ userId: user.id, listingId })
            .then(setData);
    }, [db, listingId, user.id]);
    //get listing
    useEffect(() => {
        if (!db) return;

        fetchSetListing();
    }, [db, fetchSetListing]);

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
                                setMode({ label: "edit-project", data: data });
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
                    {mode.label === "edit-project" && (
                        <ProjectForm
                            setMode={setMode}
                            itemData={data.project}
                            fetchSetListing={fetchSetListing}
                        />
                    )}
                </div>
                {/* opening */}
                <div className="fw-bold fs-big finalize-title">Opening</div>
                <div className="item-wrapper">
                    <DashboardGridBlockItem
                        handleOptions={{
                            onEdit: async () => {
                                setMode({ label: "edit-opening", data: data });
                            },
                        }}
                    >
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
                    {mode.label === "edit-opening" && (
                        <OpeningForm
                            setMode={setMode}
                            itemData={data}
                            fetchSetListing={fetchSetListing}
                        />
                    )}
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

function ProjectForm({ setMode, itemData, fetchSetListing }) {
    const { user, db } = useMongoDB();
    const { refreshUserData } = useRealmApp();
    const onSubmit = useCallback(async (values, { resetForm }) => {
        try {
            const idPrefix = "dashboard-newproject-";
            const dataFields = ["title", "description", "website"];
            const newValues = {};
            dataFields.forEach(
                (fieldname) =>
                    (newValues[fieldname] = values[idPrefix + fieldname])
            );

            db.collection("users").updateOne(
                {
                    userId: user.id,
                    "projects.projectId": itemData.projectId,
                },
                {
                    $set: {
                        "projects.$": {
                            ...itemData,
                            ...newValues,
                        },
                    },
                }
            );

            await db.collection("listings").updateMany(
                {
                    userId: user.id,
                    projectId: itemData.projectId,
                },
                {
                    $set: {
                        ...newValues,
                        project: newValues,
                    },
                }
            );
            await fetchSetListing();
            await refreshUserData();

            toast.success("Successfully Saved!");
            resetForm();
            setMode({
                label: "default",
            });
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
            "dashboard-newproject-title": itemData.title,
            "dashboard-newproject-description": itemData.description,
            "dashboard-newproject-website": itemData.website,
        },
        validationSchema,
        onSubmit,
    });

    return (
        <div>
            <div className="divider" />
            <div className="fw-bold fs-big">Edit Project</div>
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
                    <span
                        className="span-button"
                        onClick={() => {
                            setMode({ label: "default" });
                        }}
                        href="#"
                    >
                        cancel edit
                    </span>

                    <button type="submit">save</button>
                </div>
            </form>
        </div>
    );
}
function OpeningForm({ setMode, itemData, fetchSetListing }) {
    const { refreshUserData } = useRealmApp();
    const { user, db } = useMongoDB();

    const onSubmit = useCallback(
        async (values, { resetForm }) => {
            try {
                const idPrefix = "dashboard-opening-";
                const newValues = {};

                for (const [key, value] of Object.entries(values)) {
                    newValues[key.replace(idPrefix, "")] = value;
                }

                user.functions.updateOne(
                    "users",
                    { userId: user.id },
                    {
                        $set: {
                            "projects.$[project].openings.$[opening]": {
                                ...itemData.opening,
                                ...newValues,
                            },
                        },
                    },
                    {
                        upsert: true,
                        arrayFilters: [
                            {
                                "project.projectId": itemData.project.projectId,
                            },
                            { "opening.openingId": itemData.opening.openingId },
                        ],
                    }
                );

                await db.collection("listings").updateMany(
                    {
                        userId: user.id,
                        "opening.openingId": itemData.opening.openingId,
                    },
                    {
                        $set: {
                            opening: newValues,
                        },
                    }
                );

                await fetchSetListing();
                await refreshUserData();

                resetForm();
                toast.success("Successfully Saved!");
                setMode({
                    label: "default",
                });
            } catch (err) {
                toast.error("Uh Oh! An error occured");
                console.log(err);
            }
        },
        [itemData]
    );

    const validationSchema = useMemo(
        () =>
            Yup.object({
                "dashboard-opening-department":
                    Yup.string().required("Required"),
                "dashboard-opening-opportunityType": Yup.object({
                    value: Yup.string().required(),
                    label: Yup.string().required(),
                })
                    .nullable()
                    .required("Required"),
                "dashboard-opening-remote": Yup.string().required("Required"),
                "dashboard-opening-availability": Yup.number()
                    .required("Required")
                    .nullable(),
                "dashboard-opening-startend": Yup.array()
                    .nullable()
                    .required("Required"),
                "dashboard-opening-deadline": Yup.date()
                    .nullable()
                    .required("Required"),

                "dashboard-opening-address1": Yup.string().required("Required"),
                "dashboard-opening-address2": Yup.string(),
                "dashboard-opening-city": Yup.string().required("Required"),
                "dashboard-opening-state": Yup.string().required("Required"),
                "dashboard-opening-zipCode": Yup.string().required("Required"),

                "dashboard-opening-description":
                    Yup.string().required("Required"),
                "dashboard-opening-prerequisites": Yup.string(),
                "dashboard-opening-majorsConsidered": Yup.array()
                    .nullable()
                    .required("Required"),
                "dashboard-opening-desiredTechnicalSkills":
                    Yup.array().nullable(),
            }),
        []
    );

    const formik = useFormik({
        initialValues: {
            "dashboard-opening-department": itemData.opening.department,
            "dashboard-opening-opportunityType":
                itemData.opening.opportunityType,
            "dashboard-opening-remote": itemData.opening.remote,
            "dashboard-opening-availability": itemData.opening.availability,
            "dashboard-opening-startend": itemData.opening.startend,
            "dashboard-opening-deadline": itemData.opening.deadline,

            "dashboard-opening-address1": itemData.opening.address1,
            "dashboard-opening-address2": itemData.opening.address2,
            "dashboard-opening-city": itemData.opening.city,
            "dashboard-opening-state": itemData.opening.state,
            "dashboard-opening-zipCode": itemData.opening.zipCode,

            "dashboard-opening-description": itemData.opening.description,
            "dashboard-opening-prerequisites": itemData.opening.prerequisites,
            "dashboard-opening-majorsConsidered":
                itemData.opening.majorsConsidered,
            "dashboard-opening-desiredTechnicalSkills":
                itemData.opening.desiredTechnicalSkills,
        },
        validationSchema,
        onSubmit,
    });

    const options = [
        { value: "paid", label: "Paid" },
        { value: "volunteer", label: "Volunteer" },
        { value: "credit", label: "Credit" },
        { value: "workstudy", label: "Workstudy" },
        { value: "contract", label: "Contract" },
    ];

    const remoteOptions = [
        { value: "remote", label: "remote" },
        { value: "inPerson", label: "in-person" },
    ];

    const majorsOptions = useMemo(
        () => arrayOfMajors.map((val) => ({ value: val, label: val })),
        []
    );
    const technicalSkillsOptions = useMemo(
        () => arrayOfTechnicalSkills.map((val) => ({ value: val, label: val })),
        []
    );

    // console.log(formik.values);
    return (
        <div>
            <div className="divider" />
            <div className="fw-bold fs-big">Create A New Opening</div>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <FormikDropdown
                        id="dashboard-opening-opportunityType"
                        label="*Opportunity Type"
                        options={options}
                        formik={formik}
                    />
                    <FormikInput
                        id="dashboard-opening-department"
                        label="*department"
                        formik={formik}
                    />
                    <FormikInputNumber
                        id="dashboard-opening-availability"
                        label="*availability"
                        formik={formik}
                    />
                </div>
                <div className="form-group row2">
                    <FormikRadioGroup
                        options={remoteOptions}
                        id="dashboard-opening-remote"
                        label="*remote"
                        formik={formik}
                    />
                    <FormikDateRangePicker
                        id="dashboard-opening-startend"
                        label="*start & end date"
                        formik={formik}
                        // minDate={new Date()}
                    />
                    <FormikDatePicker
                        id="dashboard-opening-deadline"
                        label="*deadline"
                        formik={formik}
                        // minDate={new Date()}
                    />
                </div>
                <div className="form-group">
                    <FormikInput
                        id="dashboard-opening-address1"
                        label="*address 1"
                        formik={formik}
                    />
                    <FormikInput
                        id="dashboard-opening-address2"
                        label="address 2"
                        formik={formik}
                    />
                </div>
                <div className="form-group">
                    <FormikInput
                        id="dashboard-opening-city"
                        label="*city"
                        formik={formik}
                    />
                    <FormikInput
                        id="dashboard-opening-state"
                        label="*state"
                        formik={formik}
                    />
                    <FormikInput
                        id="dashboard-opening-zipCode"
                        label="*zip code"
                        formik={formik}
                    />
                </div>
                <FormikTextarea
                    id="dashboard-opening-description"
                    label="*opening description"
                    formik={formik}
                />
                <FormikTextarea
                    id="dashboard-opening-prerequisites"
                    label="pre-requisites"
                    formik={formik}
                />
                <FormikCreatableDropdown
                    id="dashboard-opening-majorsConsidered"
                    label="*majors considered"
                    options={majorsOptions}
                    formik={formik}
                    dropdownProps={{ isMulti: true }}
                />
                <FormikCreatableDropdown
                    id="dashboard-opening-desiredTechnicalSkills"
                    label="desired technical skills"
                    formik={formik}
                    options={technicalSkillsOptions}
                    dropdownProps={{ isMulti: true }}
                />

                <div className="submit-wrapper">
                    <span
                        className="span-button"
                        onClick={() => {
                            setMode({ label: "default" });
                        }}
                        href="#"
                    >
                        cancel edit
                    </span>

                    <button type="submit">save</button>
                </div>
            </form>
        </div>
    );
}
