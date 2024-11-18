// import React, { useState } from 'react';
// import "./styles/Login.css";
// import { useAuth0 } from "@auth0/auth0-react";

// const Login = () => {
//     const [isLogin, setIsLogin] = useState(true);
//     const { loginWithRedirect, user, isAuthenticated, logout, loginWithPopup } = useAuth0();
    
//     const loginWithGoogle = () => {
//         window.open("http://localhost:6005/auth/google/callback", "_self");
//     };
    
//     return (
//         <div className='container'>
//             <div className='form-container'>
//                 <div className='form-toggle'>
//                     <button className={isLogin ? 'active' : ""} onClick={() => setIsLogin(true)}>Login</button>
//                     <button className={!isLogin ? 'active' : ""} onClick={() => setIsLogin(false)}>Sign Up</button>
//                 </div>

//                 {isLogin ? (
//                     <div className='form'>
//                         <h2>Login Form</h2>
//                         <input type='email' placeholder='Email' />
//                         <input type='password' placeholder='Password' />
//                         <button onClick={() => loginWithRedirect()}>Login</button>
//                         <p>Not a Member? <a href='#' onClick={() => setIsLogin(false)}>Signup now</a></p>
//                         <div className="separator">
//                             <div className="line"></div>
//                             <div className="or">OR</div>
//                             <div className="line"></div>
//                         </div>
//                         <button className='login-with-google-btn' onClick={loginWithGoogle}>
//                             Sign In With Google
//                         </button>
//                     </div>
//                 ) : (
//                     <div className='form'>
//                         <h2>Sign Up Form</h2>
//                         <input type='email' placeholder='Email' />
//                         <input type='password' placeholder='Password' />
//                         <input type='password' placeholder='Confirm Password' />
//                         <button>Sign Up</button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Login;
import React, { useState } from 'react';
import "./styles/Login.css";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import "./PlagiarismChecker";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";

// Firebase configuration (Replace with your Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyDTfG9HCgYoPZ_3mbXOJQTs7TnFTvC5_y0",
    authDomain: "plagiarism-9424b.firebaseapp.com",
    projectId: "plagiarism-9424b",
    storageBucket: "plagiarism-9424b.firebasestorage.app",
    messagingSenderId: "417003928656",
    appId: "1:417003928656:web:7c6b17ec89e58040002555",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // For signup
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Login with email and password
    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/PlagiarismChecker"); // Redirect to PlagiarismChecker
        } catch (err) {
            if (err.code === "auth/user-not-found") {
                setError("User not found. Please sign up first.");
            } else if (err.code === "auth/wrong-password") {
                setError("Incorrect password. Please try again.");
            } else {
                setError(err.message);
            }
        }
    };

    // Sign up with email and password
    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setIsLogin(true); // Switch to login form after successful signup
        } catch (err) {
            setError(err.message);
        }
    };

    // Login with Google
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/PlagiarismChecker"); // Redirect to PlagiarismChecker
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <div className='form-toggle'>
                    <button
                        className={isLogin ? 'active' : ""}
                        onClick={() => {
                            setIsLogin(true);
                            setError("");
                        }}>
                        Login
                    </button>
                    <button
                        className={!isLogin ? 'active' : ""}
                        onClick={() => {
                            setIsLogin(false);
                            setError("");
                        }}>
                        Sign Up
                    </button>
                </div>

                {isLogin ? (
                    <div className='form'>
                        <h2>Login Form</h2>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={handleLogin}>Login</button>
                        <p>
                            Not a Member?{" "}
                            <a href='#' onClick={() => setIsLogin(false)}>
                                Signup now
                            </a>
                        </p>
                        <div className="separator">
                            <div className="line"></div>
                            <div className="or">OR</div>
                            <div className="line"></div>
                        </div>
                        <button className='login-with-google-btn' onClick={handleGoogleLogin}>
                            Sign In With Google
                        </button>
                    </div>
                ) : (
                    <div className='form'>
                        <h2>Sign Up Form</h2>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button onClick={handleSignUp}>Sign Up</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
