import { useRecoilState, useSetRecoilState } from "recoil";
import { modalAtomFamily } from "../atoms";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import loginGraphicPng from "../../assets/loginGraphic.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { useRealmApp } from "../../initMongo";

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
    "loginModal-firstName": Yup.string()
        .min(1, "1-character minimum")
        .required("Required"),
    "loginModal-lastName": Yup.string()
        .min(1, "1-character minimum")
        .required("Required"),
    "loginModal-role": Yup.string().required("Required"),
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

            setLoginState({
                page: "done",
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
                        {hasError("loginModal-email") ? (
                            <div className="error">
                                {formik.errors["loginModal-email"]}
                            </div>
                        ) : null}
                    </div>

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
                        {hasError("loginModal-password") ? (
                            <div className="error">
                                {formik.errors["loginModal-password"]}
                            </div>
                        ) : null}
                    </div>
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

function RegisterDone() {
    const setModal = useSetRecoilState(modalAtomFamily("login"));

    return (
        <div className="form-wrapper">
            <div className="top">
                <div className="login-message">
                    <div className="fs-big fw-bold">Check Your Email!</div>
                    <div className="fc-secondary-light">
                        You are almost done!
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
    const { logIn } = useRealmApp();
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
            if (!user) {
                setLoginError("cannot log in");
            } else {
                setModal({ open: false });
            }
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
