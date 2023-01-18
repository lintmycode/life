import Life from "./life.js"

const canvas = document.querySelector("#canvas");
let life = new Life(canvas, 100)

// interval time
let intervalTime = document.getElementById("interval").value
document.getElementById("interval").addEventListener('change', (e) => {
  intervalTime = e.target.value
  if (running) {
    clearInterval(interval)
    run()
  }
});

// controls
let running = false
let interval = null
document.getElementById("pause").addEventListener("click", (e) => {
  if (running) {
    clearInterval(interval)
    e.target.innerText = "Start"
  } else {
    run()
    e.target.innerText = "Pause"
  }
  running = !running
})

const run = () => {
  interval = setInterval(() => {
    life.next()
  }, intervalTime)
}