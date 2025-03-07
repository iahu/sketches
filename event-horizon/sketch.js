function setup() {
  createCanvas(400, 400);
}

const w = 400;
const h = 400;

function draw() {
  background(0);
  stroke(255);
  strokeWeight(3);
  noLoop();

  beginShape(POINTS);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const part1 = ((2 * x - w) / h) ** 2;
      const part2 = ((2 * y - h) / h) ** 2;
      const part3 = (0.002 * h) / (2 * (x - y) + h - w);

      const v = 0.1 / abs(Math.sqrt(part1 + part2) - 0.3 + part3);
      stroke(255, lerp(0, 25, v));
      vertex(x, y, 0);
    }
  }
  endShape();
}
