import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {

    return (
        <button className="square" onClick={props.onClick} style={props.winner} >
      {props.value} 
    </button>
    );
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
            return [squares[a], lines[i]];
        }
    }
    return null;
}

class Board extends React.Component {

    renderSquare(i, x, y) {
        const winner = this.props.winner.includes(i)
        const style_bold = {
            border: winner ? 'solid green 3px ' : '1px solid #999'
        }
        return <Square key={i} value={this.props.squares[i]}
     winner={style_bold}
     onClick={() => this.props.onClick(i,x,y)} />;
    }


    render() {
        return (
            <div>
      {[0,3,6].map((x,i)=> 
        <div key={x} className="board-row">
         {[0,1,2].map((y,j)=> 
          this.renderSquare(x+y,i,j)
          )}
        </div>
        )}
      </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coordinates: [1, 1]
            }],
            xIsNext: true,
            stepNumber: 0

        };
    }

    handleClick(i, x, y) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                coordinates: [x+1, y+1]
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext

        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + '(' + step.coordinates[0] + ' , ' + step.coordinates[1] + ')' :
                'Go to game start' ;

            const bold_style = {
                fontWeight: (move === this.state.stepNumber) ? 'bold' : '100'
            }
            return (
                <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={ bold_style } >{desc}</button>
        </li>
            );
        });


        let status;
        let win_arr = []
        if (winner) {
            status = 'Winner: ' + winner[0];
            win_arr = winner[1]
        } else if (this.state.stepNumber === 9) {
            status = "It's a DRAW"

        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }


        return (
            <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          winner={win_arr}
          onClick={(i,x,y) => this.handleClick(i,x,y)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);