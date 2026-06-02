import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/Verification.css";

const VerificationTest = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const step = state?.step || "Test";

  const course = localStorage.getItem("course") || "general";
  const domain = localStorage.getItem("domain") || "general";

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const roadmapKey = `roadmap_${user._id || user.email || "guest"}_${course}_${domain}`;

  const normalize = (v) =>
    (v || "").toString().trim().toUpperCase();

  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
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
                  content: `Generate 5 MCQ questions for ${step}.
Return ONLY JSON:
[
  {
    "question": "string",
    "options": {
      "A": "option 1",
      "B": "option 2",
      "C": "option 3",
      "D": "option 4"
    },
    "answer": "A"
  }
]`,
                },
              ],
            }),
          }
        );

        const data = await res.json();
        const raw = data?.choices?.[0]?.message?.content || "";
        const json = raw.match(/\[[\s\S]*\]/);

        setQuestions(json ? JSON.parse(json[0]) : []);
      } catch {
        setQuestions([
          {
            question: `What is ${step}?`,
            options: {
              A: "Option A",
              B: "Option B",
              C: "Option C",
              D: "Option D",
            },
            answer: "A",
          },
        ]);
      }
    };

    loadQuestions();
  }, [step]);

  const handleSelect = (i, key) => {
    setSelected((prev) => ({
      ...prev,
      [i]: key,
    }));
  };

  const calculateScore = () => {
    let s = 0;

    questions.forEach((q, i) => {
      if (normalize(selected[i]) === normalize(q.answer)) {
        s++;
      }
    });

    return s;
  };

  const updateRoadmap = (finalScore) => {
    const existing =
      JSON.parse(localStorage.getItem(roadmapKey)) || {};

    const data = {
      steps: existing.steps || [],
      completedSteps: existing.completedSteps || [],
      unlockedSteps: existing.unlockedSteps || [],
      scores: existing.scores || {},
    };

    const pass = Math.ceil(questions.length * 0.6);

    if (finalScore >= pass && !data.completedSteps.includes(step)) {
      data.completedSteps.push(step);
    }

    const roadmapSteps = data.steps;

    const currentIndex = roadmapSteps.findIndex(
      (s) => normalize(s) === normalize(step)
    );

    if (
      finalScore >= pass &&
      currentIndex !== -1 &&
      currentIndex < roadmapSteps.length - 1
    ) {
      const nextStep = roadmapSteps[currentIndex + 1];

      if (!data.unlockedSteps.includes(nextStep)) {
        data.unlockedSteps.push(nextStep);
      }
    }

    data.scores[step] = finalScore;

    localStorage.setItem(roadmapKey, JSON.stringify(data));
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();

    setScore(finalScore);

    updateRoadmap(finalScore);

    setSelected({});

    setTimeout(() => {
      navigate("/roadmap");
    }, 1000);
  };

  return (
    <div className="test-container">
      <h2>{step} Test</h2>

      {questions.map((q, i) => (
        <div key={i} className="question-box">
          <p>{q.question}</p>

          {Object.entries(q.options || {}).map(([key, value]) => (
            <button
              key={key}
              className={selected[i] === key ? "selected" : ""}
              onClick={() => handleSelect(i, key)}
            >
              {key}. {value}
            </button>
          ))}
        </div>
      ))}

      <button className="submit-btn" onClick={handleSubmit}>
        Submit Test
      </button>

      {score !== null && (
        <h3>
          Score: {score} / {questions.length}
        </h3>
      )}
    </div>
  );
};

export default VerificationTest;