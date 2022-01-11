import React, { useState, useEffect, useRef } from "react";
import Card from "./Card.js";
import axios from "axios";
import "./DrawPile.css";

const cardsUrl = "http://deckofcardsapi.com";
let deckId = "";


const DrawPile = () => {

  const [card, setCard] = useState(null);
  const [pile, setPile] = useState([]);

  // prevent second useEffect from executing until the draw button is clicked
  const isMounted = useRef(false);

  // shuffle deck and get id once on mount
  useEffect(() => {
    async function shuffleDeck() {
      const res = await axios.get(`${cardsUrl}/api/deck/new/shuffle/?deck_count=1`);
      deckId = res.data.deck_id;
    }
    shuffleDeck();
  }, []);

  /**
   * Request a card from the API
   * set as current card in state
   */
  async function drawCard() {
    const res = await axios.get(`${cardsUrl}/api/deck/${deckId}/draw/?count=1`);
    const code = res.data.cards[0].code;
    const image = res.data.cards[0].image;
    setCard(() => <Card image={image} key={code} />);
  }

  /**
   * Upon each new card set in state
   * Update the pile in state with the current card
   */
  useEffect(() => {
    // use isMounted ref to avoid adding a card upon mount
    isMounted.current ? setPile(pile => [...pile, card]) : isMounted.current = true;
  }, [card]);

  return (
    <div >
      {(pile.length < 52) && <button className="DrawPile-button" onClick={drawCard}>DRAW</button>}
      {(pile.length === 52) && <p className="DrawPile-empty">NO CARDS REMAINING!</p>}
      <div className="DrawPile">
        {pile}
      </div>
    </div>
  );
}

export default DrawPile;