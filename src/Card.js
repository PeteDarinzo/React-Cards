import React from "react";
import "./Card.css"

const Card = ({ image, angle, x, y }) => {

  return (
    <div className="Card">
      <img src={image} style={{ transform: `rotate(${angle}deg) translate(${x}px, ${y}px)` }} />
    </div >
  );
}

export default Card;