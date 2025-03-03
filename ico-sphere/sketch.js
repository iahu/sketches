/**
 * @param  {number[]} v
 * @return {number[]}
 */
const normalize = (v) => {
  const [x, y, z] = v;
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
};

/**
 * @param  {number[]} v1
 * @param  {number[]} v2
 */
function midpoint(v1, v2) {
  return normalize([v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]].map((x) => x / 2));
}

const phi = (1 + Math.sqrt(5)) / 2;

function icoSphere(subdivisions) {
  // prettier-ignore
  let vertices = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ].map(normalize);

  // prettier-ignore
  let faces = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], // 1
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], // 2
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], // 3
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1] // 4
  ];

  for (let i = 0; i < subdivisions; i++) {
    /**
     * @type {number[][]}
     */
    let newFaces = [];
    let midpoints = new Map();

    const getMidpoints = (i1, i2) => {
      const key = [i1, i2].sort().join('-');
      if (!midpoints.has(key)) {
        midpoints.set(key, vertices.length);
        vertices.push(midpoint(vertices[i1], vertices[i2]));
      }
      return midpoints.get(key);
    };

    for (let j = 0; j < faces.length; j++) {
      const [a, b, c] = faces[j];

      const ab = getMidpoints(a, b);
      const bc = getMidpoints(b, c);
      const ca = getMidpoints(c, a);

      newFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = newFaces;
  }

  return { vertices, faces };
}

/**
 * https://en.wikipedia.org/wiki/Icosahedron
 */

/**
 * @type {number[][]}
 */
let vertices;
/**
 * @type {number[][]}
 */
let faces;

let strokeCheckbox;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  ({ vertices, faces } = icoSphere(2));

  const container = createDiv();
  const label = createDiv('subdivisions: 2');
  container.position(20, 20);
  container.child(label);
  const subdivisionsSlider = createSlider(0, 4, 2, 1);
  container.child(subdivisionsSlider);
  subdivisionsSlider.elt.oninput = (e) => {
    const value = subdivisionsSlider.value();
    label.html(`subdivisions: ${value}`);
    ({ vertices, faces } = icoSphere(value));
  };

  strokeCheckbox = createCheckbox('stroke', true);
  container.child(strokeCheckbox);
  stroke(255);
  strokeCheckbox.elt.onchange = () => {
    strokeCheckbox.checked() ? stroke(255) : noStroke();
  };
}

window.addEventListener('resize', () => {
  resizeCanvas(window.innerWidth, window.innerHeight);
});

let radius = 200;

function draw() {
  background(20);
  orbitControl();

  lights();
  beginShape(TRIANGLES);
  for (let triangle of faces) {
    const [a, b, c] = triangle;
    const va = vertices[a];
    const vb = vertices[b];
    const vc = vertices[c];

    fill(180 * va[0] + 180, 50 * va[1] + 50, 50 * va[2] + 50);
    vertex(radius * va[0], radius * va[1], radius * va[2]);

    fill(180 * vb[0] + 180, 50 * vb[1] + 50, 50 * vb[2] + 50);
    vertex(radius * vb[0], radius * vb[1], radius * vb[2]);

    fill(180 * vc[0] + 180, 50 * vb[1] + 50, 50 * vb[2] + 50);
    vertex(radius * vc[0], radius * vc[1], radius * vc[2]);
  }
  endShape();
}
