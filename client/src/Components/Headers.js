import React, { useEffect, useState } from "react";
import "./styles/Headers.css";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import logoImage from "./Images/Black and White Modern Streetwear Logo.png";

const Headers = () => {
    const [userdata, setUserdata] = useState(null); // Store user data
    const navigate = useNavigate();
    const auth = getAuth();

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserdata({
                    displayName: user.displayName || user.email, // Use displayName if available, otherwise email
                    photoURL: user.photoURL, // User profile picture
                });
            } else {
                setUserdata(null); // Clear user data when user logs out
            }
        });

        return () => unsubscribe(); // Cleanup the listener on component unmount
    }, [auth]);

    // Logout function
    const logout = async () => {
        try {
            await signOut(auth);
            setUserdata(null); // Clear user data
            navigate("/"); // Redirect to the home page
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    };

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
                                <li style={{ color: "White", fontWeight: "bold" }}>
                                    {userdata.displayName}
                                </li>
                                {userdata.photoURL && (
                                    <li>
                                        <img
                                            src={userdata.photoURL}
                                            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                                            alt="User Avatar"
                                        />
                                    </li>
                                )}
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
