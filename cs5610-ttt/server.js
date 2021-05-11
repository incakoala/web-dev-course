const express = require('express');
const app = express();

// Initial game state
var ttt = {
  board: [
    ' ', ' ', ' ',
    ' ', ' ', ' ',
    ' ', ' ', ' '
  ],
  moves: [],
  turn: 'X',
};

// Winning combos
const winningCombos = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
  [1, 4, 7], [2, 5, 8], [3, 6, 9], // cols
  [1, 5, 9], [3, 5, 7] // diagonals
];

// Maximum moves allowed for 3x3 board
const maxMoves = 3 * 3;

// Check whether current turn's player is a winner
// Return winning combo if won, undefined otherwise
function checkWin() {
  const board = ttt.board;
  const player = ttt.turn; // current player
  // Iterate through each combo
  for (let i = 0; i < winningCombos.length; i++) {
    let combo = winningCombos[i]; // current combo
    // Player is winner if matched with a winning combo
    if ((board[combo[0] - 1] === player)
      && (board[combo[1] - 1] === player)
      && (board[combo[2] - 1] === player)) {
      return combo;
    };
  };
  // Not a winner this time
  return undefined;
};

// Set the marker for the player (X or O) 
// at the specified board position (1-9)
app.post('/ttt/:position/:player', (req, res) => {
  console.log('POST');
  const position = req.params.position;
  const player = req.params.player;

  // Handle bad cases first
  // Position must be from 1-9 and player must be either X or O
  if (position < 1 || 9 < position || ['X', 'O'].indexOf(player) === -1) {
    res.status(404).send('Invalid');
  }
  else {
    // Must be player's turn to play
    if (ttt.turn != player) {
      res.status(403).send('Forbidden');
    }
    // Position must not be occupied
    else if (ttt.board[position - 1] != ' ') {
      res.status(409).send('Conflict');
    }
    // Can play now!
    else {
      // Set marker on board and 
      // push position to stack
      ttt.board[position - 1] = player;
      ttt.moves.push(position);

      // Check for a winning combo
      if (checkWin() != undefined) {
        object = {}
        object[player] = checkWin();
        ttt.won = object;
        // Game ends with a WIN
        delete ttt.turn; // delete turn prop
        res.status(200).send(player + ' wins!');
      }
      // If there's no winner yet AND
      // there are still moves to make
      else if (ttt.moves.length < maxMoves) {
        // Assign next turn
        ttt.turn = ttt.turn === 'X' ? 'O' : 'X';
        res.status(201).send('Created');
      }
      // If it has reached maxMoves AND
      // there's no winner yet
      else {
        // Game ends with a DRAW
        delete ttt.turn; // delete turn prop
        res.status(200).send('Draw');
      };
    };
  };
});

// Get game state object
app.get('/ttt', (req, res) => {
  console.log('GET');
  res.status(200).send(ttt);
});

// Get the value of marker ('X' or 'O') at position
// (this route only takes numeric values)
app.get('/ttt/:pos(\\d+)', (req, res) => {
  console.log('GET');
  const pos = req.params.pos;
  if (pos < 1 || 9 < pos) {
    res.status(404).send('Invalid');
  }
  else {
    res.status(200).send(ttt.board[pos - 1]);
  };
});

// Get object whose key is the player, 
// and whose value is an array of positions (1-9) occupied by that player
// (this route takes anything but numeric values)
app.get('/ttt/:player', (req, res) => {
  console.log('GET');
  const player = req.params.player;
  // Input handling: player can only be either X or O
  if (['X', 'O'].indexOf(player) === -1) {
    res.status(404).send('Invalid');
  }
  else {
    // Find positions occupied by player
    const positions = ttt.board.reduce((ret, e, i) => {
      // Add positions to array if it's occupied by player
      if (e === player) { ret.push(i + 1) };
      return ret;
    }, []); // if there are none occupied, positions is an empty array
    // return object
    object = {}
    object[player] = positions;
    res.status(200).send(object);
  };
});

// Undo the most recently made move if it was made by the player
// and if there is at least one move left to undo
app.patch('/ttt/:player', (req, res) => {
  console.log('PATCH');
  const player = req.params.player;
  const numMoves = ttt.moves.length;
  // Request only valid if:
  // There's at least one move made AND
  // ((numMoves is odd AND player is 'X') OR (numMoves is even AND player is 'O'))
  // since X always starts the game first
  if (numMoves != 0
    && ((numMoves % 2 !== 0 && player === 'X')
      || (numMoves % 2 === 0 && player === 'O'))) {
    // Reset most recent move on board to ' '
    ttt.board[ttt.moves[numMoves - 1] - 1] = ' ';
    // Remove most recent move from stack
    ttt.moves.pop();
    // Reassign current turn to player
    ttt.turn = player;
    // Delete won property if any
    delete ttt.won;
    res.status(200).send('Undone')
  }
  // Undo forbidden if the above conditions not satisfied
  else {
    res.status(403).send('Forbidden');
  };
});

// Reset the game to its initial state
console.log('DELETE');
app.delete('/ttt', (req, res) => {
  ttt = {
    board: [
      ' ', ' ', ' ',
      ' ', ' ', ' ',
      ' ', ' ', ' '
    ],
    moves: [],
    turn: 'X',
  };
  res.status(200).send('Reset')
});

app.listen(3000, function () {
  console.log('App started on port 3000');
});