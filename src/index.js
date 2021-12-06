import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render () {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }
function Square (props) {
  return (
    <button className={"square " + props.winnerCls} onClick={props.onClick}>
      {props.value}
      {/* {props.coord[0]},{props.coord[1]} */}
    </button>
  )
}

class Board extends React.Component {

  render () {
    return (
      [0, 3, 6].map((row, x) => {
        return (
          <div className="board-row" key={row}>
            {
              [0, 1, 2].map((col, y) => {
                const coord = { x, y };
                const id = row + col;
                const winnerId = this.props.winnerId;
                // console.log(winnerId);
                let winnerBg = '';
                if (winnerId && winnerId.includes(id)) {
                  winnerBg = "winnerBg"
                }
                return (
                  <Square value={this.props.squares[id]}
                    winnerCls={winnerBg}
                    onClick={() => this.props.onClick(id, coord)}
                    key={col}
                  />
                )
              })
            }
          </div>
        )
      })
      // .reverse()
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          coord: { x: null, y: null }
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      highlightCls: '',
      isAscOrder: true
    }
  }

  handleClick (i, coord) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).result || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        coord: coord
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      highlightCls: ''
    })
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      highlightCls: "highlightCls"
    })
  }

  handleSwitch () {
    this.setState({
      isAscOrder: !this.state.isAscOrder
    })
  }

  render () {
    const history = this.state.history;
    // console.log('history', history);
    const stepNumber = this.state.stepNumber;
    // console.log('stepNumber', stepNumber);
    const isAscOrder = this.state.isAscOrder;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);
    // console.log("winnerId", winner.result)

    // const showHistory = this.state.isAscOrder ? history : [...history].reverse();
    const moves = history.map((step, move) => {
      const stepNumber = this.state.stepNumber;
      const highlightCls = this.state.highlightCls;
      // console.log('move', move);
      const coord = step.coord;
      const desc = move ? `Go to move # ${move}, coordinate: (${coord.y + 1},${coord.x + 1})` : 'Go to game start';
      return (
        <li key={move}>
          <button className={move === stepNumber ? highlightCls : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    if (!isAscOrder) {
      moves.reverse()
    }

    let status;
    // let hasNull = current.squares.some(item => item === null ? true : false)
    // if (hasNull && winner.result) {
    //   status = 'Winner: ' + winner.who;
    // } else if (!hasNull) {
    //   status = "平局!"
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }
    if (winner.result) {
      status = 'Winner: ' + winner.who;
    } else if (!winner.result && stepNumber === 9) {
      status = "平局!"
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
            winnerId={winner.result}
            onClick={(i, coord) => { this.handleClick(i, coord) }}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="switchBtnCls" onClick={() => this.handleSwitch()}>切换为{isAscOrder ? "降序" : "升序"}</button>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner (squares) {
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
      return { result: [a, b, c], who: squares[a] };
      // return squares[a];
    }
  }
  return { result: null };
}