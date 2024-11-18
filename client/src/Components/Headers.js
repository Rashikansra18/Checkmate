import React, { useEffect, useState } from "react";
import "./styles/Headers.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "./Images/Black and White Modern Streetwear Logo.png";

const Headers = () => {
    const [userdata, setUserdata] = useState(null); // Store user data
    const navigate = useNavigate();

    // Function to fetch user data
    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:6005/login/sucess", { withCredentials: true });
            setUserdata(response.data.user); // Store user details if login is successful
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUserdata(null); // Reset user data if error occurs
        }
    };

    // Logout function
    const logout = () => {
        setUserdata(null); // Clear user data
        navigate("/"); // Redirect to home page
    };

    // Fetch user data on component mount
    useEffect(() => {
        getUser();
    }, []);

    return (
        <header>
            <nav>
                <div className="left">
                    <img src={logoImage} alt="Logo" className="logo" />
                </div>
                <div className="right">
                    <ul>
                        <li>
                            <NavLink to="/">Home</NavLink>
                        </li>
                        {userdata ? (
                            // If user is logged in
                            <>
                                <li>
                                    <NavLink to="/dashboard">Dashboard</NavLink>
                                </li>
                                <li style={{ color: "black", fontWeight: "bold" }}>{userdata?.displayName}</li>
                                <li>
                                    <img
                                        src={userdata?.image}
                                        style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                                        alt="User"
                                    />
                                </li>
                                <li
                                    onClick={logout}
                                    style={{ cursor: "pointer", color: "red", fontWeight: "bold" }}
                                >
                                    Logout
                                </li>
                            </>
                        ) : (
                            // If user is not logged in
                            <li>
                                <NavLink to="/login">Login</NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Headers;
