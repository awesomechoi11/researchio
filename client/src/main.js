import { useEffect } from "react";
import { Route, Routes } from "react-router";
import LoginModal from "./components/modals/LoginModal";
import OpportunityModal from "./components/modals/OpportunityModal";
import Navbar from "./components/Navbar";
import { useRealmApp } from "./initMongo";
import HomePage from "./pages/home";
import NewsletterPage from "./pages/newsletter";
import OpportunitiesPage from "./pages/opportunities";
import RecruiterPage from "./pages/recruiter";

import "./sass/dropdowns.scss";

export default function Main() {
    const { user, logIn } = useRealmApp();
    useEffect(() => {
        //default login w anon
        if (!user) logIn();
    }, []);
    return (
        <>
            <div id="layer1" className="root-layer">
                <Routes>
                    <Route
                        path="/principal-investigator"
                        element={<RecruiterPage />}
                    />
                    <Route path="/newsletter" element={<NewsletterPage />} />
                    <Route
                        path="/opportunities"
                        element={<OpportunitiesPage />}
                    />
                    <Route path="/" element={<HomePage />} />
                    {/* <Route path="about" element={<About />} /> */}
                </Routes>
                <Navbar />
            </div>
            {/* manually select what layer a modal belongs */}
            <div id="layer2" className="root-layer">
                <OpportunityModal />
            </div>
            <div id="layer3" className="root-layer">
                <LoginModal />
            </div>
        </>
    );
}
