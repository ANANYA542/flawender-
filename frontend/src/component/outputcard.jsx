import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Outputcard.css";

const OutputCard = () => {
  const location = useLocation();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (location.state) {
      setData(location.state);
      console.log("Received data:", location.state);
    }
  }, [location.state]);

  useEffect(() => {
    const card = document.querySelector(".output-card");
    if (card) {
      card.classList.add("animate");
    }
  }, []);

  if (!data) {
    return (
      <div className="output-card-section">
        <video autoPlay loop muted className="output-background-video">
          <source src="/assets/home.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="error-message">Loading...</div>
      </div>
    );
  }

  // Extract and organize sections
  const sections = {
    Description: [],
    "Honest Verdict Tagline": [],
    Positives: [],
    Negatives: [],
  };

  let currentKey = null;

  data.analysis.split("\n").forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("Description:")) {
      currentKey = "Description";
    } else if (trimmed.startsWith("Positives:")) {
      currentKey = "Positives";
    } else if (trimmed.startsWith("Negatives:")) {
      currentKey = "Negatives";
    } else if (trimmed.startsWith("Honest Verdict Tagline:")) {
      currentKey = "Honest Verdict Tagline";
    } else if (currentKey && trimmed !== "") {
      sections[currentKey].push(trimmed);
    }
  });

  const orderedSections = [
    "Description",
    "Honest Verdict Tagline",
    "Positives",
    "Negatives",
  ];

  return (
    <div className="output-card-section">
      <video autoPlay loop muted className="output-background-video">
        <source src="/assets/home.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="output-card">
        <div className="card-content">
          <h2 className="idea-title">{data.userInput}</h2>

          {orderedSections.map((key) => (
            <div
              key={key}
              className={`section ${key.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <h3 className="section-title">{key}</h3>
              <div className="analysis-content">
                {sections[key] && sections[key].length > 0 ? (
                  sections[key].map((line, index) => (
                    <p key={index} className="analysis-line">
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="section-text">No data available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutputCard;
