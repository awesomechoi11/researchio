import { useFormik } from "formik";
import { FormikDropdown, FormikInput } from "../formikhelpers";
import ProfileCard from "./ProfileCard";
import * as Yup from "yup";
import { useMemo } from "react";
import { useMongoDB } from "../../initMongo";
import toast from "react-hot-toast";

export default function GeneralCard() {
    const { updateUserData, user } = useMongoDB();

    const onSubmit = async (values) => {
        const idPrefix = "profile-general-";
        const dataFields = [
            "firstName",
            "lastName",
            "nickname",
            "pronouns",
            "role",
        ];
        const newValues = {};
        dataFields.forEach(
            (fieldname) => (newValues[fieldname] = values[idPrefix + fieldname])
        );
        await updateUserData({
            $set: { userId: user.id, general: newValues },
        });
        toast.success("Successfully Saved!");
    };

    const validationSchema = useMemo(
        () =>
            Yup.object({
                "profile-general-firstName": Yup.string().required("Required"),
                "profile-general-lastName": Yup.string().required("Required"),
                "profile-general-nickname": Yup.string(),
                "profile-general-pronouns": Yup.string(),
                "profile-general-role": Yup.string().required("Required"),
            }),
        []
    );

    const formik = useFormik({
        initialValues: {
            "profile-general-firstName":
                (user.customData.general &&
                    user.customData.general.firstName) ||
                "",
            "profile-general-lastName":
                (user.customData.general && user.customData.general.lastName) ||
                "",
            "profile-general-nickname":
                (user.customData.general && user.customData.general.nickname) ||
                "",
            "profile-general-pronouns":
                (user.customData.general && user.customData.general.pronouns) ||
                "",
            "profile-general-role":
                (user.customData.general && user.customData.general.role) || "",
        },

        validationSchema,

        onSubmit,
    });

    const options = [
        { value: "recruiter", label: "Principal Investigator" },
        { value: "candidate", label: "Research Candidate" },
    ];

    return (
        <ProfileCard title="General">
            <form onSubmit={formik.handleSubmit}>
                <FormikInput
                    id="profile-general-firstName"
                    label="first name"
                    formik={formik}
                />
                <FormikInput
                    id="profile-general-lastName"
                    label="last name"
                    formik={formik}
                />
                <FormikInput
                    id="profile-general-nickname"
                    label="preffered name/ nickname (optional)"
                    formik={formik}
                />
                <FormikInput
                    id="profile-general-pronouns"
                    label="pronouns (optional)"
                    formik={formik}
                />
                <FormikDropdown
                    id="profile-general-role"
                    label="role"
                    options={options}
                    formik={formik}
                />
                <div className="submit-wrapper">
                    <button type="submit">save</button>
                </div>{" "}
            </form>
        </ProfileCard>
    );
}
