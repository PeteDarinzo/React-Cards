import React, { useState, useEffect, useRef } from "react";
import Card from "./Card.js";
import axios from "axios";
import "./DrawPile.css";


const cardsUrl = "http://deckofcardsapi.com";
let deckId = "";


const DrawPile = () => {

  const [card, setCard] = useState(null);
  const [pile, setPile] = useState([]);
  const [draw, setDraw] = useState(false);

  const timerId = useRef();
  // prevent second useEffect from executing until the draw button is clicked
  const isMounted = useRef(false);

  const toggleDraw = () => {
    setDraw(!draw);
  }

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

  useEffect(() => {
    if (draw) {
      timerId.current = setInterval(() => {
        drawCard();
      }, 1000);
    } else {
      clearInterval(timerId.current);
    }
  }, [draw]);

  /**
   * Upon each new card drawn
   * Update the pile in state with the current card
   */
  useEffect(() => {
    // use isMounted ref to avoid adding a card upon mount
    if (isMounted.current) {
      if (pile.length < 51) {
        setPile(pile => [...pile, card])
      } else {
        clearInterval(timerId.current);
      }
    } else {
      isMounted.current = true;
    }
  }, [card]);

  return (
    <div >
      {(pile.length < 52) && (draw ? <button className="DrawPile-button" onClick={toggleDraw}>Stop Drawing</button> : <button className="DrawPile-button" onClick={toggleDraw}>Start Drawing</button>)}
      {(pile.length === 52) && <p className="DrawPile-empty">NO CARDS REMAINING!</p>}
      <div className="DrawPile">
        {pile}
      </div>
    </div>
  );
}

export default DrawPile;