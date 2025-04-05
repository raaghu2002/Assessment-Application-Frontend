import React from "react";
import "./RotatingCircles.css"; // Ensure this CSS file exists

const RotatingCircles = () => {
  const images = [
    "/images/java-icon.png",
    "/images/javascript-icon.png",
    "/images/react-icon.png",
    "/images/python-icon.png",
    "/images/sql-icon.png",
  ];

  const radii = [125, 90, 60]; // Radii for different circle layers

  return (
    <div className="rotating-section">
      <div className="rotating-container">
        <div className="circle outer"></div>
        <div className="circle middle"></div>
        <div className="circle inner"></div>

        {/* Position images dynamically */}
        {images.map((src, index) => {
          const angle = (index * 360) / images.length;
          const radius = radii[index % radii.length]; // Assign images to different circles

          return (
            <img
              key={index}
              src={src}
              className="rotating-image"
              alt="tech-logo"
              style={{
                top: `calc(50% + ${
                  radius * Math.sin((angle * Math.PI) / 180)
                }px)`,
                left: `calc(50% + ${
                  radius * Math.cos((angle * Math.PI) / 180)
                }px)`,
                transform: `rotate(${angle}deg)`, // Align with circle rotation
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RotatingCircles;
