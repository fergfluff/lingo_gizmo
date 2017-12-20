

var anim;


function preload() {
  anim = loadAnimation("Animation1.png", "Animation4.png");
  felt = loadImage("feltbackground.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  textFont("PT Mono");
  background(felt);

  fill(0);
  textAlign(width / 2, height / 2);
  textSize(60);
  text('Invent an Original Word', width / 3 - 125, 100);
  textSize(40);
  text('for a Missing Dictionary', width / 3, 160);
  animation(anim, windowWidth / 2, windowHeight / 2 + 100);
  frameRate(30);
}
