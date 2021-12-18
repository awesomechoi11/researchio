import { useRecoilState, useSetRecoilState } from "recoil";
import { modalAtomFamily } from "../atoms";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import loginGraphicPng from "../../assets/loginGraphic.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { useMongoDB, useRealmApp } from "../../initMongo";

export default function LoginModal() {
    const [modal, setModal] = useRecoilState(modalAtomFamily("login"));

    return (
        <div className="modal-wrapper">
            <AnimatePresence>
                {modal.open && (
                    <motion.div
                        id="login-modal"
                        className="modal-container"
                        onClick={() => setModal({ open: false })}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                    >
                        <Inner
                            key={modal.data.listingId}
                            listData={modal.data}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Inner() {
    //default register page
    const [loginState, setLoginState] = useState({
        page: "register",
        data: {},
    });

    return (
        <div
            className="inner"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <div className="left">
                <img
                    className="login-graphic"
                    src={loginGraphicPng}
                    alt="login"
                />
            </div>
            <div className="right">
                {loginState.page === "register" && (
                    <RegisterForm setLoginState={setLoginState} />
                )}
                {loginState.page === "confirm" && (
                    <RegisterConfirmForm
                        loginState={loginState}
                        setLoginState={setLoginState}
                    />
                )}
                {loginState.page === "complete" && (
                    <RegisterCompleteForm
                        loginState={loginState}
                        setLoginState={setLoginState}
                    />
                )}
                {loginState.page === "login" && (
                    <LoginForm setLoginState={setLoginState} />
                )}
                {loginState.page === "done" && <RegisterDone />}
            </div>
        </div>
    );
}

const validateRegisterYup = Yup.object({
    "loginModal-email": Yup.string()
        .email("invalid email address")
        .required("Required"),
    "loginModal-password": Yup.string()
        .min(8, "8-characters minimum")
        .matches(/^(?=.*[a-z])/, "at least 1 lowercase")
        .matches(/^(?=.*[A-Z])/, "at least 1 uppercase")
        .matches(/^(?=.*[0-9])/, "at least 1 number")
        .required("Required"),
});

function RegisterForm({ setLoginState }) {
    const { RealmApp } = useRealmApp();

    const formik = useFormik({
        initialValues: {
            "loginModal-email": "",
            "loginModal-password": "",
        },

        validationSchema: validateRegisterYup,

        onSubmit: async (values) => {
            const emailpw = {
                email: values["loginModal-email"],
                password: values["loginModal-password"],
            };
            await RealmApp.emailPasswordAuth.registerUser(emailpw);

            // if fail ig?
            // if (register.status !== "pending") return;

            // if pending goto confirm code mode
            setLoginState({
                page: "confirm",
                data: emailpw,
            });
        },
    });

    function hasError(elemId) {
        return formik.touched[elemId] && formik.errors[elemId];
    }

    return (
        <div className="form-wrapper">
            <div className="top">
                <div className="login-message">
                    <div className="fs-big fw-bold">Register</div>
                    <div className="fc-secondary-light">
                        Discover Research Opportunities
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-wrapper">
                        <input
                            id="loginModal-email"
                            name="loginModal-email"
                            required
                            type="text"
                            {...formik.getFieldProps("loginModal-email")}
                            className={clsx(
                                hasError("loginModal-email") && "has-error"
                            )}
                        />
                        <label htmlFor="loginModal-email">email</label>
                    </div>

                    {hasError("loginModal-email") ? (
                        <div className="error">
                            {formik.errors["loginModal-email"]}
                        </div>
                    ) : null}
                    <div className="input-wrapper">
                        <input
                            id="loginModal-password"
                            name="loginModal-password"
                            required
                            type="password"
                            {...formik.getFieldProps("loginModal-password")}
                            className={clsx(
                                hasError("loginModal-password") && "has-error"
                            )}
                        />
                        <label htmlFor="loginModal-password">password</label>
                    </div>
                    {hasError("loginModal-password") ? (
                        <div className="error">
                            {formik.errors["loginModal-password"]}
                        </div>
                    ) : null}

                    <button type="submit">register</button>
                </form>
            </div>
            <div
                className="bottom cursor-pointer"
                onClick={() => {
                    setLoginState({
                        page: "login",
                    });
                }}
            >
                already registered? <span className="fc-primary">sign in</span>
            </div>
        </div>
    );
}

const validateConfirmYup = Yup.object({
    "loginModal-confirm": Yup.string()
        .length(6, "6 digits required")
        .required("Required"),
});

function RegisterConfirmForm({ setLoginState, loginState }) {
    const { RealmApp, logIn } = useRealmApp();

    const formik = useFormik({
        initialValues: {
            "loginModal-confirm": "",
        },

        validationSchema: validateConfirmYup,

        onSubmit: async (values) => {
            let code = {
                email: loginState.data.email,
                confirmation_code: values["loginModal-confirm"],
            };
            let codeCheck =
                await RealmApp.currentUser.functions.checkEmailConfirmationCode(
                    code
                );

            if (!codeCheck.success) return;

            const tokens = {
                token: codeCheck.message.token,
                tokenId: codeCheck.message.tokenId,
            };
            await RealmApp.emailPasswordAuth.confirmUser(tokens);
            // console.log("confirmation");
            // now goto complete profile
            await logIn("email", loginState.data);

            setLoginState({
                page: "complete",
            });
        },
    });

    function hasError(elemId) {
        return formik.touched[elemId] && formik.errors[elemId];
    }

    return (
        <div className="form-wrapper">
            <div className="top">
                <div className="login-message">
                    <div className="fs-big fw-bold">Confirm Email</div>
                    <div className="fc-secondary-light">
                        Few Steps From Awesomeness!
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-wrapper">
                        <input
                            id="loginModal-confirm"
                            name="loginModal-confirm"
                            required
                            type="text"
                            {...formik.getFieldProps("loginModal-confirm")}
                            className={clsx(
                                hasError("loginModal-confirm") && "has-error"
                            )}
                        />
                        <label htmlFor="loginModal-confirm">6 digit code</label>
                    </div>

                    {hasError("loginModal-confirm") ? (
                        <div className="error">
                            {formik.errors["loginModal-confirm"]}
                        </div>
                    ) : null}

                    <button type="submit">confirm</button>
                </form>
            </div>
            <div className="bottom"></div>
        </div>
    );
}

const validateCompleteYup = Yup.object({
    "loginModal-firstName": Yup.string()
        .min(1, "1-character minimum")
        .required("Required"),
    "loginModal-lastName": Yup.string()
        .min(1, "1-character minimum")
        .required("Required"),
});

function RegisterCompleteForm({ setLoginState, loginState }) {
    const { updateProfile } = useMongoDB();

    const formik = useFormik({
        initialValues: {
            "loginModal-firstName": "",
            "loginModal-lastName": "",
        },

        validationSchema: validateCompleteYup,

        onSubmit: async (values) => {
            const data = {
                firstName: values["loginModal-firstName"],
                lastName: values["loginModal-lastName"],
            };
            await updateProfile(data);

            setLoginState({
                page: "done",
            });
        },
    });

    function hasError(elemId) {
        return formik.touched[elemId] && formik.errors[elemId];
    }

    return (
        <div className="form-wrapper">
            <div className="top">
                <div className="login-message">
                    <div className="fs-big fw-bold">Complete Your Profile</div>
                    <div className="fc-secondary-light">
                        Few Steps From Awesomeness!
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-wrapper">
                        <input
                            id="loginModal-firstName"
                            name="loginModal-firstName"
                            required
                            type="text"
                            {...formik.getFieldProps("loginModal-firstName")}
                            className={clsx(
                                hasError("loginModal-firstName") && "has-error"
                            )}
                        />
                        <label htmlFor="loginModal-firstName">first name</label>
                    </div>

                    {hasError("loginModal-firstName") ? (
                        <div className="error">
                            {formik.errors["loginModal-firstName"]}
                        </div>
                    ) : null}
                    <div className="input-wrapper">
                        <input
                            id="loginModal-lastName"
                            name="loginModal-lastName"
                            required
                            type="text"
                            {...formik.getFieldProps("loginModal-lastName")}
                            className={clsx(
                                hasError("loginModal-lastName") && "has-error"
                            )}
                        />
                        <label htmlFor="loginModal-lastName">last name</label>
                    </div>

                    {hasError("loginModal-lastName") ? (
                        <div className="error">
                            {formik.errors["loginModal-lastName"]}
                        </div>
                    ) : null}
                    <button type="submit">complete</button>
                </form>
            </div>
            <div
                className="bottom cursor-pointer fc-primary-light"
                onClick={async () => {
                    const data = {
                        firstName: formik.values["loginModal-firstName"],
                        lastName: formik.values["loginModal-lastName"],
                    };
                    await updateProfile(data);
                    setLoginState({
                        page: "done",
                    });
                }}
            >
                save & finish later
            </div>
        </div>
    );
}

function RegisterDone() {
    const setModal = useSetRecoilState(modalAtomFamily("login"));

    return (
        <div className="form-wrapper">
            <div className="top">
                <div className="login-message">
                    <div className="fs-big fw-bold">All Done!</div>
                    <div className="fc-secondary-light">
                        You are now ready...
                    </div>
                </div>
            </div>
            <div className="bottom">
                <button onClick={() => setModal({ open: false })}>close</button>
            </div>
        </div>
    );
}

const validateLoginYup = Yup.object({
    "loginModal-email": Yup.string()
        .email("invalid email address")
        .required("Required"),
    "loginModal-password": Yup.string()
        .min(8, "8-characters minimum")
        .matches(/^(?=.*[a-z])/, "at least 1 lowercase")
        .matches(/^(?=.*[A-Z])/, "at least 1 uppercase")
        .matches(/^(?=.*[0-9])/, "at least 1 number")
        .required("Required"),
});

function LoginForm({ setLoginState }) {
    const { RealmApp, logIn } = useRealmApp();
    const setModal = useSetRecoilState(modalAtomFamily("login"));
    const [loginError, setLoginError] = useState(null);

    const formik = useFormik({
        initialValues: {
            "loginModal-email": "",
            "loginModal-password": "",
        },

        validationSchema: validateLoginYup,

        onSubmit: async (values) => {
            const emailpw = {
                email: values["loginModal-email"],
                password: values["loginModal-password"],
            };
            let user = await logIn("email", emailpw);
            if (!user) setLoginError("cannot log in");
            setModal({ open: false });
        },
    });

    function hasError(elemId) {
        return formik.touched[elemId] && formik.errors[elemId];
    }

    return (
        <div className="form-wrapper">
            <div className="top">
                <div className="login-message">
                    <div className="fs-big fw-bold">Sign In</div>
                    <div className="fc-secondary-light">
                        Good To Have You Back!
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-wrapper">
                        <input
                            id="loginModal-email"
                            name="loginModal-email"
                            required
                            type="text"
                            {...formik.getFieldProps("loginModal-email")}
                            className={clsx(
                                hasError("loginModal-email") && "has-error"
                            )}
                        />
                        <label htmlFor="loginModal-email">email</label>
                    </div>

                    {hasError("loginModal-email") ? (
                        <div className="error">
                            {formik.errors["loginModal-email"]}
                        </div>
                    ) : null}
                    <div className="input-wrapper">
                        <input
                            id="loginModal-password"
                            name="loginModal-password"
                            required
                            type="password"
                            {...formik.getFieldProps("loginModal-password")}
                            className={clsx(
                                hasError("loginModal-password") && "has-error"
                            )}
                        />
                        <label htmlFor="loginModal-password">password</label>
                    </div>
                    {hasError("loginModal-password") ? (
                        <div className="error">
                            {formik.errors["loginModal-password"]}
                        </div>
                    ) : null}
                    {loginError && <div className="error">{loginError}</div>}

                    <button type="submit">sign in</button>
                </form>
            </div>
            <div
                className="bottom cursor-pointer"
                onClick={() => {
                    setLoginState({
                        page: "register",
                    });
                }}
            >
                not a member? <span className="fc-primary">register</span>
            </div>
        </div>
    );
}
