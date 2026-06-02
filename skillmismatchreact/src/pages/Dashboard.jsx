import React from "react";
import "../Styles/Dashboard.css";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard">
      <h2 className="coming-soon">
  🚧 Dashboard is under development
    </h2>
      {/* LEFT SIDEBAR */}
      <div className="sidebar">

        <div className="profile-card">
          <div className="avatar">👤</div>

          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="main">

        {/* ACTIVE ROADMAP */}
        <div className="section">

          <h2>🔥 Active Roadmap</h2>

          <div className="active-card">
            <h3>React Roadmap</h3>
            <p>60% Completed</p>
            <button>Continue</button>
          </div>

        </div>

        {/* ALL ROADMAPS */}
        <div className="section">

          <h2>📚 All Roadmaps</h2>

          <div className="cards">

            <div className="card">
              <h4>React</h4>
              <p>60%</p>
            </div>

            <div className="card">
              <h4>Cyber Security</h4>
              <p>20%</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;