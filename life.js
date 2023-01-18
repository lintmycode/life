export default class Life {
  cells = []
  config = {}
  generation = 0
  
  STATES = {
    DEAD:0,
    ALIVE: 1
  }

  PATTERNS = {
    STILL: {
      BLOCK: [[1, 1], [1, 1]],
      BEEHIVE: [[0, 1, 1, 0], [1, 0, 0, 1], [0, 1, 1, 0]],
      LOAF: [[0, 1, 1, 0], [1, 0, 0, 1], [1,0, 1, 0, 1], [0, 0, 1, 0]],
      BOAT: [[1, 1, 0], [1, 0, 1], [0, 1, 0]],
      TUB: [[0, 1, 0], [1, 0, 1], [0, 1, 0]],
    },
    OSCILLATORS: {
      BLINKER: [[1, 1, 1]],
      TOAD: [[0, 1, 1, 1], [1, 1, 1, 0]],
      BEACON: [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]],
    },
    SPACESHIPS: {
      GLIDER: [[0, 1, 0], [0, 0, 1], [1, 1, 1]]
    }
  }

  canvas = null
  ctx = null

  constructor(canvas, sideLength = 100) {
    this.config = {
      columns: sideLength,
      lines: sideLength, 
      cell: {
        width: canvas.clientWidth / sideLength,
        height: canvas.clientHeight / sideLength
      }, 
      infinite: true
    }
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d");
    this.init()
  }

  init() {
    for (let i = 0; i < this.config.lines; i++) {
      let line = []
      for (let j = 0; j < this.config.columns; j++) {
        line.push(this.getRandomState())
        // line.push(this.STATES.DEAD)
      }
      this.cells.push(line)
    }

    // this.insertPattern(2, 1, this.PATTERNS.STILL.BLOCK)
    // this.insertPattern(1, 1, this.PATTERNS.OSCILLATORS.BLINKER)
    // this.insertPattern(1, 1, this.PATTERNS.OSCILLATORS.BEACON)
    // this.insertPattern(0, 0, this.PATTERNS.SPACESHIPS.GLIDER)
    
    this.draw()
  }

  draw() {
    this.ctx.clearRect(0, 0, this.config.cell.width * this.config.columns, this.config.cell.height * this.config.lines)
    this.ctx.strokeStyle = "#999";
    this.ctx.fillStyle = "#000";

    for (let i = 0; i < this.config.lines; i++) {
      for (let j = 0; j < this.config.columns; j++) {
        let path = new Path2D();
        const cell = this.cells[j][i] // switch j, i; i are lines (Y), j are columns (X)
        path.rect(i * this.config.cell.width, j * this.config.cell.height, this.config.cell.width, this.config.cell.height)
        this.ctx.stroke(path);

        if (cell === this.STATES.ALIVE) {
          this.ctx.fill(path)
        } 
      }
    }

    document.getElementById("generation").innerText = this.generation
  }

  next() {
    // profit
    let newCells = []
    for (let i = 0; i < this.config.lines; i++) {
      let line = []
      for (let j = 0; j < this.config.columns; j++) {
        const n = this.getNeighbours(i, j)
        if (this.cells[i][j] === this.STATES.ALIVE && (n === 2 || n === 3) || 
          this.cells[i][j] === this.STATES.DEAD && n === 3) {
          line.push(this.STATES.ALIVE)
        }       
        else {
          line.push(this.STATES.DEAD)
        }
      }
      newCells.push(line)
    }

    this.cells = newCells
    this.draw()
    this.generation++
  }

  getNeighbours(i, j) {
    let n = 0


    // tl, t, tr
    if (i > 0) {
      if (j > 0 && this.cells[i - 1][j - 1] === this.STATES.ALIVE) n++
      if (this.cells[i - 1][j] === this.STATES.ALIVE) n++
      if (j < this.config.columns - 1 && this.cells[i - 1][j + 1] === this.STATES.ALIVE) n++
    }

    // infinite mode 0 becomes n - 1
    if (i === 0 && this.infinite) {
      if (j > 0 && this.cells[this.config.columns - 1][j - 1] === this.STATES.ALIVE) n++
      if (this.cells[this.config.columns - 1][j] === this.STATES.ALIVE) n++
      if (j < this.config.columns - 1 && this.cells[this.config.columns - 1][j + 1] === this.STATES.ALIVE) n++
    }

    // l, _, r
    if (j > 0) {
      if (this.cells[i][j - 1] === this.STATES.ALIVE) n++
    }
    if (j < this.config.columns - 1) {
      if (this.cells[i][j + 1] === this.STATES.ALIVE) n++
    }

    // bl, b, br
    if (i < this.config.lines - 1) {
      if (j > 0 && this.cells[i + 1][j - 1] === this.STATES.ALIVE) n++
      if (this.cells[i + 1][j] === this.STATES.ALIVE) n++
      if (j < this.config.columns - 1 && this.cells[i + 1][j + 1] === this.STATES.ALIVE) n++
    }

    return n
  }

  getRandomState(deathProb = 0.85) {
    const r = Math.floor(Math.random() * 100 + 1) / 100
    return r <= deathProb ? this.STATES.DEAD : this.STATES.ALIVE
  }

  insertPattern(i, j, pattern) {   
    for (let _i = 0; _i < pattern.length; _i++) {
      const line = pattern[_i]
      for (let _j = 0; _j < line.length; _j++) {
        this.cells[i + _i][j + _j] = line[_j];
      }
    }
  }
}