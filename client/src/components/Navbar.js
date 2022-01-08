import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import NavProfile from "./NavProfile";

export default function Navbar() {
    const location = useLocation();

    const candidatePaths = ["/", "/opportunities", "/newsletter"];
    const isCandidateFlow = candidatePaths.includes(location.pathname);

    return (
        <div id="navbar">
            <div className="inner" style={{ height: "16rem" }}>
                <div className="left">
                    <div className="fc-primary fw-bold title">
                        <NavLink to="/" style={{ fontSize: "9rem" }}>
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
