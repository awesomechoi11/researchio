import * as Realm from "realm-web";
import React, { useContext, useState, useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import { modalAtomFamily } from "./components/atoms";
import { useEffectOnceWhen } from "rooks";

const RealmAppContext = React.createContext(null);

console.log(Realm);

export const RealmApp = ({ children }) => {
    const app = useMemo(() => new Realm.App({ id: "application-0-ieqsb" }), []);
    const [user, setUser] = useState(app.currentUser);

    const logIn = async (method, data) => {
        let credentials;
        switch (method) {
            case "email":
                credentials = Realm.Credentials.emailPassword(
                    data.email,
                    data.password
                );
                break;
            default:
                credentials = Realm.Credentials.anonymous();
                break;
        }
        try {
            await app.logIn(credentials);
            // await app.currentUser.refreshCustomData();
            setUser(app.currentUser);

            return app.currentUser;
        } catch (e) {
            setUser(null);

            return null;
        }
    };

    const logOut = async () => {
        if (user !== null) {
            await app.currentUser.logOut();
            let newUser = await logIn();
            setUser(newUser);
        }
    };

    const refreshUserData = async () => {
        if (!user) return;
        if (user.providerType === "anon-user") return;
        await user.refreshCustomData();
    };

    useEffectOnceWhen(() => {
        if (!user) return;
        if (user.providerType === "anon-user") return;
        user.refreshCustomData();
    }, user);

    return (
        <RealmAppContext.Provider
            value={{
                logIn,
                logOut,
                RealmApp: app,
                user,
                refreshUserData,
            }}
        >
            {children}
        </RealmAppContext.Provider>
    );
};

export const useRealmApp = () => {
    const realmContext = useContext(RealmAppContext);

    if (realmContext == null) {
        throw new Error("useRealmApp() called outside of a RealmApp?");
    }

    return realmContext;
};

const MongoDBContext = React.createContext(null);

export const MongoDB = ({ children }) => {
    const { user } = useRealmApp();

    const [db, setDb] = useState(null);
    const setModal = useSetRecoilState(modalAtomFamily("login"));

    const getUserOrOpenLoginModal = () => {
        if (!user) return;
        if (user.providerType === "anon-user") {
            // need to signup/login
            setModal({
                open: true,
                data: {
                    hello: "world",
                },
            });
            return;
        }
        return user;
    };

    useEffect(() => {
        if (user !== null) {
            const realmService = user.mongoClient("mongodb-atlas");

            setDb(realmService.db("Cluster0"));
        }
    }, [user]);

    const updateUserData = (
        updateDoc,
        query = { userId: user.id },
        options = { upsert: true }
    ) => {
        // Update the user's custom data document
        console.log(123, updateDoc, query, options);
        return db.collection("users").updateOne(
            query, // Query for the user object of the logged in user
            {
                $set: { userId: user.id },
                $currentDate: { lastModified: true },
                ...updateDoc,
            }, // Set the logged in user's favorite color to purple
            options
        );
    };

    return (
        <MongoDBContext.Provider
            value={{
                db,
                user,
                updateUserData,
                getUserOrOpenLoginModal,
            }}
        >
            {children}
        </MongoDBContext.Provider>
    );
};

export const useMongoDB = () => {
    const mdbContext = useContext(MongoDBContext);

    if (mdbContext == null) {
        throw new Error("useMongoDB() called outside of a MongoDB?");
    }

    return mdbContext;
};
