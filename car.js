
function mutate(x) {
    if (random(1) < 0.1) {
      let offset = randomGaussian() * 0.5;
      let newx = x + offset;
      return newx;
    } else {
      return x;
    }
  }
  
  class Car {
    constructor(brain) {
      // position and size of car
      this.x = width / 2;
      this.y = height - 32;
      this.r = 12;
  
      // Gravity, lift and velocity
      this.gravity = 0.2;
      this.lift = 6;
      this.velocity = 0;

      this.icon = carImage;
  
      // Is this a copy of another car or a new one?
      // The Neural Network is the car's "brain"
      if (brain instanceof NeuralNetwork) {
        this.brain = brain.copy();
        this.brain.mutate(mutate);
      } else {
        this.brain = new NeuralNetwork(5, 16, 2);
      }
  
      // Score is how many obstacles it's been alive
      this.score = 0;
      // Fitness is normalized version of score
      this.fitness = 0;
    }
  
    // Create a copy of this car
    copy() {
      return new Car(this.brain);
    }
  
    // Display the car
    show() {
      //  fill(0, 255, 0);
      //  stroke(255);
      //  ellipse(this.x, this.y, this.r * 2, this.r * 2);
      fill(255)
      text("VIKAS", this.x, this.y - 10);
      image(this.icon, this.x, this.y, this.r*3, this.r*3);
    }
  
    // This is the key function now that decides
    // if it should move left or right!
    think(pipes) {
      // First find the closest pipe
      let closest = null;
      let record = Infinity;
      for (let i = 0; i < pipes.length; i++) {
        let diff = this.y - pipes[i].y;
        if (diff > 0 && diff < record) {
          record = diff;
          closest = pipes[i];
        }
      }
      
      if(closest != null) {
        let inputs = [];
        // y postion of the obstacle.
        inputs[0] = map(closest.y + closest.spacing, this.y, 0, 0, 1);
        // Top of the obstacle.
        inputs[1] = map(closest.left, 0, width, 0, 1);
        // Closing of the obstacle.
        inputs[2] = map(width - closest.right, 0, width, 0, 1);
        // x position of the car.
        inputs[3] = map(this.x, 0, width, 0, 1);
        // Velocity of the car.
        inputs[4] = map(this.velocity, -5, 5, 0, 1);
      //   // console.log(inputs)
        let action = this.brain.predict(inputs);
        // console.log(action[1], action[0])
        if(action[1] > action[0]){
          this.right();
        }
      }
  
     
    }
  
    // Jump up
    right() {
      this.velocity -= this.lift;
      
    }
  
    bottomTop() {
      // car crashes when hit left or right.
      return (this.x > width || this.x < 0);
    }
  
    // Update car's position based on velocity, gravity, etc.
    update() {
      this.score++;
      this.velocity += this.gravity;
      
      // this.velocity *= 0.9;
      this.x -= this.velocity;
      if(this.x < 0)
        this.x = 0;
      if(this.x > width)
        this.x = width;
      // Every frame it is alive increases the score
      //this.score++;
    }
  }