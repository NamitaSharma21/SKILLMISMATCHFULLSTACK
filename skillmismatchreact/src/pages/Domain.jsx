import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Domain.css";
import Navbar from "../components/Navbar";

const courses = [
  {
    id: "react-development",
    title: "React Development",
    description: "Build interactive web apps with React, JSX, and hooks.",
    domain: "Web Development",
  },
  {
    id: "python-ml",
    title: "Python & ML",
    description: "Python fundamentals, data science, and machine learning.",
    domain: "AI/ML",
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    description: "Networks, ethical hacking, and security fundamentals.",
    domain: "Cyber Security",
  },
];

const Domain = () => {
  const navigate = useNavigate();

  const selectCourse = (course) => {
    localStorage.setItem("course", course.title);
    localStorage.setItem("domain", course.domain);

    // 🔥 OLD: navigate("/test")
    // ❌ removed test flow

    // ✅ NEW FLOW: directly roadmap
    navigate("/roadmap");
  };

  return (
    <>
      <Navbar />

      <div className="domain-container">
        <h1>Select Your Course</h1>
        <p>
          Choose a course to generate your personalized roadmap.
        </p>

        <div className="domain-grid">
          {courses.map((course) => (
            <div
              key={course.id}
              className="domain-card"
              onClick={() => selectCourse(course)}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Domain;