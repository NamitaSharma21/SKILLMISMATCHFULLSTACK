import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Roadmap.css";
import Navbar from "../components/Navbar";

const Roadmap = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const course = localStorage.getItem("course") || "general";
  const domain = localStorage.getItem("domain") || "general";

  const roadmapKey = `roadmap_${user._id || user.email || "guest"}_${course}_${domain}`;

  const [steps, setSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const normalize = (v) =>
    (v || "").toString().trim().toUpperCase();

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        const stored =
          JSON.parse(localStorage.getItem(roadmapKey)) || {};

        let list = stored.steps || [];

        if (!list.length) {
          const res = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [
                  {
                    role: "user",
                    content: `Generate a detailed learning roadmap for ${course} in ${domain}.
Return ONLY a plain list of learning steps.`,
                  },
                ],
              }),
            }
          );

          const data = await res.json();
          const content = data?.choices?.[0]?.message?.content || "";

          list = content
            .split("\n")
            .map((line) =>
              line
                .replace(/^\d+\.\s*/g, "")
                .replace(/^[-•*]\s*/g, "")
                .replace(/"/g, "")
                .trim()
            )
            .filter((line) => line.length > 3);

          const existing =
            JSON.parse(localStorage.getItem(roadmapKey)) || {};

          localStorage.setItem(
            roadmapKey,
            JSON.stringify({
              steps: list,
              completedSteps: existing.completedSteps || [],
              unlockedSteps: existing.unlockedSteps || [],
              scores: existing.scores || {},
            })
          );
        }

        const finalData =
          JSON.parse(localStorage.getItem(roadmapKey)) || {};

        const completed = finalData.completedSteps || [];
        const unlocked = finalData.unlockedSteps || [];

        const builtSteps = (finalData.steps || []).map((title, i) => {
          let status = "locked";

          if (
            completed.some(
              (c) => normalize(c) === normalize(title)
            )
          ) {
            status = "completed";
          } else if (
            unlocked.some(
              (u) => normalize(u) === normalize(title)
            )
          ) {
            status = "active";
          } else if (i === 0) {
            status = "active";
          }

          return {
            id: i + 1,
            title,
            status,
          };
        });

        setSteps(builtSteps);

        const percent = Math.round(
          (completed.length / (builtSteps.length || 1)) * 100
        );

        setProgress(percent);
        setIsSaved(true);
      } catch (error) {
        console.error(error);

        setSteps([
          { id: 1, title: "Introduction", status: "active" },
          { id: 2, title: "Core Concepts", status: "locked" },
          { id: 3, title: "Projects", status: "locked" },
          { id: 4, title: "Advanced Topics", status: "locked" },
        ]);
      }
    };

    loadRoadmap();
  }, [course, domain, roadmapKey]);

  const saveRoadmap = () => {
    const existing =
      JSON.parse(localStorage.getItem(roadmapKey)) || {};

    localStorage.setItem(
      roadmapKey,
      JSON.stringify({
        ...existing,
        steps: steps.map((s) => s.title),
      })
    );

    setIsSaved(true);
  };

  const handleClick = (step) => {
    if (step.status === "locked") return;

    navigate("/verification-test", {
      state: { step: step.title },
    });
  };

  return (
    <div className="roadmap-container">
      <Navbar />

      <h2>{course} Roadmap</h2>

      <h3>Progress: {progress}%</h3>

      {!isSaved ? (
        <button className="save-btn" onClick={saveRoadmap}>
          Save Roadmap
        </button>
      ) : (
        <p className="saved-text">Roadmap Saved ✔</p>
      )}

      <div className="roadmap-list">
        {steps.map((s) => (
          <div
            key={s.id}
            className={`roadmap-card ${s.status}`}
            onClick={() => handleClick(s)}
          >
            {s.id}. {s.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;