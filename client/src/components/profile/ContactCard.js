import { useMemo } from "react";
import toast from "react-hot-toast";
import { useMongoDB } from "../../initMongo";
import { FormikInput } from "../formikhelpers";
import ProfileCard from "./ProfileCard";
import * as Yup from "yup";
import { useFormik } from "formik";

export default function ContactCard() {
    const { updateUserData, user } = useMongoDB();

    const onSubmit = async (values) => {
        const idPrefix = "profile-contact-";
        const dataFields = ["phone", "email", "linkedin"];
        const newValues = {};
        dataFields.forEach(
            (fieldname) => (newValues[fieldname] = values[idPrefix + fieldname])
        );
        await updateUserData({
            $set: { userId: user.id, contact: newValues },
        });
        toast.success("Successfully Saved!");
    };

    const validationSchema = useMemo(
        () =>
            Yup.object({
                "profile-contact-phone": Yup.string()
                    .length(10, "10-characters required")
                    .required("Required"),
                "profile-contact-email": Yup.string()
                    .email("invalid email format")
                    .required("Required"),
                "profile-contact-linkedin": Yup.string(),
            }),
        []
    );

    const formik = useFormik({
        initialValues: {
            "profile-contact-phone":
                (user.customData.contact && user.customData.contact.phone) ||
                "",
            "profile-contact-email":
                (user.customData.contact && user.customData.contact.email) ||
                "",
            "profile-contact-linkedin":
                (user.customData.contact && user.customData.contact.linkedin) ||
                "",
        },
        validationSchema,
        onSubmit,
    });

    return (
        <ProfileCard title="Contact">
            <form onSubmit={formik.handleSubmit}>
                <FormikInput
                    id="profile-contact-phone"
                    label="phone"
                    formik={formik}
                />
                <FormikInput
                    id="profile-contact-email"
                    label="email"
                    formik={formik}
                />
                <FormikInput
                    id="profile-contact-linkedin"
                    label="linkedIn"
                    formik={formik}
                />
                <div className="submit-wrapper">
                    <button type="submit">save</button>
                </div>{" "}
            </form>
        </ProfileCard>
    );
}
