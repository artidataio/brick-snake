import * as _ from "lodash";
import { useState, useEffect } from "react";
import "./App.css";

const brickSize = 20;

const arena = Array(10)
  .fill(undefined)
  .map((_v, i) =>
    Array(20)
      .fill(undefined)
      .map((_v, j) => [i, j])
  )
  .flat();

const initSnake = [
  [4, 19],
  [3, 19],
  [2, 19],
];

const initBlock = {
  1: [],
  2: [
    [2, 2],
    [2, 3],
    [2, 16],
    [2, 17],
    [3, 2],
    [3, 17],
    [4, 9],
    [4, 10],
    [5, 9],
    [5, 10],
    [6, 2],
    [6, 17],
    [7, 2],
    [7, 3],
    [7, 16],
    [7, 17],
  ],
  3: [
    [0, 9],
    [0, 10],
    [1, 9],
    [1, 10],
    [4, 2],
    [4, 3],
    [4, 16],
    [4, 17],
    [5, 2],
    [5, 3],
    [5, 16],
    [5, 17],
    [8, 9],
    [8, 10],
    [9, 9],
    [9, 10],
  ],
  4: [
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2],
    [3, 7],
    [4, 7],
    [5, 7],
    [6, 7],
    [7, 7],
    [8, 7],
    [9, 7],
    [0, 12],
    [1, 12],
    [2, 12],
    [3, 12],
    [4, 12],
    [5, 12],
    [6, 12],
    [3, 17],
    [4, 17],
    [5, 17],
    [6, 17],
    [7, 17],
    [8, 17],
    [9, 17],
  ],
  5: [
    [0, 0],
    [0, 1],
    [0, 4],
    [0, 15],
    [0, 18],
    [0, 19],
    [1, 4],
    [1, 15],
    [2, 7],
    [2, 12],
    [3, 8],
    [3, 11],
    [4, 9],
    [4, 10],
    [5, 9],
    [5, 10],
    [6, 8],
    [6, 11],
    [7, 7],
    [7, 12],
    [8, 4],
    [8, 15],
    [9, 0],
    [9, 1],
    [9, 4],
    [9, 15],
    [9, 18],
    [9, 19],
  ],
  6: [
    [0, 2],
    [0, 3],
    [0, 8],
    [0, 9],
    [0, 10],
    [0, 11],
    [0, 16],
    [0, 17],
    [1, 2],
    [1, 3],
    [1, 9],
    [1, 10],
    [1, 16],
    [1, 17],
    [4, 2],
    [4, 3],
    [4, 6],
    [4, 9],
    [4, 10],
    [4, 13],
    [4, 16],
    [4, 17],
    [5, 2],
    [5, 3],
    [5, 6],
    [5, 9],
    [5, 10],
    [5, 13],
    [5, 16],
    [5, 17],
    [8, 2],
    [8, 3],
    [8, 9],
    [8, 10],
    [8, 16],
    [8, 17],
    [9, 2],
    [9, 3],
    [9, 8],
    [9, 9],
    [9, 10],
    [9, 11],
    [9, 16],
    [9, 17],
  ],
  7: [
    [0, 6],
    [0, 7],
    [0, 12],
    [0, 13],
    [1, 2],
    [1, 6],
    [1, 13],
    [1, 17],
    [2, 1],
    [2, 2],
    [2, 17],
    [2, 18],
    [3, 4],
    [3, 5],
    [3, 9],
    [3, 10],
    [3, 14],
    [3, 15],
    [4, 4],
    [4, 5],
    [4, 8],
    [4, 9],
    [4, 10],
    [4, 11],
    [4, 14],
    [4, 15],
    [5, 4],
    [5, 5],
    [5, 8],
    [5, 9],
    [5, 10],
    [5, 11],
    [5, 14],
    [5, 15],
    [6, 4],
    [6, 5],
    [6, 9],
    [6, 10],
    [6, 14],
    [6, 15],
    [7, 1],
    [7, 2],
    [7, 17],
    [7, 18],
    [8, 2],
    [8, 6],
    [8, 13],
    [8, 17],
    [9, 6],
    [9, 7],
    [9, 12],
    [9, 13],
  ],
  8: [
    [0, 2],
    [0, 17],
    [1, 2],
    [1, 4],
    [1, 7],
    [1, 12],
    [1, 15],
    [1, 17],
    [2, 4],
    [2, 8],
    [2, 9],
    [2, 10],
    [2, 11],
    [2, 15],
    [3, 2],
    [3, 4],
    [3, 8],
    [3, 11],
    [3, 15],
    [3, 17],
    [4, 1],
    [4, 2],
    [4, 6],
    [4, 13],
    [4, 17],
    [4, 18],
    [5, 1],
    [5, 2],
    [5, 6],
    [5, 13],
    [5, 17],
    [5, 18],
    [6, 2],
    [6, 4],
    [6, 8],
    [6, 11],
    [6, 15],
    [6, 17],
    [7, 4],
    [7, 8],
    [7, 9],
    [7, 10],
    [7, 11],
    [7, 15],
    [8, 2],
    [8, 4],
    [8, 7],
    [8, 12],
    [8, 15],
    [8, 17],
    [9, 2],
    [9, 17],
  ],
};

