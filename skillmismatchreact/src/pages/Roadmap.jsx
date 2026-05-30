import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Roadmap.css";
import Navbar from "../components/Navbar";

const Roadmap = () => {
  const navigate = useNavigate();

  const course = localStorage.getItem("course") || "general";
  const domain = localStorage.getItem("domain") || "general";

  const roadmapKey = `roadmap_${course}_${domain}`;

  const [steps, setSteps] = useState([]);
  const [progress, setProgress] = useState(0);

  const [isSaved, setIsSaved] = useState(() => {
    return !!localStorage.getItem(roadmapKey);
  });

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        const stored =
          JSON.parse(localStorage.getItem(roadmapKey)) || {};

        let list = [];

        // USE SAVED ROADMAP
        if (stored?.steps?.length) {
          list = stored.steps;
        } else {
          const res = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                  {
                    role: "user",
                    content: `Generate a detailed learning roadmap for ${course} in ${domain}.

Return ONLY a plain list of learning steps.

Example:
HTML Basics
CSS Fundamentals
JavaScript DOM
React Hooks

Do not write Basic, Intermediate, Advanced.
Do not add headings.
Do not explain anything.`,
                  },
                ],
              }),
            }
          );

          const data = await res.json();
          const content = data?.choices?.[0]?.message?.content || "";

          console.log("RAW AI RESPONSE:", content);

          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
              list = parsed;
            }
          } catch {
            list = content
              .split("\n")
              .map((line) =>
                line
                  .replace(/^\d+\.\s*/g, "")
                  .replace(/^[-•*]\s*/g, "")
                  .replace(/"/g, "")
                  .trim()
              )
              .filter(
                (line) =>
                  line.length > 3 &&
                  !line.toLowerCase().includes("roadmap") &&
                  !line.toLowerCase().includes("sure") &&
                  !line.toLowerCase().includes("here") &&
                  !line.toLowerCase().includes("basic") &&
                  !line.toLowerCase().includes("intermediate") &&
                  !line.toLowerCase().includes("advanced")
              );
          }

          // 🔥 FIX: SAVE DIRECTLY INTO SAME KEY (IMPORTANT CHANGE ONLY)
          const existing =
            JSON.parse(localStorage.getItem(roadmapKey)) || {};

          const dataToStore = {
            steps: list,
            completedSteps: existing.completedSteps || [],
            unlockedSteps: existing.unlockedSteps || [],
            scores: existing.scores || {},
            progress: existing.progress || 0,
          };

          localStorage.setItem(
            roadmapKey,
            JSON.stringify(dataToStore)
          );
        }

        const initialStored =
          JSON.parse(localStorage.getItem(roadmapKey)) || {};

        list = initialStored.steps || [];

        console.log("FINAL ROADMAP LIST:", list);

        if (!list.length) {
          list = [
            "Introduction",
            "Core Concepts",
            "Projects",
            "Advanced Topics",
          ];
        }

        const completed = initialStored.completedSteps || [];
        const unlocked = initialStored.unlockedSteps || [];

        const builtSteps = list.map((title, i) => {
          let status = "locked";

          if (i === 0) status = "active";

          if (completed.includes(title)) {
            status = "completed";
          }

          if (unlocked.includes(title)) {
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
          (completed.length / builtSteps.length) * 100
        );

        setProgress(percent || 0);
      } catch (error) {
        console.error("Roadmap Error:", error);

        const fallback = [
          "Introduction",
          "Core Concepts",
          "Projects",
          "Advanced Topics",
        ];

        setSteps(
          fallback.map((t, i) => ({
            id: i + 1,
            title: t,
            status: i === 0 ? "active" : "locked",
          }))
        );
      }
    };

    loadRoadmap();
  }, [course, domain, roadmapKey]);

  const saveRoadmap = () => {
    const existing =
      JSON.parse(localStorage.getItem(roadmapKey)) || {};

    const data = {
      steps: steps.map((s) => s.title),
      completedSteps: existing.completedSteps || [],
      unlockedSteps: existing.unlockedSteps || [],
      scores: existing.scores || {},
      progress: existing.progress || 0,
    };

    localStorage.setItem(roadmapKey, JSON.stringify(data));

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

      {!isSaved && (
        <button className="save-btn" onClick={saveRoadmap}>
          Save Roadmap
        </button>
      )}

      {isSaved && (
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