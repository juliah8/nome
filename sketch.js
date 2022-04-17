var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player,game;
var playerCount;
var gameState = 0;
var allPlayers;
var car1, car2, cars;
var car1Img, car2Img, track;
var coin_image, fuel_image;
var fuels, coins;
var obstacle1Image, obstacle2Image, obstacles;
var lifeImg;
var blast;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1Img = loadImage("assets/car1.png");
  car2Img = loadImage("assets/car2.png");
  track = loadImage("assets/track.jpg");

  coin_image = loadImage("assets/goldCoin.png");
  fuel_image = loadImage("assets/fuel.png");

  obstacle1Image = loadImage("assets/obstacle1.png");
  obstacle2Image = loadImage("assets/obstacle2.png");

  lifeImg = loadImage("assets/life.png");
  blast = loadImage('assets/blast.png');






}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
  bgImg = backgroundImage;
}

function draw() {
  background(bgImg);
  if(playerCount === 2){
    game.update(1);
  }
  if(gameState === 1){
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
