import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import Main from "./main";
import { RecoilRoot } from "recoil";
import { RealmApp, MongoDB } from "./initMongo";

ReactDOM.render(
    <React.StrictMode>
        <RecoilRoot>
            <RealmApp>
                <MongoDB>
                    <BrowserRouter>
                        <Main />
                    </BrowserRouter>
                </MongoDB>
            </RealmApp>
        </RecoilRoot>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.info);
