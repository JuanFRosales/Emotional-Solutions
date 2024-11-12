import React from "react";
import { useNavigate } from "react-router-dom";

const Start: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container" id="startcontainer">
            <h1 className="title">Welcome</h1>
            <p className="subtext">This software will detect your face and give you a score</p>
                <button className="button" onClick={() => navigate("/capture")}>
                    Start here
                </button>

        </div>
    );
};

export default Start;
