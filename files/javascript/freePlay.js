//const lang = require("../lang.js")
//lang is defined globally since its imported as a script

var chosenLang = getLang() || "english"

var oppositeLang = {
  english : "hebrew",
  hebrew : "english"
}

let corners = [0, 2, 6, 8]

let possibleWins = {
  0: [{ position: 1, winner: 2 }, { position: 3, winner: 6 }, { position: 4, winner: 8 }],
  1: [{ position: 0, winner: 2 }, { position: 2, winner: 0 }, { position: 4, winner: 7 }],
  2: [{ position: 1, winner: 0 }, { position: 4, winner: 6 }, { position: 5, winner: 8 }],
  3: [{ position: 0, winner: 6 }, { position: 6, winner: 0 }, { position: 4, winner: 5 }],
  4: [{ position: 0, winner: 8 }, { position: 1, winner: 7 }, { position: 2, winner: 6 }, { position: 3, winner: 5 }, { position: 5, winner: 3 }, { position: 6, winner: 2 }, { position: 7, winner: 1 }, { position: 8, winner: 0 }],
  5: [{ position: 2, winner: 8 }, { position: 4, winner: 3 }, { position: 8, winner: 2 }],
  6: [{ position: 3, winner: 0 }, { position: 4, winner: 2 }, { position: 7, winner: 8 }],
  7: [{ position: 4, winner: 1 }, { position: 6, winner: 8 }, { position: 8, winner: 6 }],
  8: [{ position: 4, winner: 0 }, { position: 5, winner: 2 }, { position: 7, winner: 6 }]
}

let oppositeCorners = {
  0: 8,
  2: 6,
  8: 0,
  6: 2
}

var board = newGame()


function checkSquare(board, square) {
  if (typeof board[square] == "number") return;
  return board[square]
}

function checkAvailable(board) {
  let available = board.filter(square => typeof square == "number")
  return available
}

function isWin(board) {
  var result;
  for (let i in board) {
    let square = board[i]
    let possibles = possibleWins[i]
    possibles.forEach(possible => {
      if (square == board[possible.position] && square == board[possible.winner]) {

        result = {
          isTrue: true,
          winner: square,
          positions: [parseInt(i), possible.position, possible.winner]
        }

        result.positions.forEach(position => {
          element(`#${translate(position)}`).classList.add("black")
        })

        element("h2")[0].innerText = result.winner == "o" ? lang.winner.o[chosenLang] : lang.winner.x[chosenLang]
        element("#playagain").style.display = "block"
        console.log("victory")
        return;

      }
    })

  }
  if (checkAvailable(board).length < 1 && element("#playagain").style.display !== "block") {
    //is draw
    result = {
      isWin: false,
      winner: "draw"
    }

    element("h2")[0].style.display = "block"
    element("h2")[0].innerText = lang.winner.draw[chosenLang]
    element("#playagain").style.display = "block"

  }
  return result
}

function element(query = "") {
  if (query.startsWith("#")) {
    return document.getElementById(query.split("#")[1])
  }
  if (query.startsWith(".")) {
    return document.getElementsByClassName(query.split(".")[1])
  } else {
    return document.getElementsByTagName(query)
  }
}

function translate(number = 1) {
  number = number.toString()
  switch (number) {
    case "0": return "zero"; break;
    case "1": return "one"; break;
    case "2": return "two"; break;
    case "3": return "three"; break;
    case "4": return "four"; break;
    case "5": return "five"; break;
    case "6": return "six"; break;
    case "7": return "seven"; break;
    case "8": return "eight"; break;
  }
}

function reverseTranslate(number = "") {
  number = number.toString()
  switch (number) {
    case "zero": return "0"; break;
    case "one": return "1"; break;
    case "two": return "2"; break;
    case "three": return "3"; break;
    case "four": return "4"; break;
    case "five": return "5"; break;
    case "six": return "6"; break;
    case "seven": return "7"; break;
    case "eight": return "8"; break;
  }
}

function newBoard() {
  return [
    0, 1, 2,
    3, 4, 5,
    6, 7, 8
  ]

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
  element("#back").innerText = lang.back[chosenLang] 
  element("#playagain").innerText = lang.playagain[chosenLang] 
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
  board = newBoard()
  element("#playagain").style.display = "none"
  let squares = element("td")
  for (let i in squares) {
    let square = squares[i]
    square.innerHTML = ""
    square = element(`#${translate(i)}`)
    if (square) {
      if (square.classList.contains("black"))
        square.classList.remove("black")
    }
  }

  yourTurn(board)

}

function yourTurn(board) {
  let squares = element("td")
  element("h2")[0].innerText = lang.turn.x[chosenLang]
  for (let i in squares) {
    let square = element(`#${translate(i)}`)
    if (!square) return
    square.onclick = function() {
      if (checkSquare(board, i)) return;
      let index = reverseTranslate(square.id)
      placeX(board, index)
      disableClicks()
      if (isWin(board)) return;
      botTurn(board)
    }
  }
}

function disableClicks() {
  let squares = element("td")
  for (let i in squares) {
    let square = element(`#${translate(i)}`)
    if (!square) return
    square.onclick = null
  }
}

function botTurn(board) {
  let squares = element("td")
  element("h2")[0].innerText = lang.turn.o[chosenLang]
  for (let i in squares) {
    let square = element(`#${translate(i)}`)
    if (!square) return
    square.onclick = function() {
      if (checkSquare(board, i)) return;
      let index = reverseTranslate(square.id)
      placeO(board, index)
      disableClicks()
      if (isWin(board)) return;
      yourTurn(board)
    }
  }
}

function placeO(board, position) {
  board[position] = "o"
  $(`#${translate(position)}`).append(`<img src="${oimg}">`)
}

function placeX(board, position) {
  board[position] = "x"
  $(`#${translate(position)}`).append(`<img src="${ximg}">`)
}



var ximg = "https://i.postimg.cc/wjNHXJ0L/x-o-3.png"
var oimg = "https://i.postimg.cc/76kgHgQV/x-o-2.png"

