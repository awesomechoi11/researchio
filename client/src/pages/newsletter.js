import backgroundBubbles from "../assets/newsletter/backgroundBubbles";
import "./newsletter.scss";
import newsletterArtSvg from "../assets/newsletter/newsletterArt";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import Select from "react-select";
import "./newsletter.scss";
import { useMongoDB } from "../initMongo";
import { useState } from "react";

export default function NewsletterPage() {
    return (
        <div id="newsletter-page">
            <div className="background-bubbles">{backgroundBubbles}</div>
            <div className="art">{newsletterArtSvg}</div>
            <div className="message">
                <div className="fs-bigger fw-bold">Newsletter</div>
                <div className="form">
                    <NewsletterForm />
                </div>
                <div className="fs-bigger bottom">
                    Get Instantly <b>Notified</b> When <b>Re:Search</b> is{" "}
                    <b>Available</b>
                </div>
            </div>
        </div>
    );
}

const validateNewsletterYup = Yup.object({
    "newsletter-firstname": Yup.string().required("Required"),
    "newsletter-lastname": Yup.string().required("Required"),
    "newsletter-role": Yup.string().required("Required"),
    "newsletter-email": Yup.string()
        .email("Invalid Email Address")
        .required("Required"),
});

function NewsletterForm() {
    const { user } = useMongoDB();

    const [submitted, setSubmitted] = useState(false);

    const formik = useFormik({
        initialValues: {
            "newsletter-firstname": "",
            "newsletter-lastname": "",
            "newsletter-role": "",
            "newsletter-email": "",
        },
        validationSchema: validateNewsletterYup,
        onSubmit: async (values) => {
            // console.log(values);
            const data = {
                email: values["newsletter-email"],
                first_name: values["newsletter-firstname"],
                last_name: values["newsletter-lastname"],
                custom_fields: {
                    w1_T: values["newsletter-role"],
                },
            };
            user.functions.signUpForNewsletter(data);
            setSubmitted(true);
        },
    });

    function hasError(elemId) {
        return formik.touched[elemId] && formik.errors[elemId];
    }

    const options = [
        { value: "recruiter", label: "Principal Investigator" },
        { value: "candidate", label: "Research Candidate" },
    ];
    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="names">
                <div className="left">
                    <div className="input-wrapper">
                        <input
                            id="newsletter-firstname"
                            name="newsletter-firstname"
                            required
                            type="text"
                            {...formik.getFieldProps("newsletter-firstname")}
                            className={clsx(
                                hasError("newsletter-firstname") && "has-error"
                            )}
                        />
                        <label htmlFor="newsletter-firstname">first name</label>
                        {hasError("newsletter-firstname") ? (
                            <div className="error">
                                {formik.errors["newsletter-firstname"]}
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="right">
                    <div className="input-wrapper">
                        <input
                            id="newsletter-lastname"
                            name="newsletter-lastname"
                            required
                            type="text"
                            {...formik.getFieldProps("newsletter-lastname")}
                            className={clsx(
                                hasError("newsletter-lastname") && "has-error"
                            )}
                        />
                        <label htmlFor="newsletter-lastname">last name</label>
                        {hasError("newsletter-lastname") ? (
                            <div className="error">
                                {formik.errors["newsletter-lastname"]}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="select-wrapper">
                <Select
                    options={options}
                    id="newsletter-role"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Your Role"
                    onBlur={() =>
                        formik.setFieldTouched("newsletter-role", true)
                    }
                    onChange={(opt, e) => {
                        //   formik.handleChange(e);
                        formik.setFieldValue("newsletter-role", opt.value);
                    }}
                    error={formik.errors.state}
                    touched={formik.touched.state}
                />
                <label htmlFor="newsletter-role">role</label>
                {hasError("newsletter-role") ? (
                    <div className="error">
                        {formik.errors["newsletter-role"]}
                    </div>
                ) : null}
            </div>
            <div className="input-wrapper left">
                <input
                    id="newsletter-email"
                    name="newsletter-email"
                    required
                    type="text"
                    {...formik.getFieldProps("newsletter-email")}
                    className={clsx(
                        hasError("newsletter-email") && "has-error"
                    )}
                />
                <label htmlFor="newsletter-email">email</label>
                {hasError("newsletter-email") ? (
                    <div className="error">
                        {formik.errors["newsletter-email"]}
                    </div>
                ) : null}
            </div>
            <div className="bottom">
                <button
                    type="submit"
                    className="signup"
                    disabled={
                        !Object.keys(formik.touched).length ||
                        !formik.isValid ||
                        submitted
                    }
                >
                    sign up
                </button>
            </div>
            <div className="submit-message">
                {submitted && "Thank You For Signing Up!"}
            </div>
        </form>
    );
}
