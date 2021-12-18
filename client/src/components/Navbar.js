import { Link, NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { useMongoDB, useRealmApp } from "../initMongo";

export default function Navbar() {
    const location = useLocation();

    const bigNavPaths = ["/"];

    const [bigNav, setBigNav] = useState(
        bigNavPaths.every((path) => path === location.pathname)
    );
    useEffect(() => {
        if (!location) return;
        // console.log(location, bigNavPaths);
        let newBig = bigNavPaths.every((path) => path === location.pathname);
        if (newBig !== bigNav) setBigNav(newBig);
    }, [location]);

    const candidatePaths = ["/", "/opportunities", "/newsletter"];
    const isCandidateFlow = candidatePaths.includes(location.pathname);

    return (
        <div id="navbar">
            <div
                className="inner"
                style={{ height: bigNav ? "24rem" : "16rem" }}
            >
                <div className="left">
                    <div className="fc-primary fw-bold title">
                        <NavLink
                            to="/"
                            style={{ fontSize: bigNav ? "12rem" : "9rem" }}
                        >
                            Re:Search
                        </NavLink>
                    </div>
                    <div className="buttons">
                        <NavLink to="/opportunities">opportunities</NavLink>
                        <NavLink to="/newsletter">early access</NavLink>
                    </div>
                </div>
                <div className="right">
                    <div className="buttons">
                        <NavLink
                            to={
                                isCandidateFlow
                                    ? "/principal-investigator"
                                    : "/"
                            }
                        >
                            {isCandidateFlow
                                ? "are you a principal investigator?"
                                : "are you a candidate?"}
                        </NavLink>
                    </div>
                    <NavProfile />
                </div>
            </div>
        </div>
    );
}

function NavProfile() {
    // const setModal = useSetRecoilState(modalAtomFamily("login"));
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: "bottom-end",
    });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (
                !referenceElement ||
                !popperElement ||
                referenceElement.contains(event.target) ||
                popperElement.contains(event.target)
            ) {
                return;
            }
            setOpen(false);
        };

        // listen for clicks and close dropdown on body
        document.addEventListener("mousedown", handleDocumentClick);
        return () => {
            document.removeEventListener("mousedown", handleDocumentClick);
        };
    }, [referenceElement, popperElement]);

    const { logOut } = useRealmApp();
    const { getUserOrOpenLoginModal, user } = useMongoDB();

    return (
        <div id="nav-profile">
            <button
                type="button"
                ref={setReferenceElement}
                onClick={() => {
                    let user = getUserOrOpenLoginModal();
                    if (user) setOpen(!open);
                }}
                className={clsx(
                    user && user.providerType !== "anon-user" && "active"
                )}
            >
                {profile_svg}
            </button>
            <div
                ref={setPopperElement}
                style={{
                    ...styles.popper,
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "all" : "none",
                }}
                {...attributes.popper}
                className="popup"
            >
                <Link to="/profile" onClick={() => setOpen(false)}>
                    profile
                </Link>
                <Link to="/applications" onClick={() => setOpen(false)}>
                    my applications
                </Link>
                <Link to="/settings" onClick={() => setOpen(false)}>
                    settings
                </Link>
                <div
                    onClick={async () => {
                        await logOut();
                        setOpen(false);
                    }}
                >
                    sign out
                </div>
            </div>
        </div>
    );
}

const profile_svg = (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M16 29.3335C13.984 29.3391 11.9936 28.883 10.1813 28.0001C9.51803 27.6775 8.88254 27.3006 8.2813 26.8734L8.09864 26.7401C6.44506 25.5196 5.09314 23.9364 4.14664 22.1121C3.16762 20.2239 2.65985 18.127 2.66657 16.0001C2.66657 8.63628 8.63617 2.66675 16 2.66675C23.3638 2.66675 29.3334 8.63628 29.3334 16.0001C29.34 18.1259 28.8327 20.2219 27.8546 22.1094C26.9095 23.9327 25.5594 25.5153 23.908 26.7361C23.285 27.1921 22.6239 27.5936 21.932 27.9361L21.8253 27.9894C20.0119 28.877 18.019 29.3368 16 29.3335ZM16 22.6667C14.0019 22.6628 12.1702 23.7788 11.2573 25.5561C14.2458 27.0363 17.7541 27.0363 20.7426 25.5561V25.5494C19.8286 23.7741 17.9968 22.6606 16 22.6667ZM16 20.0001C18.8881 20.0039 21.5512 21.5602 22.972 24.0747L22.992 24.0574L23.0106 24.0414L22.988 24.0614L22.9746 24.0721C26.3466 21.1589 27.5524 16.4565 25.9982 12.2802C24.444 8.10392 20.4574 5.33384 16.0013 5.33384C11.5452 5.33384 7.55863 8.10392 6.00444 12.2802C4.45025 16.4565 5.65597 21.1589 9.02797 24.0721C10.4496 21.5588 13.1125 20.0036 16 20.0001ZM16 18.6667C13.0545 18.6667 10.6666 16.2789 10.6666 13.3334C10.6666 10.3879 13.0545 8.00008 16 8.00008C18.9455 8.00008 21.3333 10.3879 21.3333 13.3334C21.3333 14.7479 20.7714 16.1045 19.7712 17.1047C18.771 18.1048 17.4145 18.6667 16 18.6667ZM16 10.6667C14.5272 10.6667 13.3333 11.8607 13.3333 13.3334C13.3333 14.8062 14.5272 16.0001 16 16.0001C17.4727 16.0001 18.6666 14.8062 18.6666 13.3334C18.6666 11.8607 17.4727 10.6667 16 10.6667Z"
            fill="#252253"
        />
    </svg>
);
