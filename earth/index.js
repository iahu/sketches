import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const orbitControls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
camera.position.z = 15;
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onWindowResize, false);
onWindowResize();

{
  const ambLight = new THREE.AmbientLight(0xffffff, 0.2);
  ambLight.position.set(0, 0, 2);
  scene.add(ambLight);
}

{
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.target.position.set(0, 0, 0);
  dirLight.name = 'Sun';
  dirLight.position.set(2, 0, 0);
  scene.add(dirLight);
  scene.add(dirLight.target);
}

{
  const startsPoints = [];
  for (let i = 0; i < 400; i++) {
    startsPoints.push(
      new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(20),
    );
  }
  const starsGeometry = new THREE.BufferGeometry().setFromPoints(startsPoints);
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
  });
  const starts = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starts);
}

const earthSystem = new THREE.Object3D();
earthSystem.rotation.z = (23 * Math.PI) / 180;

const loader = new THREE.TextureLoader();

{
  const geometry = new THREE.SphereGeometry(3.6, 32, 32);
  const texture = loader.load('./earthmap2k.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = loader.load('./earthbump2k.jpg');
  const displaceMap = loader.load('./earthspec2k.jpg');
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: texture,
    bumpMap: bumpMap,
    bumpScale: 0.2,
    displacementMap: displaceMap,
    displacementScale: 0.001,
    shininess: 0.8,
  });
  const earth = new THREE.Mesh(geometry, material);
  earth.name = 'Earth';
  earthSystem.add(earth);
  scene.add(earthSystem);
}
{
  const texture = loader.load('./moonmap2k.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = loader.load('./moonbump2k.jpg');
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    bumpMap: bumpMap,
    bumpScale: 0.1,
  });
  const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
  const moon = new THREE.Mesh(moonGeometry, material);
  moon.name = 'Moon';
  scene.add(moon);
}

function animate(time) {
  const sun = scene.getObjectByName('Sun');
  const earth = scene.getObjectByName('Earth');
  const moon = scene.getObjectByName('Moon');
  orbitControls.update();
  if (!sun || !earth || !moon) return;
  earth.rotation.y += 0.02;
  const earthTime = -time / 1000;
  const moonTime = -time / 28000 - 10;
  sun.position.set(Math.sin(earthTime), 0.24, Math.cos(earthTime));
  moon.position.set(100 * Math.sin(moonTime), 0, 100 * Math.cos(moonTime));
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
