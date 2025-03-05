import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);

const resize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
resize();
window.addEventListener('resize', resize);
document.body.appendChild(renderer.domElement);

{
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

{
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(1, -2, -4);
  scene.add(light);
}

const objects = [];

{
  const points = [];
  points.push(new THREE.Vector3(-1, 0, 0));
  points.push(new THREE.Vector3(0, 1, 0));
  points.push(new THREE.Vector3(1, 0, 0));
  points.push(new THREE.Vector3(-1, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const triangle = new THREE.Line(geometry, material);
  triangle.position.set(2, 0, 0);
  objects.push(triangle);
}
{
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true });
  const cube = new THREE.Mesh(geometry, material);
  objects.push(cube);
}

{
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const edgesBox = new THREE.LineSegments(edgesGeometry, material);
  edgesBox.position.set(-2, 0, 0);
  objects.push(edgesBox);
}

{
  const geometry = new THREE.SphereGeometry(0.5, 12, 12);
  const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.02 });
  const sphere = new THREE.Points(geometry, material);
  sphere.position.set(-4, 0, 0);
  objects.push(sphere);
}

camera.position.z = 5;

objects.forEach((obj) => scene.add(obj));

function animate() {
  objects.forEach((obj) => {
    obj.rotation.x += 0.01;
    obj.rotation.y += 0.01;
  });
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
