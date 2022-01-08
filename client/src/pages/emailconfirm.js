import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useQueryParam from "../components/useQueryParam";
import { useRealmApp } from "../initMongo";
import "./emailconfirm.scss";

export default function EmailConfirmPage() {
    let [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get("token");
    const tokenId = searchParams.get("tokenId");

    const { RealmApp, logIn } = useRealmApp();

    const [confirmState, setConfirmState] = useState({
        loading: true,
        error: false,
        message: "",
    });

    useEffect(() => {
        if (!token || !tokenId) {
            setConfirmState({
                loading: false,
                error: true,
                message: "Invalid Url",
            });
            return;
        }
        const tokens = {
            token,
            tokenId,
        };
        RealmApp.emailPasswordAuth
            .confirmUser(tokens)
            .then(() => {
                setConfirmState({
                    loading: false,
                    error: false,
                    message: "You are now ready... You may now log in!",
                });
            })
            .catch(() => {
                setConfirmState({
                    loading: false,
                    error: true,
                    message: "Confirmation link may have expired.",
                });
            });
    }, [token, tokenId, RealmApp]);

    return (
        <div id="email-confirm-page">
            <div className="content">
                <h2>Email Confirmation</h2>
                <div className="message">
                    {!confirmState.loading && (
                        <>
                            <div className="art">
                                {confirmState.error ? error_svg : success_svg}
                            </div>
                            <div className="fs-big fw-bold">
                                {confirmState.error ? "Uh Oh!" : "All Done!"}
                            </div>
                        </>
                    )}

                    <p>{confirmState.message}</p>
                </div>
            </div>
        </div>
    );
}

const success_svg = (
    <svg
        width="64"
        height="65"
        viewBox="0 0 64 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M32 56.5C45.2548 56.5 56 45.7548 56 32.5C56 19.2452 45.2548 8.5 32 8.5C18.7452 8.5 8 19.2452 8 32.5C8 45.7548 18.7452 56.5 32 56.5ZM31.3813 42.2072L44.7146 26.2072L40.6175 22.7928L29.1535 36.5496L23.2183 30.6144L19.4471 34.3856L27.4471 42.3856L29.5119 44.4504L31.3813 42.2072Z"
            fill="#2256D7"
        />
    </svg>
);
const error_svg = (
    <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32ZM19.448 44.5523C18.4066 43.5109 18.4066 41.8225 19.448 40.7811L28.2288 32.0003L19.4474 23.219C18.406 22.1776 18.406 20.4892 19.4474 19.4478C20.4888 18.4064 22.1773 18.4064 23.2187 19.4478L32 28.2291L40.7813 19.4478C41.8227 18.4064 43.5112 18.4064 44.5526 19.4478C45.594 20.4892 45.594 22.1776 44.5526 23.219L35.7712 32.0003L44.552 40.7811C45.5934 41.8225 45.5934 43.5109 44.552 44.5523C43.5106 45.5937 41.8222 45.5937 40.7808 44.5523L32 35.7715L23.2192 44.5523C22.1778 45.5937 20.4894 45.5937 19.448 44.5523Z"
            fill="#D74037"
        />
    </svg>
);
