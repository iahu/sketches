const numBalls = 8;
const balls = [];

function setup() {
  createCanvas(400, 400);
  pixelDensity(1);

  for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball(random(0, width), random(0, height), random(40, 80)));
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
        c += map((2 * r) / dist(x0, y0, x, y), 0.95, 1, 0, 100 / numBalls);
      }
      const pi = (y * width + x) * 4;
      const [r, g, b] = HSBToRGB(50, 100, c);
      pixels[pi + 0] = r;
      pixels[pi + 1] = g;
      pixels[pi + 2] = b;
      pixels[pi + 3] = c;
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
    this.v = createVector(random(-1, 1), random(-1, 1));
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
    ellipse(this.x, this.y, this.r);
  }
}

/**
 * [HSBToRGB description]
 * @param  {number} h [description]
 * @param  {number} s [description]
 * @param  {number} b [description]
 * @return {number[]}   [description]
 */
function HSBToRGB(h, s, b) {
  // 确保输入值在有效范围内
  h = ((h % 360) + 360) % 360; // 色相 0-360
  s = Math.max(0, Math.min(1, s)); // 饱和度 0-1
  b = Math.max(0, Math.min(1, b)); // 明度 0-1

  const c = b * s; // 色度
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = b - c;

  let r, g, bPrime;

  if (h >= 0 && h < 60) {
    [r, g, bPrime] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, bPrime] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, bPrime] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, bPrime] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, bPrime] = [x, 0, c];
  } else {
    [r, g, bPrime] = [c, 0, x];
  }

  // 转换为 0-255 的 RGB 值
  const R = Math.round((r + m) * 255);
  const G = Math.round((g + m) * 255);
  const B = Math.round((bPrime + m) * 255);

  return [R, G, B];
}
