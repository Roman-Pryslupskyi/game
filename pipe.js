const HOLE_HEIGHT = 400
const PIPE_WIDTH = 120
const PIPE_INTERVAL = 1000
const PIPE_SPEED = 0.3
let pipes = []
let timeSinceLastPipe
let passedPipeCount

let level

export function setupPipes() {
  document.documentElement.style.setProperty("--pipe-width", PIPE_WIDTH)
  document.documentElement.style.setProperty("--hole-height", HOLE_HEIGHT)
  pipes.forEach(pipe => pipe.remove())
  timeSinceLastPipe = PIPE_INTERVAL
  passedPipeCount = 0
  level = 1
}

export function updatePipes(delta) {
  timeSinceLastPipe += delta * getPipeSpeed()

  if (timeSinceLastPipe > PIPE_INTERVAL) {
    timeSinceLastPipe -= PIPE_INTERVAL
    createPipe()
  }

  pipes.forEach(pipe => {
    if (pipe.left + PIPE_WIDTH < 0) {
      passedPipeCount++
      if (passedPipeCount % 2 === 0) {
        increaseLevel()
      }
      return pipe.remove()
    }
    pipe.left = pipe.left - delta * getPipeSpeed()
  })
}

export function getPassedPipesCount() {
  return passedPipeCount
}

export function getPipeRects() {
  return pipes.flatMap(pipe => pipe.rects())
}

export function increaseLevel() {
  level++
  document.documentElement.style.setProperty("--hole-height", getHoleHeight())
}

export function getLevel() {
  return level
}

function getPipeSpeed() {
  return PIPE_SPEED + 0.1 * level
}

function getHoleHeight() {
  return HOLE_HEIGHT - level * 20
}

function createPipe() {
  const pipeElem = document.createElement("div")
  const topElem = createPipeSegment("top")
  const bottomElem = createPipeSegment("bottom")
  pipeElem.append(topElem)
  pipeElem.append(bottomElem)
  pipeElem.classList.add("pipe")
  pipeElem.style.setProperty(
    "--hole-top",
    randomNumberBetween(
      getHoleHeight() * 1.5,
      window.innerHeight - getHoleHeight() * 0.5
    )
  )
  const pipe = {
    get left() {
      return parseFloat(
        getComputedStyle(pipeElem).getPropertyValue("--pipe-left")
      )
    },
    set left(value) {
      pipeElem.style.setProperty("--pipe-left", value)
    },
    remove() {
      pipes = pipes.filter(p => p !== pipe)
      pipeElem.remove()
    },
    rects() {
      return [
        topElem.getBoundingClientRect(),
        bottomElem.getBoundingClientRect(),
      ]
    },
  }
  pipe.left = window.innerWidth
  document.body.append(pipeElem)
  pipes.push(pipe)
}

function createPipeSegment(position) {
  const segment = document.createElement("div")
  segment.classList.add("segment", position)
  return segment
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
