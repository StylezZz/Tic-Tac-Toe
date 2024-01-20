import { useState } from 'react';
import './App.css'
import confetti from 'canvas-confetti';
const TURNS = {
  X: '❌',
  O: '⚪'
};

const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`;
  const handleClick = () => {
    updateBoard(index);
  }
  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  )
}

const WINNER_COMBOS = [
  [0, 1, 2], // horizontal
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // vertical
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonal
  [2, 4, 6]
]

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board');
    if (boardFromStorage) {
      return JSON.parse(boardFromStorage);
    } else {
      return Array(9).fill(null);
    }
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn');
    return turnFromStorage ?? TURNS.X;
  });

  const [chosenStartingPlayer, setChosenStartingPlayer] = useState(false);

  const [winner, setWinner] = useState(null);

  const chechWinner = (boardToCheck) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setTurn(TURNS.X);
    // Permitir la elección del jugador inicial nuevamente al reiniciar el juego
    setChosenStartingPlayer(false);
  };

  const chooseStartingPlayer = (selectedTurn) => {
    setTurn(selectedTurn);
    setChosenStartingPlayer(true);
  };

  const updateBoard = (index) => {
    if (board[index] !== null) return;
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    window.localStorage.setItem('board', JSON.stringify(newBoard));
    window.localStorage.setItem('turn', newTurn);
    const winner = chechWinner(newBoard);
    if (winner) {
      confetti();
      setWinner(winner);
    } else if (!newBoard.includes(null)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reiniciar Juego</button>
      {!chosenStartingPlayer && (
        <section className="choose-turn">
          <h2>Elige quién comienza:</h2>
          <button onClick={() => chooseStartingPlayer(TURNS.X)}>X</button>
          <button onClick={() => chooseStartingPlayer(TURNS.O)}>O</button>
        </section>
      )}
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <section>
        {winner !== null && (
          <section className="winner">
            <div className="text">
              <h2>{winner === false ? 'Empate' : `Ganador: ${winner}`}</h2>
              <header className="win">{winner && <Square>{winner}</Square>}</header>
              <footer>
                <button onClick={resetGame}>Reiniciar</button>
              </footer>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;