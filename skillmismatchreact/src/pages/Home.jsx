import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Home.css";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="home-container">

        {/* HERO SECTION */}
        <div className="hero">

          <div className="hero-text">
            <h1>Build Your Personalized Roadmap</h1>
            <p>
              Take a skill test and get an AI-generated learning path based on your level.
            </p>

            <Link to="/domain" className="start-btn">
              Get Started
            </Link>
          </div>

          <div className="hero-image">
            <img
              src="/src/assets/skillldev.webp"
              alt="roadmap"
            />
          </div>

        </div>

        {/* FEATURES */}
        <div className="features">

          <div className="card">
            <h3>Skill Test</h3>
            <p>Test your knowledge level with smart questions.</p>
          </div>

          <div className="card">
            <h3>AI Roadmap</h3>
            <p>Get personalized learning roadmap instantly.</p>
          </div>

          <div className="card">
            <h3>Easy Learning</h3>
            <p>Step-by-step structured learning path.</p>
          </div>

        </div>

        {/* ABOUT SECTION */}
        <div className="about-section">

          <h2>What is Skill Mismatch?</h2>

          <p>
            Skill mismatch refers to a situation where there is a gap between the skills
            possessed by workers and the skills demanded by employers. This often leads
            to unemployment or underemployment.
          </p>

          <p>
            Several factors contribute to skill mismatch, including rapid technological
            advancements, changing industry demands, and outdated education systems.
          </p>

          <p>
            Our platform helps users choose their domain, take a skill assessment test,
            and receive a personalized roadmap to improve their skills effectively.
          </p>

        </div>

      </div>
    </>
  );
};

export default Home;