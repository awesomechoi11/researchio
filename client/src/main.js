import { useEffect } from "react";
import { Route, Routes } from "react-router";
import LoginModal from "./components/modals/LoginModal";
import OpportunityModal from "./components/modals/OpportunityModal";
import Navbar from "./components/Navbar";
import { useRealmApp } from "./initMongo";
import EmailConfirmPage from "./pages/emailconfirm";
import HomePage from "./pages/home";
import NewsletterPage from "./pages/newsletter";
import OpportunitiesPage from "./pages/opportunities";
import ProfilePage from "./pages/profile";
import RecruiterPage from "./pages/recruiter";
import { Toaster } from "react-hot-toast";
import "./sass/dropdowns.scss";
import DashboardPage from "./pages/dashboard/dashboard";
import DashboardNavbar from "./pages/dashboard/components/DashboardNavbar";
import CreateListingPage from "./pages/dashboard/pages/createlisting";
import DashboardHome from "./pages/dashboard/pages/dashboardhome";
import MyListingsPage from "./pages/dashboard/pages/mylistings";
import MyListingsViewPage from "./pages/dashboard/pages/mylistingsview";

export default function Main() {
    const { user, logIn, RealmApp } = useRealmApp();
    useEffect(() => {
        //default login w anon
        if (!user) logIn();
    }, []);
    console.log(user, RealmApp);
    return (
        <>
            <div id="layer1" className="root-layer">
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <>
                                <DashboardPage />
                            </>
                        }
                    >
                        <Route
                            path="create-listing"
                            element={<CreateListingPage />}
                        />
                        <Route path="mylistings" element={<MyListingsPage />} />
                        <Route
                            path="mylistings/:listingId"
                            element={<MyListingsViewPage />}
                        />
                        <Route path=":pageId" element={<div>page</div>} />
                        <Route index element={<DashboardHome />} />
                    </Route>

                    <Route path="/profile" element={<ProfilePage />} />
                    <Route
                        path="/confirm-email"
                        element={<EmailConfirmPage />}
                    />
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
                </Routes>
                <Routes>
                    <Route path="/" element={<Navbar />} />
                    <Route path="/newsletter" element={<Navbar />} />
                    <Route path="/opportunities" element={<Navbar />} />
                    <Route
                        path="/principal-investigator"
                        element={<Navbar />}
                    />
                    <Route path="/profile" element={<Navbar />} />
                    {/* <Route path="/" element={<Navbar />} /> */}
                </Routes>
            </div>
            {/* manually select what layer a modal belongs */}
            <div id="layer2" className="root-layer">
                <OpportunityModal />
            </div>
            <div id="layer3" className="root-layer">
                <LoginModal />
                <Toaster />
            </div>
        </>
    );
}
