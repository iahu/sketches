const numBalls = 8;
const balls = [];

function setup() {
  createCanvas(400, 400);
  pixelDensity(1);

  for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball(random(0, width), random(0, height), random(80, 180)));
  }
}

function draw() {
  background(0);
  // noLoop();

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let c = 0;
      for (let ball of balls) {
        const { x: x0, y: y0, r } = ball;
        c += map(r / dist(x0, y0, x, y), 0.999, 1, 0, 1);
      }
      const pi = (y * width + x) * 4;
      const col = lerp(250, 0, c / 1000);
      pixels[pi + 0] = col;
      pixels[pi + 1] = col;
      pixels[pi + 2] = 255;
      // pixels[pi + 3] = c;
    }
  }
  updatePixels();

  for (let ball of balls) {
    ball.update();
    // ball.draw();
  }
}

class Ball {
  x = 0;
  y = 0;
  r = 0;
  v = createVector();

  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.v = createVector(random(-2, 2), random(-2, 2));
  }

  update() {
    this.x += this.v.x;
    this.y += this.v.y;

    if (this.x < 0 || this.x > width) {
      this.v.x *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.v.y *= -1;
    }
  }

  draw() {
    noFill();
    stroke(255, 120);
    circle(this.x, this.y, this.r / 2);
  }
}
