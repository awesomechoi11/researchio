import { Link } from "react-router-dom";
import heroSvg from "../assets/recruiter/heroSvg";
import greencheck from "../assets/recruiter/greencheck.png";
import relevantpng from "../assets/recruiter/relevant.png";
import cleanpng from "../assets/recruiter/clean.png";
import concisepng from "../assets/recruiter/concise.png";
import laptoppng from "../assets/recruiter/laptop.png";
import clockpng from "../assets/recruiter/clock.png";
import backgroundBubblessvg from "../assets/recruiter/backgroundBubbles";

import "./recruiter.scss";

export default function RecruiterPage() {
    return (
        <div id="recruiter-page">
            <div className="background-bubbles">{backgroundBubblessvg}</div>
            <div className="hero">
                <div className="message">
                    <h1>
                        For Recruiters: Let The <b>Perfect Candidate</b> Come To{" "}
                        <b>You</b>
                    </h1>
                    <Link
                        className="button button-jumbo calltoaction"
                        to="/newsletter"
                    >
                        Start Now
                    </Link>
                </div>
                <div className="art">{heroSvg}</div>
            </div>
            <div className="slide1">
                <h2>
                    Find The <b>Best</b> Candidates
                </h2>
                <div className="content">
                    <div className="art">
                        <img src={laptoppng} alt="laptop" />
                    </div>
                    <ul className="points">
                        <li>
                            <img alt="" src={greencheck} className="check" />
                            <p>
                                From Your Own <b>Institutions</b> Or Anywhere
                            </p>
                        </li>
                        <li>
                            <img alt="" src={greencheck} className="check" />
                            <p>
                                <b>Fits Your Mission</b> & <b>Passionate</b>{" "}
                                About Your Project
                            </p>
                        </li>
                        <li>
                            <img alt="" src={greencheck} className="check" />
                            <p>
                                And Most Importantly, <b>Ready To Dive In</b>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="slide2">
                <h2>
                    This service made <b>easy</b> for us to find students for{" "}
                    <b>remote</b> positions
                </h2>
                <div className="content">
                    <div className="clean">
                        <img src={cleanpng} alt="Clean" />
                        <div>
                            <h2>
                                <b>Clean</b>
                            </h2>
                            <p>
                                No more sorting through endless piles of emails
                            </p>
                        </div>
                    </div>
                    <div className="concise">
                        <img src={concisepng} alt="Concise" />
                        <div>
                            <h2>
                                <b>Concise</b>
                            </h2>
                            <p>List Fully Remote Positions or In-Person</p>
                        </div>
                    </div>
                    <div className="relevant">
                        <img src={relevantpng} alt="Relevant" />
                        <div>
                            <h2>
                                <b>Relevant</b>
                            </h2>
                            <p>
                                Make The Best Decision From Relevant Data Points
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="slide3">
                <img src={clockpng} alt="clock" className="art" />
                <h2>
                    Your <b>Time</b> Is Important And So Is Your <b>Research</b>
                </h2>
                <Link className="button button-jumbo" to="/newsletter">
                    Start Now
                </Link>
            </div>
        </div>
    );
}
