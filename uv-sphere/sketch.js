const points = [];
const uNumber = 32;
const vNumber = 16;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB);

  const uStrip = 360 / uNumber;
  const vStrip = 180 / vNumber;
  for (let theta = 0; theta <= 180; theta += uStrip) {
    stroke(theta, 255, 255);
    const rowPoints = [];
    for (let phi = 0; phi <= 360; phi += vStrip) {
      rowPoints.push(
        createVector(
          200 * sin(theta) * cos(phi), // x
          200 * cos(theta), // y
          200 * sin(theta) * sin(phi), // z
        ),
      );
    }
    points.push(rowPoints);
  }
}

function draw() {
  background(0);
  orbitControl();

  stroke(60);
  strokeWeight(1);
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];

    beginShape(QUAD_STRIP);
    for (let j = 0; j < current.length; j++) {
      vertex(current[j].x, current[j].y, current[j].z);
      vertex(next[j].x, next[j].y, next[j].z);
    }
    endShape();
  }
}
