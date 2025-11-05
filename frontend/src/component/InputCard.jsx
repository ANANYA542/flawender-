import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ChatInput.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatBot = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleGenerateCard = (message, userInput) => {
    navigate("/output-card", {
      state: {
        analysis: message,
        userInput: userInput,
      },
    });
  };

  const evaluateStartup = async () => {
    if (!input.trim()) {
      alert("Please enter a valid startup idea!");
      return;
    }

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const API_KEY = "AIzaSyDpZeQtKG8IdKSCzHiuf3gxgfnjpI2sXqQ";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const prompt = `You are an expert startup evaluator.
You will be given a startup idea.
Analyze it deeply and honestly.

Your task is to:
1. Write a very short description of the project (less than 50 words).
2. List the top 3 to 5 Positives about the idea (strengths, opportunities, advantages).
3. List the top 3 to 5 Negatives about the idea (risks, weaknesses, threats).
4. Provide a short, bold Honest Verdict Tagline (one punchy sentence that sums up your opinion).

---
Startup Idea:
${input}
---

Respond in the following format:

Description:
... (max 50 words)

Positives:
1. ...
2. ...
3. ...

Negatives:
1. ...
2. ...
3. ...

Honest Verdict Tagline:
"..."`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;

      const botMessage = {
        sender: "bot",
        text,
        showGenerateCard: true,
        userInput: input,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Extract data using regex
      const ideaData = {
        Description: text.match(/Description:\s*(.+?)\n/i)?.[1] || "",
        Positive:
          text.match(/Positives:\s*([\s\S]*?)Negatives:/i)?.[1].trim() || "",
        Negative:
          text
            .match(/Negatives:\s*([\s\S]*?)Honest Verdict Tagline:/i)?.[1]
            .trim() || "",
        Verdict: text.match(/Honest Verdict Tagline:\s*"(.+?)"/i)?.[1] || "",
      };

      if (!isAuthenticated()) {
        alert("User not logged in. Please log in to save your idea.");
        return;
      }

      // Save idea to database
      const saveResponse = await fetch(`${API_BASE_URL}/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ideaData),
      });

      if (!saveResponse.ok) {
        const error = await saveResponse.json();
        throw new Error(error.error || 'Failed to save idea');
      }

      const result = await saveResponse.json();
      console.log("Idea saved successfully:", result);
    } catch (error) {
      console.error("Error evaluating or saving startup idea:", error);
      alert("Failed to evaluate or save your startup idea.");
    }

    setInput("");
  };

  return (
    <div className="chat-section">
      <video autoPlay loop muted className="chat-background-video">
        <source src="/assets/home.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message-wrapper">
              <div className={msg.sender}>
                {msg.text.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              {msg.sender === "bot" && msg.showGenerateCard && (
                <button
                  className="generate-card-button"
                  onClick={() => handleGenerateCard(msg.text, msg.userInput)}
                >
                  Generate Your Startup's Tarot Card
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Enter Your Idea"
            className="input-field"
          />
          <button onClick={evaluateStartup}>Evaluate Idea</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
