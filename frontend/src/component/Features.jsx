import React from "react";
import "./Features.css";

const Features = () => {
  const features = [
    {
      icon: "💡",
      title: "Idea Validation",
      description: "Get instant feedback on your startup ideas from our AI",
    },
    {
      icon: "📊",
      title: "Market Analysis",
      description: "Deep insights into market trends and opportunities",
    },
    {
      icon: "🎯",
      title: "Target Audience",
      description: "Identify and understand your potential customers",
    },
    {
      icon: "⚡",
      title: "Quick Results",
      description: "Get comprehensive analysis in minutes",
    },
  ];

  return (
    <div className="features-page">
      <video autoPlay loop muted playsInline className="features-video">
        <source src="/assets/home.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="features-overlay">
        <div className="features-container">
          <div className="features-content">
            <h2 className="features-title">Why Choose Flawender?</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="feature-card"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
