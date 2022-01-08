import { useLayoutEffect } from "react";
import "./profile.scss";
import ContactCard from "../components/profile/ContactCard";
import ReasearchExperienceCard from "../components/profile/ResearchExperienceCard";
import EducationCard from "../components/profile/EducationCard";
import GeneralCard from "../components/profile/GeneralCard";
import ProfileCard from "../components/profile/ProfileCard";
import { useMongoDB } from "../initMongo";

export default function ProfilePage() {
    const { getUserOrOpenLoginModal, user } = useMongoDB();

    useLayoutEffect(() => {
        user.refreshCustomData();
    }, []);

    return (
        <div id="profile-page">
            {!!getUserOrOpenLoginModal() && (
                <>
                    <h2 className="page-title">
                        <b>Profile</b>
                    </h2>
                    <div className="content">
                        <div className="column">
                            <FinishSettingUpCard />
                            <GeneralCard />
                            <ContactCard />
                        </div>
                        <div className="column">
                            <EducationCard />
                        </div>
                        <div className="column">
                            <ReasearchExperienceCard />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function FinishSettingUpCard() {
    const { user } = useMongoDB();

    if (user.customData.general) return null;

    return (
        <ProfileCard title="Finish Setting Up">
            Complete your profile by adding education and select reasearch
            experiences.
        </ProfileCard>
    );
}
