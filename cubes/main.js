import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);

// render target scene
const rtWidth = 512;
const rtHeight = 512;
const rtScene = new THREE.Scene();
const rtCamera = new THREE.PerspectiveCamera(75, rtWidth / rtHeight, 0.1, 1000);
const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

rtScene.background = new THREE.Color(0x00ffff);

{
  const light = new THREE.AmbientLight(0xffffff, 0.2);
  rtScene.add(light);
}

{
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 2, 3);
  rtScene.add(light);
}

document.body.append(renderer.domElement);
rtCamera.position.z = 3;
rtCamera.aspect = window.innerWidth / window.innerHeight;
renderer.setSize(window.innerWidth, window.innerHeight);

const cubes = [];

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
for (let i = -1; i <= 1; i++) {
  const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(boxGeometry, material);
  cube.position.x = i * 2;
  rtScene.add(cube);
  cubes.push(cube);
}

// display scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const controls = new OrbitControls(camera, renderer.domElement);

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onWindowResize);
onWindowResize();

{
  const light = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(light);
}
{
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 2, 3);
  scene.add(light);
}

const material = new THREE.MeshPhongMaterial({
  map: renderTarget.texture,
});
const cube = new THREE.Mesh(boxGeometry, material);
scene.add(cube);

function render() {
  for (let box of cubes) {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
  }

  renderer.setRenderTarget(renderTarget);
  renderer.render(rtScene, rtCamera);
  renderer.setRenderTarget(null);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();
