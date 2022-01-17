import { useFormik } from "formik";
import {
    FormikInput,
    FormikTextarea,
} from "../../../../components/formikhelpers";
import DashboardGridBlock from "../../components/DashboardGridBlock";
import DashboardGridBlockItem from "../../components/DashboardGridBlockItem";
import * as Yup from "yup";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useMongoDB, useRealmApp } from "../../../../initMongo";
import { useRecoilState, useResetRecoilState } from "recoil";
import { createListingProjectAtom } from "../../../../components/atoms";
import clsx from "clsx";
import fastEqual from "fast-deep-equal";
import { randomId } from "../../../../misc";

export default function CreateListingProject() {
    const { refreshUserData } = useRealmApp();
    const { updateUserData, user, db } = useMongoDB();
    const [flip, setFlip] = useState(true);
    const [mode, setMode] = useState({ label: "default" });

    const [listingProjectData, setListingProjectData] = useRecoilState(
        createListingProjectAtom
    );
    const resetProjectAtom = useResetRecoilState(createListingProjectAtom);

    const onSubmit = useCallback(
        async (values, { resetForm }) => {
            try {
                const idPrefix = "dashboard-newproject-";
                const dataFields = ["title", "description", "website"];
                const newValues = {};
                dataFields.forEach(
                    (fieldname) =>
                        (newValues[fieldname] = values[idPrefix + fieldname])
                );
                if (mode.label === "add") {
                    await Promise.all([
                        await updateUserData({
                            $addToSet: {
                                projects: {
                                    ...newValues,
                                    projectId: randomId(),
                                },
                            },
                        }),
                        await updateUserData(
                            {
                                $set: {
                                    has_completed_project: new Date(),
                                },
                            },
                            { userId: user.id },
                            {}
                        ),
                    ]);
                    if (
                        !(
                            user &&
                            user.customData &&
                            user.customData.has_completed_project
                        )
                    )
                        await updateUserData(
                            {
                                $set: {
                                    has_completed_project: new Date(),
                                },
                            },
                            { userId: user.id },
                            {}
                        );
                } else if (mode.label === "edit") {
                    const projectData = user.customData.projects.find(
                        (proj) =>
                            proj.projectId ===
                            listingProjectData.project.projectId
                    );

                    await db.collection("users").updateOne(
                        {
                            userId: user.id,
                            "projects.projectId": mode.data.projectId,
                        },
                        {
                            $set: {
                                "projects.$": {
                                    ...projectData,
                                    ...newValues,
                                },
                            },
                        }
                    );

                    db.collection("listings").updateMany(
                        {
                            userId: user.id,
                            projectId: mode.data.projectId,
                        },
                        {
                            $set: {
                                ...newValues,
                                project: newValues,
                            },
                        }
                    );

                    setMode({
                        label: "default",
                    });
                    resetProjectAtom();
                }

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

    const projectsArr = user.customData.projects || [];

    //{ onEdit, onDelete, onDuplicate, onView }
    return (
        <DashboardGridBlock width={4} title="Select A Project">
            <div className="item-wrapper">
                {projectsArr.length ? (
                    projectsArr.map((itemData, index) => (
                        <DashboardGridBlockItem
                            key={index}
                            handleOptions={{
                                onDelete: async () => {
                                    try {
                                        await updateUserData({
                                            $set: { userId: user.id },
                                            $pull: {
                                                projects: itemData,
                                            },
                                        });
                                        await refreshUserData();

                                        toast.success("Successfully Deleted!");
                                        setFlip(!flip); // so it refreshes!!!! and shows updated
                                        setMode({
                                            label: "add",
                                        });
                                        resetProjectAtom();
                                    } catch {
                                        toast.error("Uh Oh! An error occured");
                                    }
                                },
                                onEdit: async () => {
                                    setMode({
                                        label: "edit",
                                        data: itemData,
                                    });
                                    formik.setValues({
                                        "dashboard-newproject-title":
                                            itemData.title,
                                        "dashboard-newproject-description":
                                            itemData.description,
                                        "dashboard-newproject-website":
                                            itemData.website,
                                    });
                                    resetProjectAtom();
                                },
                                onDuplicate: async () => {
                                    try {
                                        await updateUserData({
                                            $push: {
                                                projects: {
                                                    ...itemData,
                                                    projectId: randomId(),
                                                },
                                            },
                                        });
                                        await refreshUserData();

                                        toast.success(
                                            "Successfully Duplicated!"
                                        );
                                        resetProjectAtom();
                                        setFlip(!flip); // so it refreshes!!!! and shows updated
                                    } catch {
                                        toast.error("Uh Oh! An error occured");
                                    }
                                },
                            }}
                            className={clsx(
                                listingProjectData.project &&
                                    listingProjectData.project.projectId ===
                                        itemData.projectId &&
                                    "selected"
                            )}
                            contentProps={{
                                className: "content item-select-area",
                                onClick: () => {
                                    const isSelected =
                                        listingProjectData.project &&
                                        listingProjectData.project.projectId ===
                                            itemData.projectId;
                                    // fastEqual(
                                    //     listingProjectData.project,
                                    //     itemData
                                    // );
                                    if (isSelected) {
                                        resetProjectAtom();
                                    } else {
                                        setListingProjectData({
                                            project: itemData,
                                        });
                                    }
                                },
                            }}
                        >
                            <div>
                                <div className="fs-big fw-bold">
                                    {itemData.title}
                                </div>
                                <div className="description">
                                    {itemData.description}
                                </div>
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
                            Create A New Project
                        </div>
                    </DashboardGridBlockItem>
                </div>
            ) : (
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
            )}
        </DashboardGridBlock>
    );
}
