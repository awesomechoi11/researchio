import * as Realm from "realm-web";
import React, { useContext, useState, useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import { modalAtomFamily } from "./components/atoms";

const RealmAppContext = React.createContext(null);

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

    return (
        <RealmAppContext.Provider
            value={{
                logIn,
                logOut,
                RealmApp: app,
                user,
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

    const updateProfile = (newDoc) => {
        // needs non anon user and db
        if (!user || user.providerType === "anon-user" || !db) return;
        return db
            .collection("users")
            .updateOne(
                { userId: user.id },
                { $set: { ...newDoc, userId: user.id } },
                { upsert: true }
            );
    };

    return (
        <MongoDBContext.Provider
            value={{
                db,
                user,
                updateProfile,
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
