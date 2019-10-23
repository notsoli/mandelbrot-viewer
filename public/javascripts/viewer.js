// ALL CODE IS MADE BY SAM RANDA
// Although I did take inspiration and help from outside sources,
// absolutely none of this code is copy-pasted.
// Feel free to copy, change, or redistribute this code without attribution,
// but only if the derivatave work is open source and free of charge.


window.onload = init

// variable declaration
let can, con
let viewImageData, view

let width, height

let scale = 1, positionX = 0, positionY = 0

let iterations = 50

let positionLabel, scaleLabel



let red = 25, green = 119, blue = 68

// runs when the page is done loading
function init() {
  // connects js to html canvas
  can = document.getElementById("can")
  con = can.getContext("2d")

  // lets other parts of script use html elements
  positionLabel = document.getElementById("position")
  scaleLabel = document.getElementById("scale")

  // add listeners for ui elements
  document.getElementById("resetView").addEventListener("click", resetView)

  document.getElementById("iterationsInput").addEventListener("change", changeIterations)

  document.getElementById("redRandomize").addEventListener("click", () => {randomizeColor(0)})
  document.getElementById("greenRandomize").addEventListener("click", () => {randomizeColor(1)})
  document.getElementById("blueRandomize").addEventListener("click", () => {randomizeColor(2)})

  document.getElementById("redSlider").addEventListener("change", changeColor)
  document.getElementById("greenSlider").addEventListener("change", changeColor)
  document.getElementById("blueSlider").addEventListener("change", changeColor)

  // checks if the user resized the window
  window.addEventListener("resize", resizeCanvas)
  resizeCanvas()

  // checks if the user clicks the mouse
  can.addEventListener("mousedown", e => {changeView(e)})

  // creates an empty image
  viewImageData = new ImageData(width, height)
  view = viewImageData.data

  // requests the image to be drawn
  window.requestAnimationFrame(draw)
}

// draws the mandelbrot set
function draw() {
  // iterate for each pixel in the image
  for (let p = 0; p < view.length; p += 4) {
    const currentPixel = p / 4

    // get the current pixel's horizontal and vertical position
    const pixelY = Math.floor(currentPixel / width)
    const pixelX = currentPixel - (pixelY * width)

    // maps the x and y corrdinates of the current pixel to values
    // that are useful for the mandelbrot set
    const pixelXMap = calculateX(width, pixelX, scale, positionX)
    const pixelYMap = calculateY(height, pixelY, scale, positionY)

    // define variables used in function f(z) = z^2 + c
    let real = pixelXMap, imaginary = pixelYMap

    // define variable holding the iteration that the loop broke at
    let breakIterations = 0

    // repeat by number of iterations
    for (let i = 0; i < iterations; i++) {
      // perform z^2
      const newReal = real * real - imaginary * imaginary
      const newImaginary = 2 * real * imaginary
      real = real^2 - imaginary^2
      imaginary = 2 * real * imaginary

      //perform + c
      real = newReal + pixelXMap
      imaginary = newImaginary + pixelYMap

      // determine if the number can't possibly be in the mandelbrot set
      if ((real**2 + imaginary**2) > 4) {
        // set breakIterations to the current iteration plus one
        breakIterations = i + 1

        // because we already know that the point is not in the mandelbrot set,
        // we can break the loop as to not do unnecessary computations
        break
      }
    }

    // if breakIterations = 0, we know the for loops was completed without problems
    if (breakIterations == 0) {
      // is in mandelbrot set, set pixel color to black
      view[p + 0] = 255    // red value
      view[p + 1] = 255  // green value
      view[p + 2] = 255    // blue value
      view[p + 3] = 255  // alpha value
    } else {
      // console.log("Failed")
      // is not in mandelbrot set, set pixel color to kinda black
      view[p + 0] = breakIterations * red / iterations    // red value
      view[p + 1] = breakIterations * green / iterations  // green value
      view[p + 2] = breakIterations * blue / iterations    // blue value
      view[p + 3] = 255  // alpha value
    }
  }

  // display completed set
  con.putImageData(viewImageData, 0, 0)

  // request new frame to be drawn, (but not really)
  window.requestAnimationFrame(callback => {})

  // updates position and scale labels
  updateLabels()
}

// maps the x coordinate of the current pixel to a value
// that are useful for the mandelbrot set
function calculateX(width, pixelX, scale, positionX) {
  let newX = (4 / (width - 1) * pixelX) - 2
  newX /= scale
  newX += positionX
  return newX
}

// maps the y coordinate of the current pixel to a value
// that are useful for the mandelbrot set
function calculateY(height, pixelY, scale, positionY) {
  let newY = (4 / (height - 1) * pixelY) - 2
  newY /= scale * width / height
  newY += positionY
  return newY
}

// changes values that depend on the browser's size
function resizeCanvas() {
  // change width and height depending on the size of the browser
  width = window.innerWidth
  height = window.innerHeight

  can.width = width
  can.height = height

  // creates a new empty imageData
  viewImageData = new ImageData(width, height)
  view = viewImageData.data

  // requests new frame to be drawn
  window.requestAnimationFrame(draw)
}

// pans to mouse position and zooms in on click
function changeView(e) {
  if (e.button == 0) {
    // get the mouse position
    const x = e.clientX
    const y = e.clientY

    // determines how much to move positionX and positionY
    const newX = calculateX(width, x, scale, positionX)
    const newY = calculateY(height, y, scale, positionY)

    // changes position to new amount
    positionX = newX
    positionY = newY

    // increases scale
    scale *= 1.3

    // requests new frame to be drawn
    window.requestAnimationFrame(draw)
  }
}

function resetView() {
  // resets position and scale
  positionX = 0
  positionY = 0
  scale = 1

  // requests new frame to be drawn
  window.requestAnimationFrame(draw)
}

function changeIterations() {
  console.log("owo")
  let inputValue = document.getElementById("iterationsInput").value

  // changes iterations to the new value

  if (inputValue > 999) {
    iterations = 999
  }
  iterations = inputValue


  // requests new frame to be drawn
  window.requestAnimationFrame(draw)
}

function updateLabels() {
  // sets the position and scale labels to their new values
  const positionString = "Position: " + positionX.toFixed(8) + ", " + positionY.toFixed(8)
  positionLabel.innerHTML = positionString.substring(0, 32)
  const scaleString = "Scale: " + scale.toFixed(7)
  scaleLabel.innerHTML = scaleString.substring(0, 16)
}

function randomizeColor(id) {
  switch(id) {
    case 0:
      red = Math.floor(Math.random() * 255)
      document.getElementById("redSlider").value = red
      document.getElementById("redLabel").innerHTML = red
      break
    case 1:
      green = Math.floor(Math.random() * 255)
      document.getElementById("greenSlider").value = green
      document.getElementById("greenLabel").innerHTML = green
      break
    case 2:
      blue = Math.floor(Math.random() * 255)
      document.getElementById("blueSlider").value = blue
      document.getElementById("blueLabel").innerHTML = blue
      break
  }

  // requests new frame to be drawn
  window.requestAnimationFrame(draw)
}

function changeColor() {
  red = document.getElementById("redSlider").value
  document.getElementById("redLabel").innerHTML = red
  green = document.getElementById("greenSlider").value
  document.getElementById("greenLabel").innerHTML = green
  blue = document.getElementById("blueSlider").value
  document.getElementById("blueLabel").innerHTML = blue

  // requests new frame to be drawn
  window.requestAnimationFrame(draw)
}
