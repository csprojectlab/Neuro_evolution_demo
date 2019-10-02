function resetGame() {
    counter = 0;
    // Resetting best car score to 0
    if (bestCar)
      bestCar.score = 0;
    pipes = [];    
}

function nextGeneration () {
    resetGame();         // Reseting the parameters.
    normalizeFitness(allCars);        // Calculate score of all cars and normalize them.
    activeCars = generate(allCars);     // Generate a new generation of cars.
    allCars = activeCars.slice();       // Create a copy.
   
}

// based on fitness
function poolSelection(cars) {
    // Start at 0
    let index = 0;
  
    // Pick a random number between 0 and 1
    let r = random(1);
  
    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
      r -= cars[index].fitness;
      // And move on to the next
      index += 1;
    }
  
    // Go back one
    index -= 1;
  
    // Make sure it's a copy!
    // (this includes mutation)
    return cars[index].copy();
  }

// Generate a new population of cars
function generate(oldCars) {
    let newCars = [];
    for (let i = 0; i < oldCars.length; i++) {
      // Select a car based on fitness
      let car = poolSelection(oldCars);
      newCars[i] = car;
    }
    return newCars;
  }


function normalizeFitness(cars) {
    // Make score exponentially better?
    for (let i = 0; i < cars.length; i++) {
      cars[i].score = pow(cars[i].score, 2);
    }
  
    // Add up all the scores
    let sum = 0;
    for (let i = 0; i < cars.length; i++) {
      sum += cars[i].score;
    }
    // Divide by the sum. Calculating the normalized fitness.
    for (let i = 0; i < cars.length; i++) {
      cars[i].fitness = cars[i].score / sum;
    }
  }