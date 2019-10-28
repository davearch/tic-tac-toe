import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * Square Component
 */
const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/**
 * Board Component
 */
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  renderBoard() {
    const boardRows = [...Array(3).keys()]
    const squareValueGenerator = generateSquareValues();
    return (
      <div>
        {
          boardRows.map((value) => {
            return (
              <div key={value} className="board-row">
                {this.renderSquare(squareValueGenerator.next().value)}
                {this.renderSquare(squareValueGenerator.next().value)}
                {this.renderSquare(squareValueGenerator.next().value)}
              </div>
            );
          })
        }
      </div>
    );
  }
  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

/**
 * Game Component
 */
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        pos: Array(2).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      isInAscendingOrder: true,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const pos = getPosition(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        pos: pos,
      }]),
      stepNumber: history.length,
      xIsNext : !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  toggleOrder() {
    this.setState({
      isInAscendingOrder: !this.state.isInAscendingOrder,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const isInAscendingOrder = this.state.isInAscendingOrder;

    const historyReversed = this.state.history.slice().reverse();

    const orderedHistory = isInAscendingOrder ? history : historyReversed;

    // step = object value
    // move = index
    const moves = orderedHistory.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + step.pos + ')' :
        'Go to game start';
      const getStyle = () => {
        if (step === current) {
          return { fontWeight: 'bold' }
        }
      }
      return (
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)}
            style={getStyle()}
          >
            {desc}
          </button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.toggleOrder()}>Toggle Order</button>
          <p>Ascending order: {this.state.isInAscendingOrder.toString()}</p>
        </div>
      </div>
    );
  }
}

/**
 * Utility Functions
 */
function* generateSquareValues(){
  yield* generateSequence(0,9);
}

function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}

function getPosition(pos) {
  // 2D Matrix
  const square = [
    [0,1,2],
    [3,4,5],
    [6,7,8]
  ];
  for (var i = 0; i < square.length; i++) {
    var index = square[i].indexOf(pos);
    if (index > -1) {
      return [index, i];
    }
  }
  // if not found return 0
  return 0;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));