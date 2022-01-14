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
import clsx from "clsx";
import { useTable } from "react-table";

export default function CreateListingQuestions() {
    const { refreshUserData } = useRealmApp();
    const { user } = useMongoDB();
    const [flip, setFlip] = useState(true);
    const [mode, setMode] = useState({ label: "default" });
    const [listingProjectData, setListingProjectData] = useRecoilState(
        createListingProjectAtom
    );
    // const resetProjectAtom = useResetRecoilState(createListingProjectAtom);

    const projectData = user.customData.projects.find(
        (proj) => proj.id.$oid === listingProjectData.project.id.$oid
    );
    const openingData = projectData.openings.find(
        (opening) => opening.id.$oid === listingProjectData.opening.id.$oid
    );

    const idPrefix = "dashboard-questions-";

    const onSubmit = useCallback(
        async (values, { resetForm }) => {
            try {
                const newValues = {};

                for (const [key, value] of Object.entries(values)) {
                    newValues[key.replace(idPrefix, "")] = value;
                }

                if (mode.label === "add") {
                    await user.functions.updateOne(
                        "users",
                        { userId: user.id },
                        {
                            $addToSet: {
                                "projects.$[project].openings.$[opening].questions":
                                    {
                                        ...newValues,
                                        id: new Realm.BSON.ObjectID(),
                                    },
                            },
                        },
                        {
                            upsert: true,
                            arrayFilters: [
                                { "project.id": projectData.id },
                                { "opening.id": openingData.id },
                            ],
                        }
                    );
                } else if (mode.label === "edit") {
                    await user.functions.updateOne(
                        "users",
                        { userId: user.id },
                        {
                            $set: {
                                "projects.$[project].openings.$[opening].questions.$[question]":
                                    {
                                        id: mode.data.id,
                                        ...newValues,
                                    },
                            },
                        },
                        {
                            upsert: true,
                            arrayFilters: [
                                { "project.id": projectData.id },
                                { "opening.id": openingData.id },
                                { "question.id": mode.data.id },
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
            } catch {
                toast.error("Uh Oh! An error occured");
            }
        },
        [mode]
    );

    const validationSchema = useMemo(
        () =>
            Yup.object({
                "dashboard-questions-question":
                    Yup.string().required("Required"),
                "dashboard-questions-maxCount":
                    Yup.string().required("Required"),
                "dashboard-questions-required":
                    Yup.string().required("Required"),
                "dashboard-questions-type": Yup.object({
                    value: Yup.string().required(),
                    label: Yup.string().required(),
                }),
            }),
        []
    );

    const formik = useFormik({
        initialValues: {
            "dashboard-questions-question": "",
            "dashboard-questions-maxCount": 500,
            "dashboard-questions-required": "",
            "dashboard-questions-type": "",
        },
        validationSchema,
        onSubmit,
    });

    const dataArr = openingData.questions || [];

    const questionTypeOptions = [
        { value: "freeResponse", label: "Free Response" },
        // { value: "multipleChoice", label: "Multiple Choice" },
    ];
    const requiredOptions = [
        { value: "required", label: "Required" },
        { value: "optional", label: "Optional" },
    ];

    console.log(listingProjectData.questions);

    return (
        <DashboardGridBlock width={4} title="Pre-Screening Questions">
            <div className="description">
                <div className="body">
                    (Optional) <b>Select</b> or <b>Add</b> questions to
                    supplement each application
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
                                        await user.functions.updateOne(
                                            "users",
                                            { userId: user.id },
                                            {
                                                $set: { userId: user.id },
                                                $pull: {
                                                    "projects.$[project].openings.$[opening].questions":
                                                        itemData,
                                                },
                                            },
                                            {
                                                upsert: true,
                                                arrayFilters: [
                                                    {
                                                        "project.id":
                                                            projectData.id,
                                                    },
                                                    {
                                                        "opening.id":
                                                            openingData.id,
                                                    },
                                                ],
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
                                        newValues[idPrefix + key] = value;
                                    }
                                    console.log(itemData, newValues);
                                    formik.setValues(newValues);
                                },
                                onDuplicate: async () => {
                                    try {
                                        await user.functions.updateOne(
                                            "users",
                                            { userId: user.id },
                                            {
                                                $set: { userId: user.id },
                                                $addToSet: {
                                                    "projects.$[project].openings.$[opening].questions":
                                                        {
                                                            ...itemData,
                                                            id: new Realm.BSON.ObjectId(),
                                                        },
                                                },
                                            },
                                            {
                                                upsert: true,
                                                arrayFilters: [
                                                    {
                                                        "project.id":
                                                            projectData.id,
                                                    },
                                                    {
                                                        "opening.id":
                                                            openingData.id,
                                                    },
                                                ],
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
                                listingProjectData.questions &&
                                    listingProjectData.questions.has(
                                        itemData.id.$oid
                                    ) &&
                                    "selected"
                            )}
                            contentProps={{
                                className: "content item-select-area",
                                onClick: () => {
                                    const currSet =
                                        listingProjectData.questions ||
                                        new Set();
                                    const isSelected =
                                        currSet &&
                                        currSet.has(itemData.id.$oid);
                                    if (isSelected) {
                                        currSet.delete(itemData.id.$oid);
                                        setListingProjectData({
                                            ...listingProjectData,
                                            questions: currSet,
                                        });
                                    } else {
                                        currSet.add(itemData.id.$oid);
                                        setListingProjectData({
                                            ...listingProjectData,
                                            questions: currSet,
                                        });
                                    }
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
                                <DetailTable itemData={itemData} />
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
                            Create A New Question
                        </div>
                    </DashboardGridBlockItem>
                </div>
            ) : (
                <div>
                    <div className="divider" />
                    <div className="fw-bold fs-big">Create A New Question</div>
                    <form onSubmit={formik.handleSubmit}>
                        <FormikInput
                            id="dashboard-questions-question"
                            label="*question"
                            formik={formik}
                        />
                        <div className="form-group">
                            <FormikDropdown
                                id="dashboard-questions-type"
                                label="*Question Type"
                                options={questionTypeOptions}
                                formik={formik}
                            />
                            <FormikInputNumber
                                id="dashboard-questions-maxCount"
                                label="*Max Word Count"
                                formik={formik}
                            />
                            <FormikRadioGroup
                                options={requiredOptions}
                                id="dashboard-questions-required"
                                label="*Answer Required For Submission"
                                formik={formik}
                            />
                        </div>

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

function DetailTable({ itemData }) {
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
