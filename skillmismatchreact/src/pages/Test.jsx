import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Test.css";

const Test = () => {
  const navigate = useNavigate();

  const course = localStorage.getItem("course");
  const domain = localStorage.getItem("domain");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!course) {
      navigate("/domain");
      return;
    }

    const generateQuestions = async () => {
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
                  content: `Generate 5 MCQ questions for ${course} in ${domain}.

Format:
Question: ...
A) ...
B) ...
C) ...
D) ...
Correct: (write correct option text, not A/B/C/D)

Do NOT return JSON.`,
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

        const blocks = content.split("\n\n").filter(Boolean);

        const parsed = blocks.map((block) => {
          const lines = block.split("\n");

          const options = [
            lines[1]?.replace("A)", "").trim(),
            lines[2]?.replace("B)", "").trim(),
            lines[3]?.replace("C)", "").trim(),
            lines[4]?.replace("D)", "").trim(),
          ].filter(Boolean);

          return {
            question: lines[0]?.replace("Question:", "").trim() || "",
            options,
            correct: lines[5]?.replace("Correct:", "").trim() || "",
          };
        });

        setQuestions(parsed);
      } catch (err) {
        console.error(err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    generateQuestions();
  }, [course, domain, navigate]);

  // ✅ FIXED CLICK HANDLER
  const handleSelect = (qIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  // ✅ FIXED SCORE LOGIC (REAL FIX)
  const handleSubmit = () => {
    let score = 0;

    questions.forEach((q, i) => {
      if (
        answers[i]?.toLowerCase().trim() ===
        q.correct?.toLowerCase().trim()
      ) {
        score++;
      }
    });

    localStorage.setItem("score", score);
    localStorage.setItem("maxScore", questions.length);

    navigate("/roadmap");
  };

  return (
    <div className="test-container">
      <h2>{course} Test</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {questions.map((q, i) => (
        <div key={i} className="question-card">
          <h4>{q.question}</h4>

          <div className="options">
            {q.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(i, opt)}
                className={`option-btn ${
                  answers[i] === opt ? "active-option" : ""
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {questions.length > 0 && (
        <button onClick={handleSubmit} className="submit-btn">
          Submit
        </button>
      )}
    </div>
  );
};

export default Test;