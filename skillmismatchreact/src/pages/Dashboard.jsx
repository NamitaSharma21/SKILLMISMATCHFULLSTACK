import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Dashboard.css";

const courses = [
  {
    id: "react-development",
    title: "React Development",
    domain: "Web Development",
  },
  {
    id: "python-ml",
    title: "Python & ML",
    domain: "AI/ML",
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    domain: "Cyber Security",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const userId = user._id || user.email || "guest";

  // Get all actually saved roadmaps
  const roadmaps = courses
    .map((course) => {
      const roadmapKey = `roadmap_${userId}_${course.title}_${course.domain}`;

      const stored = JSON.parse(
        localStorage.getItem(roadmapKey)
      );

      if (!stored || !stored.steps || stored.steps.length === 0) {
        return null;
      }

      const completedSteps = stored.completedSteps || [];
      const totalSteps = stored.steps.length;

      const progress = Math.round(
        (completedSteps.length / totalSteps) * 100
      );

      return {
        ...course,
        roadmapKey,
        progress,
        steps: stored.steps,
      };
    })
    .filter(Boolean);

  // Find last used roadmap
  const lastUsed = JSON.parse(
    localStorage.getItem("lastUsedRoadmap")
  );

  let activeRoadmap = null;

  if (lastUsed) {
    activeRoadmap = roadmaps.find(
      (roadmap) =>
        roadmap.title === lastUsed.course &&
        roadmap.domain === lastUsed.domain
    );
  }

  // If there is no last-used roadmap,
  // show the first available saved roadmap
  if (!activeRoadmap && roadmaps.length > 0) {
    activeRoadmap = roadmaps[0];
  }

  const continueRoadmap = (roadmap) => {
    // Restore existing roadmap context
    localStorage.setItem("course", roadmap.title);
    localStorage.setItem("domain", roadmap.domain);

    // Remember the last used roadmap
    localStorage.setItem(
      "lastUsedRoadmap",
      JSON.stringify({
        course: roadmap.title,
        domain: roadmap.domain,
      })
    );

    // Navigate using the existing roadmap flow
    navigate("/roadmap");
  };

  return (
    <div className="dashboard">

      {/* USER PROFILE */}
      <div className="profile-card">
        <div className="avatar">👤</div>

        <h3>{user?.name || "User"}</h3>

        <p>{user?.username || "No username available"}</p>
      </div>


      {/* MAIN CONTENT */}
      <div className="main">

        {/* ACTIVE ROADMAP */}
        <div className="section">
          <h2>🔥 Active Roadmap</h2>

          {activeRoadmap ? (
            <div className="active-card">

              <div>
                <h3>{activeRoadmap.title}</h3>

                <p>
                  {activeRoadmap.progress}% Completed
                </p>
              </div>

              <button
                onClick={() =>
                  continueRoadmap(activeRoadmap)
                }
              >
                Continue
              </button>

            </div>
          ) : (
            <div className="active-card">

              <h3>No Active Roadmap</h3>

              <p>
                Start a roadmap to see your progress here.
              </p>

              <button
                onClick={() => navigate("/domain")}
              >
                Choose Roadmap
              </button>

            </div>
          )}
        </div>


        {/* ALL ROADMAPS */}
        <div className="section">

          <h2>📚 All Roadmaps</h2>

          {roadmaps.length > 0 ? (
            <div className="cards">

              {roadmaps.map((roadmap) => (
                <div
                  key={roadmap.roadmapKey}
                  className="card"
                >

                  <h4>{roadmap.title}</h4>

                  <p>
                    {roadmap.progress}% Completed
                  </p>

                  <button
                    onClick={() =>
                      continueRoadmap(roadmap)
                    }
                  >
                    Continue
                  </button>

                </div>
              ))}

            </div>
          ) : (
            <div className="active-card">

              <p>
                You haven't started any roadmap yet.
              </p>

              <button
                onClick={() => navigate("/domain")}
              >
                Start a Roadmap
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;