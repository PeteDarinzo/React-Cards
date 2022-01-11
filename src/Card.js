import React from "react";
import "./Card.css"

const Card = ({ image }) => {

  function getRandomAngle() {
    // Generate angle between -39 and 39 degrees for displaying a card
    const rotation = Math.floor(Math.random() * 40);
    const sign = Math.floor(Math.random() * 2)
    if (sign === 0) {
      return rotation * (-1);
    } else {
      return rotation;
    }
  }

  function getRandomTranslation() {
    // Generate small (+/- 30px) shift for displaying a card
    const translation = Math.floor(Math.random() * 31);
    const sign = Math.floor(Math.random() * 2)
    if (sign === 0) {
      return translation * (-1);
    } else {
      return translation;
    }
  }

  return (
    <div className="Card">
      <img src={image} style={{ transform: `rotate(${getRandomAngle()}deg) translate(${getRandomTranslation()}px, ${getRandomTranslation()}px)` }} />
    </div >
  );
}

export default Card;