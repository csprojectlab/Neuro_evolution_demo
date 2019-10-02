class Pipe {
    constructor () {
      this.spacing = 200;     // Space between parallel pipes.
      this.left = random(width / 6, (3 / 4) * width);      // Ending of left pipe.
      this.right = width - (this.left + this.spacing);        // Starting of right pipe.
      this.speed = 5;     // Downward speed of pipe
      this.pipeHeight = 50;   // Width of pipe.
      this.y = -this.pipeHeight;  
      this.highlight = false;       // Highlight when hit.

      this.leftIcon = leftObs;
      this.rightIcon = rightObs;
    }  

    /**
     *  Checking whether the car hit the pipe.
     */
    hit (car) {
      if(car.y < this.y + this.pipeHeight && car.y > this.y) {
        if(car.x < this.left || car.x > width - this.right) {
          this.highlight = true;
          return true;
        }
      }
      return false;
    }

    /**
     *  Moving the pipe downward.
     */
    update () {
      this.y += this.speed;
    }

    /**
     * Checking whether the pipe will be on screen or not.
     */
    offscreen () {
      if(this.y > height + this.pipeHeight) 
        return true;      
      return false;
    }

    show () {
      fill(255, 0, 0);   // Red color.
      if(this.highlight) {
        fill(150, 100, 0)
      }     
      //  rect(0, this.y, this.left, this.pipeHeight);    
      //  rect(width - this.right, this.y, this.right, this.pipeHeight)  
      // ellipse(width - this.right, this.y, 32, 32)
      for(let i = 0; i < this.left; i += this.pipeHeight) {
        text("SHBIT", i, this.y - 10);
        image(this.leftIcon, i, this.y, this.pipeHeight, this.pipeHeight)
      }
      for(let i = width - this.right; i < width; i += this.pipeHeight) {
        text("CR", i, this.y - 10);
        image(this.rightIcon, i, this.y, this.pipeHeight, this.pipeHeight);
      }
    }

}