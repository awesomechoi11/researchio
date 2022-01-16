import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    FormikDatePicker,
    FormikDropdown,
    FormikInput,
} from "../../../../components/formikhelpers";
import { useMongoDB } from "../../../../initMongo";
import DashboardGridBlockItem from "../DashboardGridBlockItem";
import DashboardGridBlock from "../DashboardGridBlock";
import { useRecoilState } from "recoil";
import { createListingProjectAtom } from "../../../../components/atoms";
import fastEqual from "fast-deep-equal";

import clsx from "clsx";

export default function CreateListingSettings() {
    return (
        <DashboardGridBlock width={4} title="Listing Settings">
            <div className="item-wrapper">
                <SettingsForm />
            </div>
            {/* <div className="divider" /> */}
            {/* <NotificationsForm /> */}
        </DashboardGridBlock>
    );
}

function NotificationsForm() {
    const { updateUserData, user, db } = useMongoDB();

    const [listingProjectData, setListingProjectData] = useRecoilState(
        createListingProjectAtom
    );

    const projectData = user.customData.projects.find(
        (proj) => proj.projectId === listingProjectData.project.projectId
    );
    const openingData = projectData.openings.find(
        (opening) => opening.openingId === listingProjectData.opening.openingId
    );

    const [mode, setMode] = useState({ label: "default" });

    const onSubmit = useCallback(
        async (values, { resetForm }) => {
            try {
                // const idPrefix = "dashboard-finalize-";
                // const newValues = {};
                // for (const [key, value] of Object.entries(values)) {
                //     newValues[key.replace(idPrefix, "")] = value;
                // }
                // if (mode.label === "add") {
                //     await db.collection("users").updateOne(
                //         {
                //             userId: user.id,
                //             "projects.id": projectData.id,
                //         }, // Query for the user object of the logged in user
                //         {
                //             // $set: { userId: user.id },
                //             $currentDate: { lastModified: true },
                //             $addToSet: {
                //                 "projects.$.openings": {
                //                     ...newValues,
                //                     id: new Realm.BSON.ObjectID(),
                //                 },
                //             },
                //         } // Set the logged in user's favorite color to purple
                //     );
                // } else if (mode.label === "edit") {
                //     await updateUserData(
                //         {
                //             $set: {
                //                 "projects.$[project].openings.$[opening]": {
                //                     id: mode.data.id,
                //                     ...newValues,
                //                 },
                //             },
                //         },
                //         { userId: user.id },
                //         {
                //             arrayFilters: [
                //                 {
                //                     "project.projectId": projectData.id,
                //                 },
                //                 { "opening.openingId": mode.data.id },
                //             ],
                //         }
                //     );
                // }
                // setMode({
                //     label: "default",
                // });
                // await refreshUserData();
                // toast.success("Successfully Saved!");
                // resetForm();
            } catch {
                toast.error("Uh Oh! An error occured");
            }
        },
        [mode]
    );

    const validationSchema = useMemo(
        () =>
            Yup.object({
                "dashboard-settings-email": Yup.string().required("Required"),
            }),
        []
    );

    const formik = useFormik({
        initialValues: {
            "dashboard-listing-publishDate": new Date(),
        },
        validationSchema,
        onSubmit,
    });

    // const dataArr = projectData.openings || [];
    const dataArr = [];
    // console.log(mode);
    return (
        <>
            <div className="item-wrapper">
                {dataArr.length ? (
                    dataArr.map((itemData, index) => (
                        <DashboardGridBlockItem
                            key={index}
                            handleOptions={
                                {
                                    // onDelete: async () => {
                                    //     try {
                                    //         await updateUserData(
                                    //             {
                                    //                 $set: { userId: user.id },
                                    //                 $pull: {
                                    //                     "projects.$.openings":
                                    //                         itemData,
                                    //                 },
                                    //             },
                                    //             {
                                    //                 userId: user.id,
                                    //                 "projects.id": projectData.id,
                                    //             }
                                    //         );
                                    //         await refreshUserData();
                                    //         toast.success("Successfully Deleted!");
                                    //         setFlip(!flip); // so it refreshes!!!! and shows updated
                                    //     } catch {
                                    //         toast.error("Uh Oh! An error occured");
                                    //     }
                                    //     setMode({
                                    //         label: "default",
                                    //     });
                                    // },
                                    // onEdit: async () => {
                                    //     setMode({
                                    //         label: "edit",
                                    //         data: itemData,
                                    //     });
                                    //     const idPrefix = "dashboard-opening-";
                                    //     const newValues = {};
                                    //     for (const [key, value] of Object.entries(
                                    //         itemData
                                    //     )) {
                                    //         if (key === "deadline") {
                                    //             newValues[idPrefix + key] =
                                    //                 mongoToDate(value);
                                    //         } else if (key === "startend") {
                                    //             newValues[idPrefix + key] =
                                    //                 value.map((val) =>
                                    //                     mongoToDate(val)
                                    //                 );
                                    //         } else if (key === "availability") {
                                    //             newValues[idPrefix + key] =
                                    //                 value.$numberInt;
                                    //         } else {
                                    //             newValues[idPrefix + key] = value;
                                    //         }
                                    //     }
                                    //     console.log(itemData, newValues);
                                    //     formik.setValues(newValues);
                                    // },
                                    // onDuplicate: async () => {
                                    //     try {
                                    //         await updateUserData(
                                    //             {
                                    //                 $push: {
                                    //                     "projects.$.openings": {
                                    //                         ...itemData,
                                    //                         id: new Realm.BSON.ObjectId(),
                                    //                     },
                                    //                 },
                                    //             },
                                    //             {
                                    //                 userId: user.id,
                                    //                 "projects.id": projectData.id,
                                    //             }
                                    //         );
                                    //         await refreshUserData();
                                    //         toast.success(
                                    //             "Successfully Duplicated!"
                                    //         );
                                    //         setFlip(!flip); // so it refreshes!!!! and shows updated
                                    //     } catch {
                                    //         toast.error("Uh Oh! An error occured");
                                    //     }
                                    // },
                                }
                            }
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
                                        listingProjectData.opening.openingId ===
                                            itemData.openingId;
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
                                <div className="description">
                                    <div className="label fc-light">email</div>
                                    <div className="body">{itemData.email}</div>
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
                            Add A New Notification Recipient
                        </div>
                    </DashboardGridBlockItem>
                </div>
            ) : (
                <div>
                    <div className="divider" />
                    <div className="fw-bold fs-big">
                        Add A New Notification Recipient
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <FormikInput
                                id="dashboard-settings-email"
                                label="*email"
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
        </>
    );
}

function SettingsForm() {
    const [listingProjectData, setListingProjectData] = useRecoilState(
        createListingProjectAtom
    );

    const onSubmit = useCallback(
        async (values, { resetForm }) => {
            try {
                const idPrefix = "dashboard-settings-";
                const newValues = {};
                for (const [key, value] of Object.entries(values)) {
                    newValues[key.replace(idPrefix, "")] = value;
                }

                setListingProjectData({
                    ...listingProjectData,
                    settings: newValues,
                });

                toast.success("Almost Done!");
            } catch {
                toast.error("Uh Oh! An error occured");
            }
        },
        [listingProjectData]
    );

    const validationSchema = useMemo(
        () =>
            Yup.object({
                "dashboard-settings-publishDate": Yup.date()
                    .nullable()
                    .required("Required"),
                "dashboard-settings-expireDate": Yup.date()
                    .nullable()
                    .required("Required"),
                "dashboard-settings-visibility": Yup.object({
                    value: Yup.string().required(),
                    label: Yup.string().required(),
                })
                    .nullable()
                    .required("Required"),
            }),
        []
    );

    const initData = listingProjectData.settings || {};

    const formik = useFormik({
        initialValues: {
            "dashboard-settings-publishDate":
                initData.publishDate || new Date(),
            "dashboard-settings-expireDate": initData.expireDate || new Date(),
            "dashboard-settings-visibility": initData.visibility || null,
        },
        validationSchema,
        onSubmit,
    });

    const visibilityOptions = [
        { value: "public", label: "Public" },
        { value: "hidden", label: "Hidden" },
        { value: "private", label: "Private" },
        // { value: "facility", label: "Facility" },
    ];

    return (
        <div>
            <div className="description">
                <div className="body">
                    Just a <b>few</b> more details! <br />
                    (Leave <b>Listing Expire Date</b> as <b>today's date</b> if
                    the listing should <b>never expire</b>.)
                </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <FormikDropdown
                        id="dashboard-settings-visibility"
                        label="*Listing Visibility"
                        options={visibilityOptions}
                        formik={formik}
                    />
                    <FormikDatePicker
                        id="dashboard-settings-publishDate"
                        label="*Listing Publish Date"
                        formik={formik}
                    />
                    <FormikDatePicker
                        id="dashboard-settings-expireDate"
                        label="*Listing Expire Date"
                        formik={formik}
                    />
                </div>

                <div className="submit-wrapper">
                    <button type="submit">continue</button>
                </div>
            </form>
        </div>
    );
}
