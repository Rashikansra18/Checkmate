// import axios from 'axios';
// import React, { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom';
// import PlagiarismChecker from './PlagiarismChecker';

// const Dashboard = () => {

//   const navigate = useNavigate();

//   const getUser = async () => {
//     try {
//         const response = await axios.get("http://localhost:6005/login/sucess", { withCredentials: true });

//         console.log("response",response)
//     } catch (error) {
//       navigate("*")
//     }
// }


// useEffect(() => {
//   getUser()
// }, [])
//   return (
//     <div style={{textAlign:"center"}}>
//         {/* <h1>Dashboard</h1> */
//         <PlagiarismChecker/>}

//       </div>
//   )
// }

// export default Dashboard

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PlagiarismChecker from "./PlagiarismChecker";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Function to check the authenticated user
  const checkUser = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // If user is logged in, set user state
      } else {
        navigate("*"); // Redirect to error page if no user is found
      }
    });
  };

  // Run on component mount
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      {user ? (
        // Show PlagiarismChecker if the user is logged in
        <PlagiarismChecker />
      ) : (
        <p>Loading...</p> // Show a loading message while user data is being checked
      )}
    </div>
  );
};

export default Dashboard;
