import React from "react";
import "./AboutUs.css";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="about-container">
      <header className="header">
      <img src={require("../assets/clearzonelogo.jpg")} alt="ClearZone Logo" className="logo" />
    <span className="site-name">ClearZone</span>
        <nav>
          <ul>
          <li><strong><Link to="/contact">Contact Us</Link></strong></li>
          </ul>
        </nav>
      </header>

      <section className="about-content">
        <h1>ABOUT US</h1>
        <p><strong>ClearZone</strong> is a smart waste management platform designed to enhance urban cleanliness using IoT and AI-based solutions. Our mission is to revolutionize waste collection and recycling processes, making cities more sustainable and environmentally friendly.</p>

        <h2>Our Vision</h2>
        <p>At <strong>ClearZone</strong>, we aim to create a cleaner, greener future by optimizing waste collection and reducing environmental impact. Our platform connects waste management services with real-time data analytics to enhance efficiency.</p>

        <h2>Why Choose Us?</h2>
        <ul>
          <li>Real-time waste monitoring and smart bin technology</li>
          <li>AI-powered waste classification for efficient recycling</li>
          <li>Community engagement and environmental awareness</li>
        </ul>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          {/* Logo & Site Name */}
          <div className="footer-left">
            <img src={require("../assets/clearzonelogo.jpg")} alt="ClearZone Logo" className="footer-logo" />
            <span className="footer-site-name">ClearZone</span>
          </div>

          {/* Quick Links */}
          {/*<div className="footer-middle">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>*/}

          {/* Social Media Links */}
          <div className="footer-right">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={require("../assets/facebook-icon.png")} alt="Facebook" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={require("../assets/twitter-icon.png")} alt="Twitter" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={require("../assets/instagram-icon.png")} alt="Instagram" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <p>©️ 2025 ClearZone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;