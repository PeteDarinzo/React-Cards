import React, { useState, useEffect, useRef } from "react";
import Card from "./Card.js";
import axios from "axios";
import "./DrawPile.css";
import { getRandomAngle, getRandomTranslation } from "./helpers.js";
import { clear } from "@testing-library/user-event/dist/clear";

const cardsUrl = "http://deckofcardsapi.com";
let deckId = "";


const DrawPile = () => {

  const [card, setCard] = useState(null);
  const [pile, setPile] = useState([]);
  const [draw, setDraw] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const timerId = useRef();
  // use isMounted to prevent adding the null card to the pile upon mount
  const isMounted = useRef(false);

  const toggleDraw = () => {
    setDraw(!draw);
  }

  /**
   * if shuffle button is pressed
   * toggle shuffle in state, to shuffle the deck
   * reset the pile, and reset draw in state
   */
  const toggleShuffle = () => {
    setShuffle(!shuffle); // toggle shuffle to invoke useEffect
    setPile([]);
    setDraw(false);
  }

  /**
   * shuffle the deck
   * if upon mount, create a new shuffled deck
   * if shuffling existing deck, use the deck id to shuffle
   */
  useEffect(() => {
    async function shuffleDeck() {
      // if a deck has already been created, simply shuffle instead of creating a new one
      // if no deck, create a new shuffled one, and record its id
      if (deckId) {
        const res = await axios.get(`http://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
      } else {
        const res = await axios.get(`${cardsUrl}/api/deck/new/shuffle/?deck_count=1`);
        deckId = res.data.deck_id;
      }
    }
    shuffleDeck();
  }, [shuffle]);

  /**
   * Request a card from the API
   * Set card data, along with random angle and x-y translation in state
   */
  async function drawCard() {

    // console.log(pile.length); // always 0

    const res = await axios.get(`${cardsUrl}/api/deck/${deckId}/draw/?count=1`);
    const code = res.data.cards[0].code;
    const image = res.data.cards[0].image;
    const angle = getRandomAngle();
    const x = getRandomTranslation();
    const y = getRandomTranslation();
    setCard(card => ({ image, code, angle, x, y }));

    if (res.data.remaining === 0) {
      clearInterval(timerId.current);
    }
  }

  /**
   * if draw is true and the number of drawn cards is below 52, draw a card
   * once 52 cards have been drawn, stop the timer
   * if the stop draw button is clicked, stop the timer
   */
  useEffect(() => {
    if (draw) {
      timerId.current = setInterval(() => {
        drawCard();
      }, 1000);
    } else {
      clearInterval(timerId.current);
    }

    // stop timer when page is navigated away from
    return () => clearInterval(timerId.current); 

  }, [draw]);

  /**
   * Upon each new card drawn update the pile in state with the current card data
   */
  useEffect(() => {
    // use isMounted ref to avoid adding the null card to the pile upon mount
    if (isMounted.current) {
      setPile(pile => [...pile, card])
    } else {
      isMounted.current = true;
    }
  }, [card]);

  return (
    <div >
      {(pile.length < 52) &&
        (<button className="DrawPile-button" onClick={toggleDraw}>{draw ? "Stop Drawing" : "Start Drawing"}</button>)}
      {(pile.length === 52) && <p className="DrawPile-empty">NO CARDS REMAINING!</p>}
      <button onClick={toggleShuffle}>Shuffle</button>
      <div className="DrawPile">
        {pile.map(({ image, code, angle, x, y }) => <Card image={image} key={code} angle={angle} x={x} y={y} />)}
      </div>
    </div>
  );
}

export default DrawPile;