function Brick(props: { type: string }) {
  let color: string;
  switch (props.type) {
    case "apple":
      color = "red";
      break;
    case "block":
      color = "brown";
      break;
    case "head":
      color = "green";
      break;
    default:
      color = "limegreen";
  }

  return (
    <g>
      {props.type === "apple" && (
        <animate
          attributeType="XML"
          attributeName="opacity"
          values="1;0"
          dur="1s"
          repeatCount="indefinite"
        />
      )}
      <rect x="2.5" y="2.5" width="15" height="15" fill={color} />
      <rect
        x="0.25"
        y="0.25"
        width="19.5"
        height="19.5"
        fill="none"
        stroke={color}
        strokeWidth="0.5"
        rx="2.5"
        ry="2.5"
      />
    </g>
  );
}

function getRandDiffElem(arr1: number[][], arr2: number[][]) {
  let empty = _.differenceWith(arr1, arr2, _.isEqual);
  return empty[Math.floor(Math.random() * empty.length)];
}

function App() {
  const [phase, setPhase] = useState("reset");
  const [level, setLevel] = useState(1);
  const [block, setBlock] = useState(initBlock[1]);

  const [life, setLife] = useState(4);
  const [snake, setSnake] = useState(initSnake);

  const [apple, setApple] = useState(initSnake[0]); //WARNING: hackish hiding the apple re-update when the game initialize
  const [numApple, setNumApple] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [direction, setDirection] = useState("E");
  const [keyFlag, setKeyFlag] = useState(true); //ensure direction change only happen once per frame

  useEffect(() => {
    let frame: NodeJS.Timer;
    if (phase === "move") {
      frame = setInterval(() => {
        let newHead = _.head(_.cloneDeep(snake));
        switch (direction) {
          case "N":
            newHead[1] -= 1;
            break;
          case "E":
            newHead[0] += 1;
            break;
          case "S":
            newHead[1] += 1;
            break;
          case "W":
            newHead[0] -= 1;
            break;
        }

        if (
          _.findIndex(
            _.differenceWith(
              arena,
              _.concat(_.dropRight(snake), block),
              _.isEqual
            ),
            (e: string[][]) => _.isEqual(e, newHead)
          ) < 0
        ) {
          if (life === 1) {
            setLife(life - 1);
            setPhase("dead");
            if (score > highScore) {
              setHighScore(score);
            }
          } else {
            setLife(life - 1);
            setPhase("reset");
          }
        } else if (_.isEqual(newHead, apple)) {
          setScore(score + 100);
          setSnake(_.concat([newHead], snake));
          if (numApple === 21) {
            setNumApple(numApple + 1);
            setLevel(level + 1);
          } else {
            setApple(getRandDiffElem(arena, _.concat(snake, block, [apple])));
            setNumApple(numApple + 1);
          }
        } else {
          // when the newhead place on top of empty brick
          setSnake(_.concat([newHead], _.dropRight(snake)));
        }
        setKeyFlag(true);
      }, 200); //minimal time in between movement frames
    }
    return () => clearInterval(frame);
  });

  // updating on every level change
  useEffect(() => {
    setPhase("reset");
  }, [level]);

  // updating on evey phase change
  useEffect(() => {
    if (phase === "reset") {
      setTimeout(() => {
        setSnake(initSnake);
        setBlock(initBlock[level]);
        setApple(getRandDiffElem(arena, _.concat(initSnake, initBlock[level])));
        setNumApple(0);
        setDirection("E");
      }, 1000);
    }
  }, [phase]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  // manipulating direction based on key stroke
  const handleKeyDown = (event: { key: string }) => {
    if (keyFlag) {
      let newDirection = direction;
      switch (event.key) {
        case "w":
          if (direction !== "S") newDirection = "N";
          break;
        case "d":
          if (direction !== "W") newDirection = "E";
          break;
        case "s":
          if (direction !== "N") newDirection = "S";
          break;
        case "a":
          if (direction !== "E") newDirection = "W";
          break;
      }
      if (newDirection !== direction) {
        setDirection(newDirection);
        setKeyFlag(false);
      }
    }
  };

  const handleN = () => {
    if (keyFlag) {
      if (_.indexOf(["N", "S"], direction) < 0) {
        setDirection("N");
        setKeyFlag(false);
      }
    }
  };

  const handleS = () => {
    if (keyFlag) {
      if (_.indexOf(["S", "N"], direction) < 0) {
        setDirection("S");
        setKeyFlag(false);
      }
    }
  };

  const handleW = () => {
    if (keyFlag) {
      if (_.indexOf(["W", "E"], direction) < 0) {
        setDirection("W");
        setKeyFlag(false);
      }
    }
  };

  const handleE = () => {
    if (keyFlag) {
      if (_.indexOf(["E", "W"], direction) < 0) {
        setDirection("E");
        setKeyFlag(false);
      }
    }
  };

  const handleMain = () => {
    if (phase === "reset") {
      setTimeout(() => {
        setPhase("move");
      }, 1000);
    } else if (phase === "dead") {
      //pressing main button when dead
      setTimeout(() => {
        setScore(0);
        setLife(4);
      }, 1000);
      if (level === 1) {
        //because resetting back to level 1 doesn't change the level
        setLevel(1);
        setPhase("reset");
      } else {
        setLevel(1);
      }
    }
  };

  return (
    <div className="App">
      <svg width="375" height="660">
        <rect width="100%" height="100%" fill="tomato" stroke="black" />
        <g transform="translate(40,40)">
          <rect
            x="2.5"
            y="2.5"
            width="205"
            height="405"
            fill="lightcyan"
            stroke="brown"
            strokeWidth="5"
          />
          <g transform="translate(5,5)">
            {block.map((v) => {
              return (
                <g
                  key={`${v[0]}, ${v[1]}`}
                  transform={`translate(${v[0] * brickSize},${
                    v[1] * brickSize
                  }) scale(${brickSize / 20})`}
                >
                  <Brick type="block" />
                </g>
              );
            })}
            <g
              transform={`translate(${apple[0] * brickSize},${
                apple[1] * brickSize
              }) scale(${brickSize / 20})`}
            >
              <Brick type="apple" />
            </g>
            {snake.map((v, i) => {
              return (
                <g
                  key={`${v[0]}, ${v[1]}`}
                  transform={`translate(${v[0] * brickSize},${
                    v[1] * brickSize
                  }) scale(${brickSize / 20})`}
                >
                  <Brick type={i === 0 ? "head" : "body"} />
                </g>
              );
            })}
          </g>
          <g transform="translate(207.5,2.5)" textAnchor="middle">
            <rect
              width="80"
              height="210"
              stroke="brown"
              strokeWidth="5"
              fill="lightcyan"
            />
            <text x="40" y="20">
              SCORE
            </text>
            <text x="40" y="40">
              {score}
            </text>
            <text x="40" y="60">
              HI-SCORE
            </text>
            <text x="40" y="80">
              {highScore}
            </text>
            <text x="40" y="100">
              GOAL
            </text>
            <text x="40" y="120">
              {numApple}/22
            </text>
            <text x="40" y="140">
              LIFE
            </text>
            <text x="40" y="160">
              {life}
            </text>
            <text x="40" y="180">
              LEVEL
            </text>
            <text x="40" y="200">
              {level}/8
            </text>
          </g>
          <rect
            x="210"
            y="365"
            width="85"
            height="40"
            fill="#f00"
            onClick={handleMain}
          />
        </g>

        <defs>
          <radialGradient id="myGradient">
            <stop offset="0%" stop-color="white" />
            <stop offset="100%" stop-color="yellow" />
          </radialGradient>
        </defs>
        <g transform="translate(40,450)">
          <rect width="210" height="210" fill="none" stroke="none" />
          <circle
            className="motion"
            cx="105"
            cy="45"
            r="35"
            fill="url(#myGradient)"
            onTouchStart={handleN}
          />
          <circle
            cx="105"
            cy="165"
            r="35"
            fill="yellow"
            onTouchStart={handleS}
          />
          <circle
            cx="45"
            cy="105"
            r="35"
            fill="yellow"
            onTouchStart={handleW}
          />
          <circle
            cx="165"
            cy="105"
            r="35"
            fill="yellow"
            onTouchStart={handleE}
          />
        </g>
      </svg>
    </div>
  );
}

export default App;
