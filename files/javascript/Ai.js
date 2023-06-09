
//const lang = require("../lang.js")
//lang is defined globally since its imported as a script

var chosenLang = getLang() || "english"

var ximg = "https://i.postimg.cc/wjNHXJ0L/x-o-3.png";
var oimg = "https://i.postimg.cc/76kgHgQV/x-o-2.png";

var freshBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var corners = [0, 2, 6, 8];
var antiCorners = [1, 3, 5, 7];

let possibleWins = {
  0: [
    { position: 1, winner: 2 },
    { position: 3, winner: 6 },
    { position: 4, winner: 8 },
  ],
  1: [
    { position: 0, winner: 2 },
    { position: 2, winner: 0 },
    { position: 4, winner: 7 },
  ],
  2: [
    { position: 1, winner: 0 },
    { position: 4, winner: 6 },
    { position: 5, winner: 8 },
  ],
  3: [
    { position: 0, winner: 6 },
    { position: 6, winner: 0 },
    { position: 4, winner: 5 },
  ],
  4: [
    { position: 0, winner: 8 },
    { position: 1, winner: 7 },
    { position: 2, winner: 6 },
    { position: 3, winner: 5 },
    { position: 5, winner: 3 },
    { position: 6, winner: 2 },
    { position: 7, winner: 1 },
    { position: 8, winner: 0 },
  ],
  5: [
    { position: 2, winner: 8 },
    { position: 4, winner: 3 },
    { position: 8, winner: 2 },
  ],
  6: [
    { position: 3, winner: 0 },
    { position: 4, winner: 2 },
    { position: 7, winner: 8 },
  ],
  7: [
    { position: 4, winner: 1 },
    { position: 6, winner: 8 },
    { position: 8, winner: 6 },
  ],
  8: [
    { position: 4, winner: 0 },
    { position: 5, winner: 2 },
    { position: 7, winner: 6 },
  ],
};

//for each corner, it's opposite corner
let oppositeCorners = {
  0: 8,
  2: 6,
  8: 0,
  6: 2,
};

//for each anti corner, it's opposite anti corner
let oppositeAntiCorners = {
  1: 7,
  3: 5,
  7: 1,
  5: 3,
};

//for each corner, its 2 touching anti-corners
let cornerStats = {
  0: [1, 3],
  2: [1, 5],
  6: [3, 7],
  8: [5, 7],
};



var board;
newGame()

function devMode() {
  let dev = element(".dev")
  let changeTo = dev[0].style.display == "block" ? "none" : "block"
  for (i in dev) {
    try {
    dev[i].style.display = changeTo
    } catch {
      return;
    }
    
  }
} 

function isTwoInARowPlayer(board, uhhuhyes) {
  var result;
  var howMany = 0;
  for (var i in board) {
    let index = i;
    i = board[i];
    index = parseInt(index);
    if (i == "x") {
      possibleWins[index].forEach((s) => {
        if (board[s.position] == "x") {
          let winningSquare = checkSquare(board, s.winner);
          if (winningSquare) return;
          result = {
            isTrue: true,
            positions: [index, s.position],
            recommended: s.winner,
          };
          howMany = howMany + 1;
        }

        if (board[s.winner] == "x") {
          let winningSquare = checkSquare(board, s.position);
          if (winningSquare) return;
          result = {
            isTrue: true,
            positions: [index, s.winner],
            recommended: s.position,
          };
          howMany = howMany + 1;
        }
      });
    }
  }
  if (uhhuhyes) return howMany;
  return result;
}

function isTwoInARowAI(board, uhhuhyes = false) {
  var result;
  var howMany = 0;
  for (var i in board) {
    let index = i;
    i = board[i];
    index = parseInt(index);
    if (i == "o") {
      possibleWins[index].forEach((s) => {
        if (board[s.position] == "o") {
          let winningSquare = checkSquare(board, s.winner);
          if (winningSquare) return;
          result = {
            isTrue: true,
            positions: [index, s.position],
            recommended: s.winner,
          };
          howMany = howMany + 1;
        }

        if (board[s.winner] == "o") {
          let winningSquare = checkSquare(board, s.position);
          if (winningSquare) return;
          result = {
            isTrue: true,
            positions: [index, s.winner],
            recommended: s.position,
          };
          howMany = howMany + 1;
        }
      });
    }
  }
  if (uhhuhyes) return howMany;
  return result;
}

