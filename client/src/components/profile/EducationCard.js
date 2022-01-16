import { useFormik } from "formik";
import { FormikInput } from "../formikhelpers";
import ProfileCard from "./ProfileCard";
import * as Yup from "yup";
import { useMemo, useState } from "react";
import { useMongoDB, useRealmApp } from "../../initMongo";
import toast from "react-hot-toast";
import ProfileItem from "./ProfileItem";
import * as Realm from "realm-web";
import { randomId } from "../../misc";

export default function EducationCard() {
    const { refreshUserData } = useRealmApp();
    const { updateUserData, user } = useMongoDB();
    const [flip, setFlip] = useState(true);
    const [mode, setMode] = useState({ label: "add" });

    const onSubmit = async (values, { resetForm }) => {
        try {
            const idPrefix = "profile-education-";
            const dataFields = [
                "level",
                "major",
                "school",
                "location",
                "startDate",
                "endDate",
            ];
            const newValues = {};
            dataFields.forEach(
                (fieldname) =>
                    (newValues[fieldname] = values[idPrefix + fieldname])
            );
            if (mode.label === "add") {
                await updateUserData({
                    $addToSet: {
                        education: {
                            ...newValues,
                            educationId: randomId(),
                        },
                    },
                });
            } else if (mode.label === "edit") {
                await updateUserData(
                    {
                        $set: {
                            "education.$": {
                                id: mode.data.educationId,
                                ...newValues,
                            },
                        },
                    },
                    {
                        userId: user.id,
                        "education.educationId": mode.data.educationId,
                    }
                );
                setMode({
                    label: "add",
                });
            }

            await refreshUserData();

            toast.success("Successfully Saved!");
            resetForm();
        } catch {
            toast.error("Uh Oh! An error occured");
        }
    };

    const validationSchema = useMemo(
        () =>
            Yup.object({
                "profile-education-level": Yup.string().required("Required"),
                "profile-education-major": Yup.string().required("Required"),
                "profile-education-school": Yup.string().required("Required"),
                "profile-education-location": Yup.string().required("Required"),
                "profile-education-endDate": Yup.string().required("Required"),
                "profile-education-startDate":
                    Yup.string().required("Required"),
            }),
        []
    );

    const formik = useFormik({
        initialValues: {
            "profile-education-level": "",
            "profile-education-major": "",
            "profile-education-school": "",
            "profile-education-location": "",
            "profile-education-endDate": "",
            "profile-education-startDate": "",
        },
        validationSchema,
        onSubmit,
    });

    const educationArr = user.customData.education || [];

    return (
        <ProfileCard title="Education">
            <div className="item-wrapper">
                {educationArr.length ? (
                    educationArr.map((educationItemData, index) => (
                        <ProfileItem
                            key={index}
                            handleOptions={{
                                onDelete: async () => {
                                    try {
                                        await updateUserData({
                                            $set: { userId: user.id },
                                            $pull: {
                                                education: educationItemData,
                                            },
                                        });
                                        await refreshUserData();

                                        toast.success("Successfully Deleted!");
                                        setFlip(!flip); // so it refreshes!!!! and shows updated
                                        setMode({
                                            label: "add",
                                        });
                                    } catch {
                                        toast.error("Uh Oh! An error occured");
                                    }
                                },
                                onEdit: async () => {
                                    setMode({
                                        label: "edit",
                                        data: educationItemData,
                                    });
                                    formik.setValues({
                                        "profile-education-level":
                                            educationItemData.level,
                                        "profile-education-major":
                                            educationItemData.major,
                                        "profile-education-school":
                                            educationItemData.school,
                                        "profile-education-location":
                                            educationItemData.location,
                                        "profile-education-endDate":
                                            educationItemData.endDate,
                                        "profile-education-startDate":
                                            educationItemData.startDate,
                                    });
                                },
                                onDuplicate: async () => {
                                    try {
                                        await updateUserData({
                                            $push: {
                                                education: {
                                                    ...educationItemData,
                                                    id: randomId(),
                                                },
                                            },
                                        });
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
                        >
                            <div>{educationItemData.school}</div>
                            <div>
                                {educationItemData.level},{" "}
                                {educationItemData.major}
                            </div>
                            <div>
                                {educationItemData.startDate}—
                                {educationItemData.endDate}
                            </div>
                        </ProfileItem>
                    ))
                ) : (
                    <ProfileItem>None</ProfileItem>
                )}
            </div>
            <form onSubmit={formik.handleSubmit}>
                <FormikInput
                    id="profile-education-level"
                    label="Level Of Education"
                    formik={formik}
                />
                <FormikInput
                    id="profile-education-major"
                    label="Major"
                    formik={formik}
                />
                <FormikInput
                    id="profile-education-school"
                    label="School/ Facility Name"
                    formik={formik}
                />
                <FormikInput
                    id="profile-education-location"
                    label="School/ Facility Location (City, State)"
                    formik={formik}
                />
                <FormikInput
                    id="profile-education-startDate"
                    label="start date"
                    formik={formik}
                />
                <FormikInput
                    id="profile-education-endDate"
                    label="end date"
                    formik={formik}
                />

                <div className="submit-wrapper">
                    {mode.label === "edit" && (
                        <span
                            className="span-button"
                            onClick={() => {
                                setMode({ label: "add" });
                            }}
                            href="#"
                        >
                            cancel
                        </span>
                    )}
                    <button type="submit">{mode.label}</button>
                </div>
            </form>
        </ProfileCard>
    );
}
