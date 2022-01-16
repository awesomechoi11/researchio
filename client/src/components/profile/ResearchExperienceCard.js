import { useFormik } from "formik";
import { FormikDropdown, FormikInput } from "../formikhelpers";
import ProfileCard from "./ProfileCard";
import * as Yup from "yup";
import { useMemo, useState } from "react";
import { useMongoDB, useRealmApp } from "../../initMongo";
import * as Realm from "realm-web";
import toast from "react-hot-toast";
import ProfileItem from "./ProfileItem";
import { randomId } from "../../misc";

export default function ReasearchExperienceCard() {
    const { refreshUserData } = useRealmApp();
    const { updateUserData, user } = useMongoDB();
    const [flip, setFlip] = useState(true);
    const [mode, setMode] = useState({ label: "add" });

    const onSubmit = async (values, { resetForm }) => {
        try {
            const idPrefix = "profile-researchexperience-";
            const dataFields = [
                "type",
                "title",
                "citation",
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
                        researchexperience: {
                            ...newValues,
                            researchexperienceId: randomId(),
                        },
                    },
                });
            } else if (mode.label === "edit") {
                await updateUserData(
                    {
                        $set: {
                            "researchexperience.$": {
                                researchexperienceId:
                                    mode.data.researchexperienceId,
                                ...newValues,
                            },
                        },
                    },
                    {
                        userId: user.id,
                        "researchexperience.researchexperienceId":
                            mode.data.researchexperienceId,
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
                "profile-researchexperience-type": Yup.object({
                    value: Yup.string().required(),
                    label: Yup.string().required(),
                }),
                "profile-researchexperience-title":
                    Yup.string().required("Required"),
                "profile-researchexperience-citation":
                    Yup.string().required("Required"),
            }),
        []
    );

    const formik = useFormik({
        initialValues: {
            "profile-researchexperience-type": "",
            "profile-researchexperience-title": "",
            "profile-researchexperience-citation": "",
        },
        validationSchema,
        onSubmit,
    });

    const options = [
        { value: "publication", label: "Publication" },
        { value: "presentation", label: "Presentation" },
        { value: "lab", label: "Lab Name" },
    ];

    const researchexperienceArr = user.customData.researchexperience || [];

    return (
        <ProfileCard title="Research Experience">
            <div className="item-wrapper">
                {researchexperienceArr.length ? (
                    researchexperienceArr.map(
                        (researchexperienceItemData, index) => (
                            <ProfileItem
                                key={index}
                                handleOptions={{
                                    onDelete: async () => {
                                        try {
                                            await updateUserData({
                                                $set: { userId: user.id },
                                                $pull: {
                                                    researchexperience:
                                                        researchexperienceItemData,
                                                },
                                            });
                                            await refreshUserData();

                                            toast.success(
                                                "Successfully Deleted!"
                                            );
                                            setFlip(!flip); // so it refreshes!!!! and shows updated
                                            setMode({
                                                label: "add",
                                            });
                                        } catch {
                                            toast.error(
                                                "Uh Oh! An error occured"
                                            );
                                        }
                                    },
                                    onEdit: async () => {
                                        setMode({
                                            label: "edit",
                                            data: researchexperienceItemData,
                                        });
                                        formik.setValues({
                                            "profile-researchexperience-type":
                                                researchexperienceItemData.type,
                                            "profile-researchexperience-title":
                                                researchexperienceItemData.title,
                                            "profile-researchexperience-citation":
                                                researchexperienceItemData.citation,
                                        });
                                    },
                                    onDuplicate: async () => {
                                        try {
                                            await updateUserData({
                                                $push: {
                                                    researchexperience: {
                                                        ...researchexperienceItemData,
                                                        researchexperienceId:
                                                            randomId(),
                                                    },
                                                },
                                            });
                                            await refreshUserData();

                                            toast.success(
                                                "Successfully Duplicated!"
                                            );

                                            setFlip(!flip); // so it refreshes!!!! and shows updated
                                        } catch {
                                            toast.error(
                                                "Uh Oh! An error occured"
                                            );
                                        }
                                    },
                                }}
                            >
                                <div>
                                    {researchexperienceItemData.type.value} —{" "}
                                    {researchexperienceItemData.title}
                                </div>
                                <div>{researchexperienceItemData.citation}</div>
                            </ProfileItem>
                        )
                    )
                ) : (
                    <ProfileItem>None</ProfileItem>
                )}
            </div>
            <form onSubmit={formik.handleSubmit}>
                <FormikDropdown
                    options={options}
                    id="profile-researchexperience-type"
                    label="type"
                    formik={formik}
                />
                <FormikInput
                    id="profile-researchexperience-title"
                    label="title"
                    formik={formik}
                />
                <FormikInput
                    id="profile-researchexperience-citation"
                    label="citation"
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
