let pipes = [];
let activeCars = [];
let allCars = [];
let bestCar = null;
const total = 100;
let counter = 0;
let generationNumber = 1;
let carImage;

let leftObs;
let rightObs;

// Interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

// All time high score
let highScore = 0;
let allTimeHighScore = 0;

// Training or just showing the current best
let runBest = false;
let runBestButton;

let red;
let green;
let blue;

function keyPressed() {
  if (key == " ") noLoop();
  else if (key == "a" || key == "A") {
    car.right();
  } else if (key == "s" || key == "S") {
    //let json = JSON.stringify(activeCars[0].brain);   
    saveJSON(activeCars[0].brain, 'carbrain.json');    
  } else loop();
}

function preload() {
  carImage = loadImage("./assets/vikasNew.png");
  leftObs = loadImage("./assets/ShbtNew.png");
  rightObs = loadImage("./assets/CrNew.png");
}

function setup() {
  createCanvas(1000, 640);
  // pipes.push(new Pipe());
  // Access the interface elements
  speedSlider = select("#speedSlider");
  speedSpan = select("#speed");
  highScoreSpan = select("#hs");
  allTimeHighScoreSpan = select("#ahs");
  runBestButton = select('#best')
  runBestButton.mousePressed(toggleState)

  for (let i = 0; i < total; i++) {
    let car = new Car();
    activeCars[i] = car;
    allCars[i] = car;
  }
  console.log("Generation: ", generationNumber);
  // car = new Car();
}

function toggleState() {
  runBest = !runBest;
  // Show the best bird
  if (runBest) {
    resetGame();
    runBestButton.html("continue training");
    // Go train some more
  } else {
    nextGeneration();
    runBestButton.html("run best");
  }
}

function draw() {
  background(0);
  // textAlign(CENTER)
  textSize(60);
  // Random color for the background text.
  if (counter % 40 == 0) {
    red = random(0, 255);
    green = random(0, 255);
    blue = random(0, 255);
  }
  fill(red, green, blue);
  text("NEURO DRIVING", width / 2 - 230, height / 2);
  textSize(15);
  // Should we speed up cycles per frame
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  for (let n = 0; n < cycles; n++) {
    // highScore++;
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    if (runBest) {
      bestCar.think(pipes);
      bestCar.update();
      for (let j = 0; j < pipes.length; j++) {
        if (pipes[j].hit(bestCar)) {
          resetGame();
          break;
        }
        if (bestCar.bottomTop())
          resetGame();
      }
    } else {
      for (let i = activeCars.length - 1; i >= 0; i--) {
        activeCars[i].think(pipes);
        activeCars[i].update();
  
        // Check all pipes.
        for (let j = 0; j < pipes.length; j++) {
          if (pipes[j].hit(activeCars[i])) {
            activeCars.splice(i, 1);
            break;
          }
        }
        if (activeCars[i] && activeCars[i].bottomTop())
          activeCars.splice(i, 1);
      }  
    }
    
    // Add a new pipe every so often
    if (counter % 150 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }   // End of cycles loop.
  
  // Highest score of current population
  let tempHighScore = 0;
  // If we're training.
  if (!runBest) {
    // Find the best car.
    let tempBestCar = null;
    for (let i = 0; i < activeCars.length; i++) {
      let score = activeCars[i].score;
      if (score > tempHighScore) {
        tempHighScore = score;
        tempBestCar = activeCars[i];
      }
    }
    // If it is all time high score.
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestCar = tempBestCar;
    }
  } else {    // Just one car.
    tempHighScore = bestCar.score;
    if (tempHighScore > highScore)
      highScore = tempHighScore;
  }


  highScoreSpan.html(tempHighScore);
  // allTimeHighScore = Math.max(allTimeHighScore, highScore);

  allTimeHighScoreSpan.html(highScore);

  // show.
  for (let p of pipes) p.show();

  if (runBest)
    bestCar.show();
  else 
    for (let car of activeCars)
      car.show();
  if (activeCars.length == 0) {
    generationNumber++;
    console.log("Generation: ", generationNumber);
    // allTimeHighScore = Math.max(allTimeHighScore, highScore);
    // highScore = 0;

    // allTimeHighScoreSpan.html(allTimeHighScore);
    // console.log(cars.length)
    nextGeneration();
  }
}