//Some traps that i learnt playing tic tac toe and im teaching the bot how to avoid them

function isItGivingCheck(board, position) {
  if (typeof position == "object") {
    return position.map((pos) => {
      let newBoard = [...board];
      newBoard[position] = "o";
      let howMany = isTwoInARowAI(newBoard);
      if (howMany >= 3) return true;
      else return false;
    });
  }

  let newBoard = [...board];
  newBoard[position] = "o";
  let howMany = isTwoInARowAI(newBoard);
  if (howMany >= 3) return true;
  else return false;
}

function findTrapsV2(board) {
  let result;
  let manyResults = [];
  for (let i in board) {
    if (typeof board[i] == "number") {
      let newBoard = [...board];
      newBoard[i] = "x";
      if (isTwoInARowPlayer(newBoard, true) > 3) {
        result = {
          isTrue: true,
          rcmnd: i,
        };
        manyResults.push(result);
      }
    }
  }
  let cornerResults = manyResults.filter((res) =>
    corners.includes(parseInt(res.rcmnd))
  );
  if (cornerResults.length > 0) return cornerResults[0];
  return result;
}

function findTraps(board) {
  if (board[4] == "o") {
    if (corners.filter((c) => board[c] == "x").length == 2) {
      if(checkAvailableAntiCorners(board).length < 1) return false;
      return {
        isTrue: true,
        rcmnd: randomArray(checkAvailableAntiCorners(board)),
      };
    } else if (antiCorners.filter((c) => board[c] == "x").length >= 2) {
      let themanticorners = antiCorners.filter((c) => board[c] == "x");
      if (antiCorners.filter((c) => board[c] == "x").length == 2) {
        if (oppositeAntiCorners[themanticorners[0]] == themanticorners[1]) {
          //in this case the bot completley won. reverse trap?
          //bot trap step 1: just the simple position, making sure every other square is null.
          let theRestOfTheBoard = freshBoard.filter(
            (e) => ![4, ...themanticorners].includes(e)
          );
          if (checkSquare(board, theRestOfTheBoard).every((e) => !e)) {
            return {
              isTrue: true,
              rcmnd: randomArray(checkAvailableAntiCorners(board)),
            };
          }
        }
      }
      if (oppositeAntiCorners[themanticorners[0]] !== themanticorners[1]) {
        let cornerinbetween;
        for (i in cornerStats) {
          if (
            cornerStats[i].includes(themanticorners[0]) &&
            cornerStats[i].includes(themanticorners[1])
          )
            cornerinbetween = i;
        }
        if (checkSquare(board, cornerinbetween)) return false;
        return {
          isTrue: true,
          rcmnd: cornerinbetween,
        };
      }
    }
  }
}

function makeTrap(board, uhhuhyes) {
  let result;
  let manyResults = [];
  for (let i in board) {
    if (typeof board[i] == "number") {
      let newBoard = [...board];
      newBoard[i] = "o";

      if (isTwoInARowAI(newBoard, true) > 3) {
        result = {
          isTrue: true,
          position: i,
        };
        manyResults.push(result);
      }
    }
  }
  if (uhhuhyes) return manyResults;
  return result;
}

function makeTrapV2(board) {
  let result;
  let goodTrap = [];
  for (let i in board) {
    if (!checkSquare(board, i)) {
      let newBoard = [...board];
      newBoard[i] = "o";
      let isCheck = isTwoInARowAI(newBoard);
      if (isCheck) {
        newBoard[isCheck.recommended] = "x";
        let isTrap = makeTrap(newBoard, true);
        let isInCheck = isTwoInARowPlayer(newBoard);
        if (isInCheck && isTrap.length > 0) {
          goodTrap = isTrap.filter(
            (trap) => trap.position == isInCheck.recommended
          );

          if (goodTrap.length > 0) {
            result = {
              isTrue: true,
              position: i,
              position2: goodTrap[0].position,
            };
            return result;
          }
        }
        if (isTrap.length > 0) {
          result = {
            isTrue: true,
            position: i,
            position2: (goodTrap?.length > 0 ? goodTrap[0] : isTrap[0])
              .position,
          };
        }
      }
    }
  }
  return result;
}

