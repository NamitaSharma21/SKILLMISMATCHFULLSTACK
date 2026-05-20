import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Roadmap.css";

const Roadmap = () => {
  const navigate = useNavigate();

  const course = localStorage.getItem("course");
  const domain = localStorage.getItem("domain");
  const score = Number(localStorage.getItem("score") || 0);
  const maxScore = Number(localStorage.getItem("maxScore") || 5);

  const [roadmap, setRoadmap] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!course) {
      navigate("/domain");
      return;
    }

    const generateRoadmap = async () => {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;

      if (!apiKey) {
        setError("Missing API key");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "user",
                  content: `Give a learning roadmap for ${course} in ${domain}.
User score: ${score}/${maxScore}.

Return like:
Step 1: ...
Step 2: ...
Step 3: ...
Step 4: ...
Step 5: ...`,
                },
              ],
            }),
          }
        );

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;

        if (!content) {
          setError("No response from API");
          return;
        }

        const steps = content
          .split("\n")
          .map((line) => line.replace(/^\d+\.\s*|Step \d+:\s*/i, "").trim())
          .filter((line) => line.length > 0);

        setRoadmap(steps);
      } catch (err) {
        console.error(err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    generateRoadmap();
  }, [course, domain, score, maxScore, navigate]);

  const saveRoadmap = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/save-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          course,
          domain,
          score,
          roadmap: roadmap.map((r) => r.toString().trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (data.success) {
        alert("Roadmap saved successfully!");
      } else {
        alert("Failed to save roadmap");
      }

    } catch (err) {
      console.log(err);
      alert("Network error");
    }
  };

  return (
    <div className="roadmap-container">
      <h2>Your Learning Roadmap</h2>

      <p>Course: {course}</p>
      <p>Domain: {domain}</p>
      <p>Score: {score}/{maxScore}</p>

      {loading && <p>Generating roadmap...</p>}
      {error && <p className="error-text">{error}</p>}

      {roadmap.map((step, i) => (
        <div key={i} className="roadmap-card">
          {step}
        </div>
      ))}

      {roadmap.length > 0 && (
        <button onClick={saveRoadmap} className="save-btn">
          Save Roadmap
        </button>
      )}
    </div>
  );
};

export default Roadmap;