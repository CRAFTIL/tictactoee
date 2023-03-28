const express = require("express")

const fs = require("node:fs")

const app = express()

app.use(express.json());

app.use(express.static(__dirname + '/files'))


app.listen(5000, () => {
  console.log("app is on")
})


app.get("/", (req, res) => {
  let a = fs.readFileSync("./index.html")
  res.write(a)
  res.end()
})

app.get("/ai1", (req, res) => {
  let a = fs.readFileSync("./files/html/Player.html") // Player - player starts (against computer)
  res.write(a)
  res.end()
})
app.get("/ai2", (req, res) => {
  let a = fs.readFileSync("./files/html/Ai.html") // Ai - computer starts (against player)
  res.write(a)
  res.end()
})

app.get("/freeplay", (req, res) => {
  let a = fs.readFileSync("./files/html/FreePlay.html") // player vs player, X starts.
  res.write(a)
  res.end()
})