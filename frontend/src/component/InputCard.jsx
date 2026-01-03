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

  const getMockResponse = (userInput) => {
    return {
      candidates: [
        {
          content: {
            parts: [
              {
                text: `Description:\n${userInput} is an innovative platform leveraging AI to solve real-world problems. It aims to streamline workflows and enhance user productivity through intelligent automation.\n\nPositives:\n1. Scalable architecture allowing for rapid growth.\n2. Strong focus on user experience and accessibility.\n3. High potential for market disruption in its niche.\n\nNegatives:\n1. High competition from established tech giants.\n2. Initial development costs may be significant.\n3. Dependence on third-party API reliability.\n\nHonest Verdict Tagline:\n"A promising concept with great potential if execution is flawless."`
              }
            ]
          }
        }
      ]
    };
  };

  const evaluateStartup = async () => {
    if (!input.trim()) {
      alert("Please enter a valid startup idea!");
      return;
    }

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    // Use Mock if Key is missing, or trying to avoid errors
    if (!API_KEY) {
       console.warn("API Key missing, using mock response.");
       handleMockFallback(input);
       setInput("");
       return;
    }

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
      console.log("Sending request to Gemini API...");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
         // Fallback to mock on ANY error (429, 404, 500)
         console.warn(`Gemini API failed (${response.status}), falling back to mock.`);
         handleMockFallback(input);
         setInput("");
         return;
      }

      const data = await response.json();
      processResponse(data, input);

    } catch (error) {
      console.error("Network error, falling back to mock:", error);
      handleMockFallback(input);
    }
    
    setInput("");
  };

  const handleMockFallback = (userInput) => {
      const mockData = getMockResponse(userInput);
      processResponse(mockData, userInput);
  };

  const processResponse = async (data, userInput) => {
      try {
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error("Invalid response format");
        }

        const text = data.candidates[0].content.parts[0].text;

        const botMessage = {
            sender: "bot",
            text,
            showGenerateCard: true,
            userInput: userInput,
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
            console.warn("User not logged in, skipping save.");
            return;
        }

        // Save idea to database
        const saveResponse = await fetch(`${API_BASE_URL}/ideas`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(ideaData),
        });

        if (!saveResponse.ok) {
            console.error("Failed to save idea to backend");
        } else {
            console.log("Idea saved successfully");
        }
    } catch (e) {
        console.error("Error processing response:", e);
        alert("An error occurred while processing the response.");
    }
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
