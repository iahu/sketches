/**
 * @type {number[][][]}
 */
let spherePoints = [];
let startPoints = [];
let solar;

let cols = 120;
let rows = cols / 2;
let r = 100;
let ry = 0;
let sz = 3;
let offset = 0;
let noiseScale = 0.3;
let noiseScale2 = 3;

function preload() {
  solar = loadImage('./solar.png');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB);

  // create spherePoints
  let stripR = 180 / rows;
  let stripC = 360 / cols;
  for (let theta = 0; theta <= 180; theta += stripR) {
    let latitude = [];
    for (let phi = 0; phi < 360; phi += stripC) {
      latitude.push([sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi)]);
    }
    spherePoints.push(latitude);
  }

  // create starts
  for (let i = 0; i < 2000; i++) {
    const theta = Math.random() * 360;
    const phi = Math.random() * 360;
    startPoints.push([
      3000 * (sin(theta) * cos(phi)), // x
      3000 * cos(theta), // y
      3000 * (sin(theta) * sin(phi)), // z
      Math.random(), // brightness
    ]);
  }

  noStroke();
}

function draw() {
  clear();
  orbitControl();

  renderStarts();
  rotateY(-ry);
  renderSolar();
  renderPlanet();
}

window.addEventListener('resize', () => {
  resizeCanvas(window.innerWidth, window.innerHeight);
});

function renderStarts() {
  push();
  rotateY(ry * 0.03);
  rotateX(ry * 0.03);
  strokeWeight(1.5);
  for (let i = 0; i < startPoints.length - 1; i++) {
    const [x, y, z, b] = startPoints[i];
    beginShape(POINTS);
    stroke(0, 0, b * 100);
    vertex(x, y, z);
    endShape();
  }
  pop();
}

function renderSolar() {
  push();
  translate(0, 0, -2800);
  imageMode(CENTER);
  image(solar, 0, -600, 4000, 4000);
  pop();
}

function renderPlanet() {
  push();
  // ambientLight(0, 0, 7);
  pointLight(0, 0, 100, 0, 0, 0);
  rotateX(-24);
  if (sz > 1) scale(sz);
  noStroke();

  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < spherePoints.length - 1; i++) {
    const latitude = spherePoints[i];
    for (let j = 0; j < latitude.length; j++) {
      const [x, y, z] = latitude[j];
      const n1 = noise(x * noiseScale, (y + 1) * noiseScale, z * noiseScale);
      const n2 = noise(x * noiseScale2, (y + 1) * noiseScale2, z * noiseScale2);
      fill(n1 * 300 + n2 * 60, 90, 80);

      const [ex, ey, ez] = latitude[(j + 1) % cols]; // east
      const [nx, ny, nz] = spherePoints[Math.min(i + 1, rows - 1)][j]; // north
      const [nex, ney, nez] = spherePoints[i + 1][(j + 1) % cols]; // north east

      vertex(r * x, r * y, r * z);
      vertex(r * ex, r * ey, r * ez);
      vertex(r * nx, r * ny, r * nz);

      vertex(r * ex, r * ey, r * ez);
      vertex(r * nex, r * ney, r * nez);
      vertex(r * nx, r * ny, r * nz);
    }
  }
  endShape();
  pop();

  ry += 0.4;
  sz -= 0.01;
}
