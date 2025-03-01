let horizonLineInput;
let horizonLineInputValue;

let numThetaSlider;
let numPhiSlider;
let radiusSlider;
let twistSlider;

let numThetaValue;
let numPhiValue;
let radiusValue;
let twistValue;

function setup() {
  createCanvas(600, 600, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB);

  const divEl = createDiv();
  divEl.class('controller');
  divEl.position(20, 20);

  horizonLineInput = createInput();
  horizonLineInputValue = createDiv();
  horizonLineInput.attribute('type', 'checkbox');
  divEl.child(horizonLineInputValue);
  divEl.child(horizonLineInput);
  horizonLineInputValue.html(`horizonLine: ${horizonLineInput.elt.checked}`);
  horizonLineInput.elt.addEventListener('change', () => {
    horizonLineInputValue.html(`horizonLine: ${horizonLineInput.elt.checked}`);
  });

  numThetaValue = createDiv();
  numThetaSlider = createSlider(0, 100, 50, 1);
  divEl.child(numThetaValue);
  divEl.child(numThetaSlider);
  numThetaValue.html(`numTheta: ${numThetaSlider.value()}`);
  numThetaSlider.elt.addEventListener('input', () => {
    numThetaValue.html(`numTheta: ${numThetaSlider.value()}`);
  });

  numPhiValue = createDiv();
  numPhiSlider = createSlider(0, 30, 4, 1);
  divEl.child(numPhiValue);
  divEl.child(numPhiSlider);
  numPhiValue.html(`numPhi: ${numPhiSlider.value()}`);
  numPhiSlider.elt.addEventListener('input', () => {
    numPhiValue.html(`numPhi: ${numPhiSlider.value()}`);
  });

  radiusValue = createDiv();
  radiusSlider = createSlider(30, 180, 180, 1);
  divEl.child(radiusValue);
  divEl.child(radiusSlider);
  radiusValue.html(`radius: ${radiusSlider.value()}`);
  radiusSlider.elt.addEventListener('input', () => {
    radiusValue.html(`radius: ${radiusSlider.value()}`);
  });

  twistValue = createDiv();
  twistSlider = createSlider(-2, 2, 1, 0.01);
  divEl.child(twistValue);
  divEl.child(twistSlider);
  twistValue.html(`twist: ${twistSlider.value()}`);
  twistSlider.elt.addEventListener('input', () => {
    twistValue.html(`twist: ${twistSlider.value()}`);
  });
}

function draw() {
  background(0);
  orbitControl();

  const numTheta = numThetaSlider.value();
  const numPhi = numPhiSlider.value();
  const radius = radiusSlider.value();
  const twist = twistSlider.value();

  const thetaStrip = 180 / numTheta;
  const phiStrip = 180 / numPhi;

  if (horizonLineInput.elt.checked) {
    for (let theta = 0; theta <= 180; theta += thetaStrip) {
      strokeWeight(2);
      beginShape(LINES);
      for (let phi = 0; phi < 360; phi += phiStrip) {
        const x = radius * sin(theta) * cos(phi + theta * twist);
        const y = radius * cos(theta);
        const z = radius * sin(theta) * sin(phi + theta * twist);
        stroke(phi, map(theta, 0, 180, 0, 100), 100);
        vertex(x, y, z);
      }
      endShape();
    }
  } else {
    for (let phi = 0; phi < 360; phi += phiStrip) {
      strokeWeight(2);
      beginShape(LINES);
      // let prev;
      for (let theta = 0; theta <= 180; theta += thetaStrip) {
        const x = radius * sin(theta) * cos(phi + theta * twist);
        const y = radius * cos(theta);
        const z = radius * sin(theta) * sin(phi + theta * twist);
        stroke(phi, map(theta, 0, 180, 0, 100), 100);
        vertex(x, y, z);
        // if (prev) vertex(prev[0], prev[1], prev[2]);
        // prev = [x, y, z];
      }
      endShape();
    }
  }
}
