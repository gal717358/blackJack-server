const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

// Helper function to generate a random card value (1-10)
const generateCardValue = () => Math.floor(Math.random() * 10 + 1);

// Helper function to calculate the total hand value
const calculateHandValue = (hand) => hand.reduce((acc, card) => acc + card, 0);

// Route to start a new game
app.get('/new-game', (req, res) => {
  const playerHand = [generateCardValue(), generateCardValue()];
  const dealerHand = [generateCardValue(), generateCardValue()];
  const playerTotal = calculateHandValue(playerHand);
  const dealerTotal = calculateHandValue(dealerHand);

  // Send back the player's hand and one card from the dealer's hand
  res.json({
    playerHand,
    dealerHand: [dealerHand[0]],
    playerTotal,
    dealerTotal,
  });
});

// Route to hit (draw another card)
app.get('/hit', (req, res) => {
  const newCard = generateCardValue();
  const playerTotal = calculateHandValue([...req.query.playerHand, newCard]);

  // Send back the new hand and the updated total
  res.json({
    playerHand: [...req.query.playerHand, newCard],
    playerTotal,
  });
});

// Route to play the dealer's turn
app.get('/play-dealer', (req, res) => {
  let dealerHand = [...req.query.dealerHand, generateCardValue()];
  let dealerTotal = calculateHandValue(dealerHand);

  // Keep hitting until the dealer's total is 17 or higher
  while (dealerTotal < 17) {
    dealerHand = [...dealerHand, generateCardValue()];
    dealerTotal = calculateHandValue(dealerHand);
  }

  // Send back the final dealer hand and total
  res.json({
    dealerHand,
    dealerTotal,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
