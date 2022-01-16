import { useFormik } from "formik";
import { useCallback, useMemo } from "react";
import { FormikTextarea } from "../../../../components/formikhelpers";
import DashboardGridBlock from "../DashboardGridBlock";
import * as Yup from "yup";
import { useMongoDB, useRealmApp } from "../../../../initMongo";
import toast from "react-hot-toast";

export default function HomeFeatureRequest() {
    return (
        <DashboardGridBlock
            width={3}
            height={3}
            title="Feature/ Feedback Block"
            className="feedback-block"
        >
            <div className="top">
                <div className="left">
                    <div className="description">
                        <div>
                            Thank you for trying out our service! Your support
                            means the world to us. If you have any feature
                            request or just want to give some feedback, this is
                            the right place.
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="art">{SvgArt}</div>
                </div>
            </div>
            <div className="bottom">
                <FeedbackForm />
            </div>
        </DashboardGridBlock>
    );
}

function FeedbackForm() {
    const { user, db } = useMongoDB();
    const { refreshUserData } = useRealmApp();

    const onSubmit = useCallback(
        async (values, { resetForm }) => {
            try {
                const idPrefix = "dashboard-home-";
                const newValues = {};
                for (const [key, value] of Object.entries(values)) {
                    newValues[key.replace(idPrefix, "")] = value;
                }

                await db.collection("feedback").insertOne({
                    userId: user.id,
                    date: new Date(),
                    ...values,
                });

                await refreshUserData();
                toast.success("Successfully Sent!");
                resetForm();
            } catch {
                toast.error("Uh Oh! An error occured");
            }
        },
        [db]
    );

    const validationSchema = useMemo(
        () =>
            Yup.object({
                "dashboard-home-feedback": Yup.string().required("Required"),
            }),
        []
    );

    const formik = useFormik({
        initialValues: {
            "dashboard-home-feedback": "",
        },
        validationSchema,
        onSubmit,
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <FormikTextarea
                        id="dashboard-home-feedback"
                        label="*feedback"
                        formik={formik}
                    />
                </div>

                <div className="submit-wrapper">
                    <button type="submit">send</button>
                </div>
            </form>
        </div>
    );
}

const SvgArt = (
    <svg
        viewBox="217.5 225 165.00000000000014 150.00000000000014"
        fill="none"
        overflow="visible"
        width="165.00000000000014px"
        height="150.00000000000014px"
    >
        <script xmlns="" />
        <script xmlns="" />
        <g
            id="Master/Stickers/Heart"
            has-customizable-colors="true"
            viewBox="222 228 156.00000000000014 144.0000000000001"
            i="0"
        >
            <g id="heart" i="0.0">
                <g id="stickers_expanded" i="0.0.0">
                    <path
                        id="Path"
                        d="M359.75 233.509C348.857 227.14 335.583 226.334 324 231.339C312 236.339 302.48 246.469 296.87 259.859C295.417 253.509 292.252 247.678 287.72 242.999C280.72 235.679 270.98 231.509 261.64 231.799C248.78 232.219 238.26 237.399 231.2 246.799C221.69 259.459 219.49 278.329 225 299.939C233.9 334.789 267.34 356.379 295.47 371.279C296.215 371.675 297.046 371.881 297.89 371.879C298.88 371.877 299.853 371.615 300.71 371.119V371.119C318 361.439 335.71 350.649 348.17 337.329C366.28 317.979 376.83 295.569 377.88 274.229C378.77 256.229 371.82 240.629 359.75 233.509Z"
                        fill="#FC6E47"
                        i="0.0.0.0"
                    />
                    <path
                        id="Path_2"
                        d="M268.231 286.12C266.619 286.121 265.295 284.85 265.231 283.24V282.36C265.17 280.703 266.464 279.311 268.121 279.25C269.777 279.189 271.17 280.483 271.231 282.14V283.02C271.287 284.674 269.994 286.06 268.341 286.12H268.231Z"
                        fill="#C44538"
                        i="0.0.0.1"
                    />
                    <path
                        id="Path_3"
                        d="M299.411 298.399C291.141 298.399 282.911 296.029 277.901 292.749C276.975 292.144 276.716 290.904 277.321 289.979C277.925 289.054 279.165 288.794 280.091 289.399C288.001 294.579 305.751 297.289 315.571 289.739C316.446 289.065 317.702 289.228 318.376 290.104C319.049 290.979 318.886 292.235 318.011 292.909C312.911 296.829 306.141 298.399 299.411 298.399Z"
                        fill="#C44538"
                        i="0.0.0.2"
                    />
                    <path
                        id="Path_4"
                        d="M326.87 283.999C325.255 284 323.929 282.723 323.87 281.109V280.239C323.831 279.167 324.366 278.156 325.275 277.586C326.183 277.016 327.327 276.974 328.275 277.476C329.223 277.978 329.831 278.947 329.87 280.019V280.889C329.932 282.539 328.65 283.929 327 283.999H326.87Z"
                        fill="#C44538"
                        i="0.0.0.3"
                    />
                </g>
            </g>
        </g>
    </svg>
);
