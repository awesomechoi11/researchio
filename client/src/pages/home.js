import "./home.scss";
import heroSvg from "../assets/candidate/heroSvg";
import lightbulbSvg from "../assets/candidate/lightbulb";
import backgroundBubbles from "../assets/candidate/backgroundBubbles";
import { Link, useNavigate } from "react-router-dom";
import connectpng from "../assets/candidate/connect.png";
import explorepng from "../assets/candidate/explore.png";
import findpng from "../assets/candidate/find.png";

export default function HomePage() {
    // let navigate = useNavigate();
    return (
        <div id="home">
            <div className="background-bubbles">{backgroundBubbles}</div>
            <div className="hero">
                <div className="message">
                    <h1>
                        Find <b>Research Opportunities—</b> Remote, Nearby, or{" "}
                        <b>Anywhere</b>{" "}
                    </h1>
                    <Link
                        className="button button-jumbo calltoaction"
                        to="/newsletter"
                    >
                        Explore Opportunities
                    </Link>
                </div>
                <div className="art">{heroSvg}</div>
            </div>
            <div className="slide1">
                <div className="intro">
                    <h2>
                        Finding Research Opportunities{" "}
                        <b>Doesn’t Need To Be Hard</b>
                    </h2>
                    <p>
                        Re:Search offers customized tools to help you land your
                        next research opportunities. We offer three big
                        features:
                    </p>
                </div>
                <div className="content">
                    <div>
                        <img
                            className="connect"
                            src={connectpng}
                            alt="connect"
                        />
                        <h2>Connect</h2>
                        <p>Connect Directly With Principal Investigators</p>
                    </div>
                    <div>
                        <img
                            className="explore"
                            src={explorepng}
                            alt="explore"
                        />
                        <h2>Explore</h2>
                        <p>Explore Topics You Are Passionate In</p>
                    </div>
                    <div>
                        <img className="find" src={findpng} alt="find" />
                        <h2>Find</h2>
                        <p>Find The Right Opportunity For You</p>
                    </div>
                </div>
            </div>
            <div className="slide2">
                <div className="art">{lightbulbSvg}</div>
                <div className="message">
                    <h2>
                        Find Your <b>Dream</b> Research Opportunity
                    </h2>
                    <Link
                        className="button button-jumbo calltoaction"
                        to="/newsletter"
                    >
                        Explore Opportunities
                    </Link>
                </div>
            </div>
        </div>
    );
}
