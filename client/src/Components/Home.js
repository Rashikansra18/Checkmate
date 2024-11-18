import React from 'react'
import { NavLink } from "react-router-dom"
import "./styles/Home.css";
import logoImage from './Images/Black and White Modern Streetwear Logo.png';




const Home = () => {
  return (
      <div className="content">
        <div className="description">
          <h1>Welcome to Our Website!</h1>
          <p>
            This is a short description of what our website is about. We provide various services that
            help you achieve your goals. Our platform is user-friendly and offers a range of exciting
            features. Explore more and discover all the amazing things we have to offer.
          </p>
        </div>

        <div className="image-container">
          <img
            src={logoImage} // Replace with your image URL
            alt="Website"
            className="profile-image"
          />
        </div>
      </div>
  );
};


export default Home