function makeTrapV3(board) {
  let result;
  for (i in board) {
    if (!checkSquare(board, i)) {
      let newBoard = [...board];
      newBoard[i] = "o";
      let isCheck = isTwoInARowAI(newBoard);
      if (isCheck) {
        newBoard[isCheck.recommended] = "x";
        let isReverseTrap = isTwoInARowPlayer(newBoard, true);

        if (isReverseTrap !== 6) {
          //making sure by putting there you cant get reverse trapped by ur opponent. yes that is possible

          let isReverseCheck = isTwoInARowPlayer(newBoard);
          if (isReverseCheck) {
            newBoard[isReverseCheck.recommended] = "o";
            let isItTrap = isTwoInARowAI(newBoard, true);
            if (isItTrap > 3) {
              result = {
                isTrue: true,
                position: i,
                position2: isReverseCheck.recommended,
              };
            }
          } else {
            let isItTrap = makeTrap(newBoard);
            if (isItTrap) {
              result = {
                isTrue: true,
                position: i,
                position2: isItTrap.position,
              };
            }
          }
        }
      }
    }
  }
  return result;
}

function isItFirstTurn(board) {
  if (board.every((s) => typeof s == "number")) return true;
  else return false;
}

function trapAttempt(board) {
  if (board[4] == "x") {
    let myCorners = corners.filter(corner => checkSquare(board, corner) == "o")
    if (myCorners.length == 1) {
      let theCorner = myCorners[0]
      let everythingElse = freshBoard.filter(square => ![4, theCorner].includes(square))
      if (everythingElse.every(square => !checkSquare(board, square))) {
        return {
          isTrue: true,
          position: oppositeCorners[theCorner]
        }
      }
    } 
  } else if(board[4] == "o") {
    let playerCorners = corners.filter(corner => checkSquare(board, corner) == "x")
   if(playerCorners.length == 1) {
      let theCorner = playerCorners[0]
      let everythingElse = freshBoard.filter(square => ![4, theCorner].includes(square))
      if (everythingElse.every(square => !checkSquare(board, square))) {
        return {
          isTrue: true,
          position: oppositeCorners[theCorner]
        }
      }
    }
  }
  return false;
}

function recommended(board) {
  let isTrap = findTraps(board);
  let isTrapV2 = findTrapsV2(board);
  let twoPlayer = isTwoInARowPlayer(board);
  let twoAI = isTwoInARowAI(board);
  let isMakeTrap = makeTrap(board);
  let isMakeTrapV2 = makeTrapV3(board);
  let firstTurn = isItFirstTurn(board);
  let trapAttemptt = trapAttempt(board);
  //let lonleyO = findLonleyO(board)
  let availableCorners = checkAvailableCorners(board);
  let availableAntiCorners = checkAvailableAntiCorners(board);
  let PlayerCorners = [...corners].filter((e) => checkSquare(board, e) == "x");
  let availableOppositeOfEnemyCorner = PlayerCorners.filter(
    (e) => !checkSquare(board, oppositeCorners[e])
  );
  //isTrap = findTraps(board);
  if (firstTurn) {
    console.log("first turn!");
    //return randomArray(corners);
    let corner = randomArray(corners);
    //return randomArray([corner, corner, corner, corner, 4])

    return corner
    //to make it less boring once in 5 games he will put in the middle - worse but more intresting i guess! 
    //deprecated i realized this is dumb since the bot putting in the corner is just losing 
    //maybe ill make like a medium (beatable) mode where he puts in middle in the future
  }
  if (twoAI) {
    console.log("----------checkmate----------");
    return twoAI.recommended;
  } if (twoPlayer) {
    console.log("block check");
    return twoPlayer.recommended;
  } else if (isMakeTrap) {
    console.log("making a trap - victory is near!");
    return isMakeTrap.position;
  } else if (isMakeTrapV2) {
    console.log("making a trap - victory is near!2");
    return isMakeTrapV2.position;
  } else if (!checkSquare(board, 4)) {
    console.log("If you can, put in middle");
    return 4;
  } else if (trapAttemptt) {
    console.log("trap attempt - it's either this or draw!");
    return trapAttemptt.position;
  } else if (isTrap) {
    console.log("defending from trap");
    return isTrap.rcmnd;
  } else if (isTrapV2) {
    console.log("defending from trap2");
    return isTrapV2.rcmnd;
  }
  /*else if(availableOppositeOfEnemyCorner.length > 0) {
      console.log("3")
      return oppositeCorners[availableOppositeOfEnemyCorner[0]]
    }*/
  /*else if(lonleyO) {
      console.log("lonley o")
      return lonleyO.recommended
    }*/
  if (board[4] == "o") {
    if (availableAntiCorners.length > 1) {
      console.log("if you have the middle and can put in anti corner");
      return randomArray(availableAntiCorners);
    } else if (availableCorners.length > 1) {
      console.log("if you have middle and can put in corner");
      return randomArray(availableCorners);
    }
  } else if (board[4] == "x") {
    if (availableCorners.length > 1) {
      console.log("if you dont have middle can put in corner");
      return randomArray(availableCorners);
    } else if (availableAntiCorners.length > 1) {
      console.log("if you dont have middle can put in  anti corner");
      return randomArray(availableAntiCorners);
    }
  }
  console.log("random");
  return randomArray(checkAvailable(board));
}

function randomArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function checkSquare(board, square) {
  if (typeof square == "object") {
    //assuming square is an array
    return square.map((i) => (typeof board[i] == "number" ? null : board[i]));
  }
  if (typeof board[square] == "number") return;
  return board[square];
}

function checkAvailable(board) {
  let available = board.filter((square) => typeof square == "number");
  return available;
}

function findLonleyO(board) {
  let rcmnd;

  abc = (el) => {
    i = board.indexOf(el);
    square = board[i];
    if (square == "o") {
      possibleWins[i].forEach((obj) => {
        let winnerSquare = checkSquare(board, obj.winner);
        let possibleSquare = checkSquare(board, obj.position);
        console.log(obj.winner, winnerSquare, obj.position, possibleSquare);
        if (!possibleSquare && !winnerSquare) {
          if (corners.includes(obj.position)) rcmnd = obj.position;
          if (corners.includes(obj.winner)) rcmnd = obj.winner;
          if (antiCorners.includes(obj.position)) rcmnd = obj.position;
          if (antiCorners.includes(obj.winner)) rcmnd = obj.winner;
        }
      });
    }
  };
  board.forEach(abc);
  if (!rcmnd) return false;
  return {
    isTrue: true,
    position: i,
    recommended: rcmnd,
  };
}

function isWin(board) {
  var result;
  for (let i in board) {
    let square = board[i];
    let possibles = possibleWins[i];
    possibles.forEach((possible) => {
      if (
        square == board[possible.position] &&
        square == board[possible.winner]
      ) {
        result = {
          isTrue: true,
          winner: square,
          positions: [parseInt(i), possible.position, possible.winner],
        };

        result.positions.forEach((position) => {
          element(`#${translate(position)}`).classList.add("black")
        });

        element("h2")[0].innerText =
          result.winner == "o" ? lang.winner.computer[chosenLang] : function(){console.log("----------game over - I lost - How??----------"); return lang.winner.you[chosenLang]}();
          element(".playagain")[0].style.display = "block";
          element(".playagain")[1].style.display = "block";
        return;
      }
    });
  }
  if (
    checkAvailable(board).length < 1 &&
    element(".playagain")[0].style.display !== "block"
  ) {
    //is draw
    console.log("----------game over - draw----------")
    result = {
      isWin: false,
      winner: "draw",
    };

    element("h2")[0].style.display = "block";
    element("h2")[0].innerText = lang.winner.draw[chosenLang];
    element(".playagain")[0].style.display = "block";
    element(".playagain")[1].style.display = "block";
  }
  return result;
}

function checkAvailableCorners(board) {
  let available = checkAvailable(board);
  return corners.filter((e) => available.includes(e));
}

function checkAvailableAntiCorners(board) {
  let available = checkAvailable(board);
  return antiCorners.filter((e) => available.includes(e));
}




function newBoard() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

function searchObject(obj, searchValue) {
  let result;
  for (let i in obj) {
    if (typeof obj[i] === "object") {
      result = searchObject(obj[i], searchValue);
      if (result) {
        return result;
      }
    } else if (obj[i] === searchValue) {
      return obj;
    }
  }
  return result;
}

var oppositeLang = {
  english : "hebrew",
  hebrew : "english"
}

function reloadTitles(newLang = oppositeLang[chosenLang]) {
  chosenLang = newLang
  element("#main").innerText = lang.main[chosenLang] //main tictactoe title
    element("#title").innerText = lang.main[chosenLang] 
  element("#back").innerText = lang.back[chosenLang] 
  element("#buttons.you").innerText = lang.buttons.you[chosenLang]
  element("#buttons.computer").innerText = lang.buttons.computer[chosenLang]
  let helperTxt = element("#helper").innerText
  if(helperTxt) {
    let entry = searchObject(lang, helperTxt)
    element("#helper").innerText = entry[chosenLang]
  }

  setLang(newLang)

}

