const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const port = 3001;

function generateDeck() {
  const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
  const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
  const colors = {
    clubs: 'black',
    diamonds: 'red',
    hearts: 'red',
    spades: 'black',
  };
  const deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      const card = { suit, value, color: colors[suit] };
      deck.push(card);
    });
  });
  return deck;
}

let playerCards = [];
let dealerCards = [];
let playerTotal = 0;
let dealerTotal = 0;

const startGame = () => {
  playerCards = [getRandomCard(), getRandomCard()];
  dealerCards = [getRandomCard(), getRandomCard()];
  playerTotal = calculateTotal(playerCards);
  dealerTotal = calculateTotal(dealerCards);
};

const hit = () => {
  playerCards.push(getRandomCard());
  playerTotal = calculateTotal(playerCards);
};

const stay = () => {
  while (dealerTotal < 17) {
    dealerCards.push(getRandomCard());
    dealerTotal = calculateTotal(dealerCards);
  }
};

const getRandomCard = () => {
  const cards = generateDeck();
  return cards[Math.floor(Math.random() * cards.length)];
};

const calculateTotal = (cards) => {
  let total = 0;
  let numOfAces = 0;
  cards.forEach((card) => {
    if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
      total += 10;
    } else if (card.value === 'A') {
      total += 11;
      numOfAces += 1;
    } else {
      total += parseInt(card.value);
    }
  });
  if (total > 21 && numOfAces > 0) {
    total -= 10;
    numOfAces -= 1;
  }

  return total;
};

app.get('/start', (req, res) => {
  startGame();
  res.json({ playerCards, dealerCards, playerTotal, dealerTotal });
});

app.get('/hit', (req, res) => {
  hit();
  res.json({ playerCards, playerTotal });
});

app.get('/stay', (req, res) => {
  stay();
  res.json({ dealerCards, dealerTotal, playerTotal });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
