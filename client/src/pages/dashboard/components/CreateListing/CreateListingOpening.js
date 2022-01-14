import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as Realm from "realm-web";
import {
    FormikCreatableDropdown,
    FormikDatePicker,
    FormikDateRangePicker,
    FormikDropdown,
    FormikInput,
    FormikInputNumber,
    FormikRadioGroup,
    FormikTextarea,
} from "../../../../components/formikhelpers";
import { useRealmApp, useMongoDB } from "../../../../initMongo";
import DashboardGridBlockItem from "../DashboardGridBlockItem";
import DashboardGridBlock from "../DashboardGridBlock";
import { useRecoilState } from "recoil";
import { createListingProjectAtom } from "../../../../components/atoms";
import fastEqual from "fast-deep-equal";
import arrayOfMajors from "./listOfMajors";
import arrayOfTechnicalSkills from "./arrayOfTechnicalSkills";
import clsx from "clsx";
import { useTable } from "react-table";

function mongoToDate(obj) {
    if (obj && "$date" in obj && "$numberLong" in obj.$date) {
        return new Date(Number(obj.$date.$numberLong));
    }
    return "";
}

function DetailTable({ itemData }) {
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

export default function CreateListingOpening() {
    const { refreshUserData } = useRealmApp();
    const { updateUserData, user, db } = useMongoDB();
    const [flip, setFlip] = useState(true);
    const [mode, setMode] = useState({ label: "default" });
    const [listingProjectData, setListingProjectData] = useRecoilState(
        createListingProjectAtom
    );
    const projectData = user.customData.projects.find(
        (proj) => proj.id.$oid === listingProjectData.project.id.$oid
    );

    const onSubmit = useCallback(
        async (values, { resetForm }) => {
            try {
                const idPrefix = "dashboard-opening-";
                const newValues = {};

                for (const [key, value] of Object.entries(values)) {
                    newValues[key.replace(idPrefix, "")] = value;
                }

                if (mode.label === "add") {
                    await db.collection("users").updateOne(
                        {
                            userId: user.id,
                            "projects.id": projectData.id,
                        }, // Query for the user object of the logged in user
                        {
                            // $set: { userId: user.id },
                            $currentDate: { lastModified: true },
                            $addToSet: {
                                "projects.$.openings": {
                                    ...newValues,
                                    id: new Realm.BSON.ObjectID(),
                                },
                            },
                        } // Set the logged in user's favorite color to purple
                    );
                } else if (mode.label === "edit") {
                    await user.functions.updateOne(
                        "users",
                        { userId: user.id },
                        {
                            $set: {
                                "projects.$[project].openings.$[opening]": {
                                    id: mode.data.id,
                                    ...newValues,
                                },
                            },
                        },
                        {
                            upsert: true,
                            arrayFilters: [
                                {
                                    "project.id": projectData.id,
                                },
                                { "opening.id": mode.data.id },
                            ],
                        }
                    );
                }
                setMode({
                    label: "default",
                });

                await refreshUserData();

                toast.success("Successfully Saved!");
                resetForm();
            } catch (err) {
                toast.error("Uh Oh! An error occured");
                console.log(err);
            }
        },
        [mode]
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
                "dashboard-opening-availability": Yup.string()
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
            "dashboard-opening-department": "",
            "dashboard-opening-opportunityType": null,
            "dashboard-opening-remote": "",
            "dashboard-opening-availability": 1,
            "dashboard-opening-startend": null,
            "dashboard-opening-deadline": null,

            "dashboard-opening-address1": "",
            "dashboard-opening-address2": "",
            "dashboard-opening-city": "",
            "dashboard-opening-state": "",
            "dashboard-opening-zipCode": "",

            "dashboard-opening-description": "",
            "dashboard-opening-prerequisites": "",
            "dashboard-opening-majorsConsidered": null,
            "dashboard-opening-desiredTechnicalSkills": [],
        },
        validationSchema,
        onSubmit,
    });

    const dataArr = projectData.openings || [];
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
        <DashboardGridBlock width={4} title="Select A Opening">
            <div className="description">
                <div className="body">
                    <b>Select</b> or <b>Add</b> openings for an available
                    position
                </div>
            </div>
            <div className="item-wrapper">
                {dataArr.length ? (
                    dataArr.map((itemData, index) => (
                        <DashboardGridBlockItem
                            key={index}
                            handleOptions={{
                                onDelete: async () => {
                                    try {
                                        await updateUserData(
                                            {
                                                $set: { userId: user.id },
                                                $pull: {
                                                    "projects.$.openings":
                                                        itemData,
                                                },
                                            },
                                            {
                                                userId: user.id,
                                                "projects.id": projectData.id,
                                            }
                                        );
                                        await refreshUserData();

                                        toast.success("Successfully Deleted!");
                                        setFlip(!flip); // so it refreshes!!!! and shows updated
                                    } catch {
                                        toast.error("Uh Oh! An error occured");
                                    }
                                    setMode({
                                        label: "default",
                                    });
                                },
                                onEdit: async () => {
                                    setMode({
                                        label: "edit",
                                        data: itemData,
                                    });

                                    const idPrefix = "dashboard-opening-";
                                    const newValues = {};
                                    for (const [key, value] of Object.entries(
                                        itemData
                                    )) {
                                        if (key === "deadline") {
                                            newValues[idPrefix + key] =
                                                mongoToDate(value);
                                        } else if (key === "startend") {
                                            newValues[idPrefix + key] =
                                                value.map((val) =>
                                                    mongoToDate(val)
                                                );
                                        } else if (key === "availability") {
                                            newValues[idPrefix + key] =
                                                value.$numberInt;
                                        } else {
                                            newValues[idPrefix + key] = value;
                                        }
                                    }
                                    // console.log(itemData, newValues);
                                    formik.setValues(newValues);
                                },
                                onDuplicate: async () => {
                                    try {
                                        await updateUserData(
                                            {
                                                $push: {
                                                    "projects.$.openings": {
                                                        ...itemData,
                                                        id: new Realm.BSON.ObjectId(),
                                                    },
                                                },
                                            },
                                            {
                                                userId: user.id,
                                                "projects.id": projectData.id,
                                            }
                                        );
                                        await refreshUserData();

                                        toast.success(
                                            "Successfully Duplicated!"
                                        );

                                        setFlip(!flip); // so it refreshes!!!! and shows updated
                                    } catch {
                                        toast.error("Uh Oh! An error occured");
                                    }
                                },
                            }}
                            className={clsx(
                                fastEqual(
                                    listingProjectData.opening,
                                    itemData
                                ) && "selected"
                            )}
                            contentProps={{
                                className: "content item-select-area",
                                onClick: () => {
                                    const isSelected =
                                        listingProjectData.opening &&
                                        listingProjectData.opening.id.$oid ===
                                            itemData.id.$oid;
                                    // fastEqual(
                                    //     listingProjectData.opening,
                                    //     itemData
                                    // );
                                    if (isSelected) {
                                        setListingProjectData({
                                            ...listingProjectData,
                                            opening: undefined,
                                        });
                                    } else {
                                        setListingProjectData({
                                            ...listingProjectData,
                                            opening: itemData,
                                        });
                                    }
                                },
                            }}
                        >
                            <div className="item-inner-wrapper">
                                <DetailTable itemData={itemData} />
                                <div className="description">
                                    <div className="label fc-light">
                                        opening description
                                    </div>
                                    <div className="body">
                                        {itemData.description}
                                    </div>
                                </div>
                                <div className="item-section">
                                    <div className="label fc-light">
                                        majors considered
                                    </div>
                                    {itemData.majorsConsidered && (
                                        <div className="body">
                                            {itemData.majorsConsidered.map(
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
                                {itemData.desiredTechnicalSkills && (
                                    <div className="item-section">
                                        <div className="label fc-light">
                                            technical skills
                                        </div>
                                        <div className="body">
                                            {itemData.desiredTechnicalSkills.map(
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
                    ))
                ) : (
                    <DashboardGridBlockItem>None</DashboardGridBlockItem>
                )}
            </div>
            {mode.label === "default" ? (
                <div className="item-wrapper">
                    <DashboardGridBlockItem
                        onClick={() => {
                            setMode({ label: "add" });
                        }}
                        className="create-button"
                    >
                        <div className="fs-big fw-bold fc-primary">
                            Create A New Opening
                        </div>
                    </DashboardGridBlockItem>
                </div>
            ) : (
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
            )}
        </DashboardGridBlock>
    );
}