function newGame(newLang) {
  if(newLang) chosenLang = newLang //to switch lang
  reloadTitles(chosenLang)
  board = newBoard();
  element(".playagain")[0].style.display = "none";
  element(".playagain")[1].style.display = "none";
  let squares = element("td");
  for (let i in squares) {
    let square = squares[i];
    square.innerHTML = "";
    square = element(`#${translate(i)}`)
    if (square) {
      if (square.classList.contains("black"))
        square.classList.remove("black")
    }
  }

  botTurn(board);
}

//for messing with stuf on console
function removeSquare(board, index) {
  element(`#${translate(index)}`).innerHTML = ""
  board[index] = index
}

function setSquare(board, index, whatToSet = index) {
  if(checkSquare(board, index)) removeSquare(board, index)
  board[index] = whatToSet
  setVisualSquare(index, whatToSet)
}

function setVisualSquare(index, whatToSet = index) {
  if(!["x", "o"].includes(whatToSet)) return element(`#${translate(index)}`).innerHTML = "";
  let img = whatToSet == "x" ? ximg : oimg 
  element(`#${translate(index)}`).innerHTML = `<img src="${img}">`;
}

function importBoard(board, newBoard, turn, timeOut) {
for (i in newBoard) {
  setSquare(board, i, newBoard[i])
}

let squares = element("td")

for (let i in squares) {
  let square = squares[i];
  square = element(`#${translate(i)}`)
  if (square) {
    if (square.classList.contains("black"))
      square.classList.remove("black")
  }
}

  if(timeOut) {
    return setTimeout(() => {
      turn == "x" ? yourTurn(newBoard) : botTurn(newBoard)
    }, timeOut)
  }
  turn == "x" ? yourTurn(newBoard) : botTurn(newBoard)
}

function freePlayMode(board) {
   element("h2")[0].innerText == lang.turn.you[chosenLang] ? freePlayXTurn(board) : freePlayOTurn(board)
}

function exitFreePlayMode(board) {
  element("h2")[0].innerText == lang.turn.o[chosenLang] ? botTurn(board) : yourTurn(board)
}

function freePlayOTurn(board) {
  let squares = element("td");
  element("h2")[0].innerText = lang.turn.o[chosenLang];
  for (let i in squares) {
    let square = element(`#${translate(i)}`);
    if (!square) return;
    square.onclick = function() {
      if (checkSquare(board, i)) return;
      let index = reverseTranslate(square.id);
      placeCircle(board, index);
      disableClicks();
      if (isWin(board)) return;
      freePlayXTurn(board);
    };
  }
}

function freePlayXTurn(board) {
  let squares = element("td");
  element("h2")[0].innerText = lang.turn.x[chosenLang];
  for (let i in squares) {
    let square = element(`#${translate(i)}`);
    if (!square) return;
    square.onclick = function() {
      if (checkSquare(board, i)) return;
      let index = reverseTranslate(square.id);
      placeX(board, index);
      disableClicks();
      if (isWin(board)) return;
      freePlayOTurn(board);
    };
  }
}

function yourTurn(board) {
  let squares = element("td");
  element("h2")[0].innerText = lang.turn.you[chosenLang];
  for (let i in squares) {
    let square = element(`#${translate(i)}`);
    if (!square) return;
    square.onclick = function() {
      if (checkSquare(board, i)) return;
      let index = reverseTranslate(square.id);
      placeX(board, index);
      disableClicks();
      if (isWin(board)) return;
      botTurn(board);
    };
  }
}

function disableClicks() {
  let squares = element("td");
  for (let i in squares) {
    let square = element(`#${translate(i)}`);
    if (!square) return;
    square.onclick = null;
  }
}

function botTurn(board) {
  let whereToPlace = recommended(board);
  element("h2")[0].innerText = lang.turn.computer[chosenLang];
  setTimeout(function() {
    placeCircle(board, whereToPlace);
    if (isWin(board)) return;
    yourTurn(board);
    return;
  }, 700);
}

function placeCircle(board, position) {
  board[position] = "o";
  $(`#${translate(position)}`).append(`<img src="${oimg}">`);
}

function placeX(board, position) {
  board[position] = "x";
  $(`#${translate(position)}`).append(`<img src="${ximg}">`);
}

