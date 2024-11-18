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
           Checkmate is an advanced plagiarism detection tool designed to help you ensure originality and integrity
           in your written content. Using cutting-edge algorithms and web scraping techniques, Checkmate quickly 
           scans your text against billions of online sources to identify copied or uncredited material.
           Whether you're a student, researcher, or content creator, Checkmate provides accurate reports 
           with detailed similarity scores. Trust Checkmate to safeguard your work from unintentional 
           plagiarism and maintain high-quality standards.
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