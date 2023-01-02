import * as _ from "lodash";
import { useState, useEffect } from "react";
import { initBlock, initSnake } from "./data";
import Brick from "./Brick";
import "./App.css";

const brickSize = 20;

const arena: [number, number][] = Array(10)
  .fill(undefined)
  .map((_v, i) =>
    Array(20)
      .fill(undefined)
      .map((_v, j) => [i, j] as [number, number])
  )
  .flat();

function getRandDiffElem(arr1: [number, number][], arr2: [number, number][]) {
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
    let frame: ReturnType<typeof setInterval>;

    if (phase === "move") {
      frame = setInterval(() => {
        let newHead: [number, number] = _.head(_.cloneDeep(snake)) ?? [0, 0];
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
          default:
            break;
        }

        if (
          _.findIndex(
            _.differenceWith(
              arena,
              _.concat(_.dropRight(snake), block),
              _.isEqual
            ),
            (e) => _.isEqual(e, newHead)
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
  }, [phase, level]);

  // manipulating direction based on key stroke
  const handleKeyDown = (event: KeyboardEvent) => {
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
        default:
          break;
      }
      if (newDirection !== direction) {
        setDirection(newDirection);
        setKeyFlag(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

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
            fill="yellow"
            onTouchStart={handleN}
          />
          <text
            x="105"
            y="45"
            fill="black"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            W
          </text>
          <circle
            cx="105"
            cy="165"
            r="35"
            fill="yellow"
            onTouchStart={handleS}
          />
          <text
            x="105"
            y="165"
            fill="black"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            S
          </text>
          <circle
            cx="45"
            cy="105"
            r="35"
            fill="yellow"
            onTouchStart={handleW}
          />
          <text
            x="45"
            y="105"
            fill="black"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            A
          </text>
          <circle
            cx="165"
            cy="105"
            r="35"
            fill="yellow"
            onTouchStart={handleE}
          />
          <text
            x="165"
            y="105"
            fill="black"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            D
          </text>
        </g>
      </svg>
    </div>
  );
}

export default App;
