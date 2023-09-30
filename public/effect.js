var canvas15 = document.getElementById("canvas5")

// attach element to DOM
document.body.appendChild(canvas15)

// background color [r, g, b] 
var bg = [50, 50, 50]

// get the canvas15 context (this is the part we draw to)
var ctx5 = canvas15.getContext("2d")
var wh = 1;

function setup() {
  // setup the canvas15 size to match the window
  canvas15.width = window.innerWidth
  canvas15.height = window.innerHeight
  wh = canvas15.width > canvas15.height ? canvas15.height : canvas15.width;
  
  // set the 0,0 point to the middle of the canvas15, this is not necessary but it can be handy
  ctx5.translate(canvas15.width / 2, canvas15.height / 2)
  
  fill(bg, 1)
}

// fill entire canvas15 with a preset color
function fill(rgb, amt) {
  ctx5.beginPath(); // start path
  ctx5.rect(- canvas15.width / 2, - canvas15.height / 2, canvas15.width, canvas15.height) // set rectangle to be the same size as the window
  ctx5.fillStyle = `white` // use the rgb array/color for fill, and amt for opacity
  ctx5.fill() // do the drawing
}

function drawCircle(x, y, r, color) {
  ctx5.beginPath();
  ctx5.arc(x ,y , r, 0, 2 * Math.PI);
  ctx5.fillStyle = color || '#f95959'
  ctx5.fill()
  ctx5.closePath()
}

function Particle() {
  // initialize loopers with random trange and offset
  this.loop1 = new Looper(2000 + 200 * Math.random(), 860 * Math.random()) 
  this.loop2 = new Looper(500 + 250 * Math.random(), 220 * Math.random())
  this.loop3 = new Looper(120 + 20 * Math.random(), 140 * Math.random())
  this.offset = Math.random() // some color offset for the color
  
  this.draw = function (){
    // set x,y, radius, and color params
    var x = (this.loop1.sin) * (wh/4 - 10) + (this.loop2.sin) * (wh/6 - 10) + (this.loop3.sin) * 30
    var y = (this.loop1.cos) * (wh/4 - 10) + (this.loop2.cos) * (wh/6 - 10) + (this.loop3.cos) * 30
    var r = 0.5 + 8 * this.loop3.sinNorm * this.loop3.cosNorm // set the radius
    var c = `hsla(${80 + 58 * (this.loop3.cosNorm + this.offset) * this.loop2.sinNorm}, ${100}%, ${50 + 10 * this.loop3.sin}%, ${0.5})`
    
    drawCircle(x, y, r, c);  // draw the circle
    
    this.loop1.update() // update looper
    this.loop2.update() // update looper
    this.loop3.update() // update looper
  }
}

// initialize a set of particle
var particles = []
for (var i = 0; i < 70; i ++) {
  particles.push(new Particle())
}

function draw() {
  
  // fill context with background color (use 5% static + 10% of cos value of first particls loop1)
  fill(bg, 0.05 + particles[0].loop2.cosNorm * 0.20)
  
  // update all the particles
  for (var i = 0; i < particles.length; i ++) {
    particles[i].draw() // do it once
    particles[i].draw() // now do it again, this will update the particle loopers and redraw more often
    particles[i].draw() // the more I do it the faster the particles will move
  }
  
  // this is a draw loop, this will execute frequently and is comparable to EnterFrame on other platform
  window.requestAnimationFrame(function(){draw()})
}

// start enterFrame loop
window.requestAnimationFrame(draw);

// force running setup
setup()

// re-setup canvas15 when the size of the window changes 
window.addEventListener("resize", setup)

// create a class to hold value and have built in incrementing functionality
function Looper (steps, start) {
  this.val = start || 0 // set value to start value if defined, or 1
  this.steps = steps || 50 // set steps to passed value or default to 100
  this.norm = this.val / this.range // initialize normalized value (between 0 and 1)
  this.sin = Math.sin(this.norm * Math.PI * 2) // get sine value from norm normalized to [0, 2PI]
  this.sinNorm = (this.sin + 1) / 2 // normalize sin to [0,1]
  this.cos = Math.cos(this.norm * Math.PI * 2) // get cosine value from norm normalized to [0, 2PI]
  this.cosNorm = (this.cos + 1) / 2 // normalize cos to [0,1]
  
  this.update = function () {
    this.val = (this.val + 1) % this.steps // update value
    this.norm = this.val / this.steps // update normalize value (between 0 and 1)
    this.sin = Math.sin(this.norm * Math.PI * 2) // get sine value from norm normalized to [0, 2PI]
    this.sinNorm = (this.sin + 1) / 2 // normalize sine to [0,1]
    this.cos = Math.cos(this.norm * Math.PI * 2) // get cosine value from norm normalized to [0, 2PI]
    this.cosNorm = (this.cos + 1) / 2 // normalize cos to [0,1]
  }
}