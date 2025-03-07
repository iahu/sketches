import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;
camera.position.y = 4;
camera.lookAt(0, 0, 0);

const controller = new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
{
  const light = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(light);
}
{
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  scene.add(light);
}

// 加载 HDR 贴图（环境光照）
new RGBELoader().load(
  'https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr',
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; // 让物体受环境光照影响
    scene.background = texture; // 可选：将 HDR 设为背景
  },
);

const textureLoader = new THREE.TextureLoader();
const planeMap = textureLoader.load('./scenery.jpg');
planeMap.wrapS = THREE.RepeatWrapping;
planeMap.wrapT = THREE.RepeatWrapping;
planeMap.magFilter = THREE.NearestFilter;
planeMap.colorSpace = THREE.SRGBColorSpace;
const repeats = 2;
planeMap.repeat.set(repeats, repeats);

const plane = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  map: planeMap,
});
const planeMesh = new THREE.Mesh(plane, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
scene.add(planeMesh);
planeMesh.receiveShadow = true;

// 生成随机噪声纹理
function generateNoiseTexture(size) {
  const data = new Uint8Array(size * size * 4); // 4 通道 (RGBA)

  for (let i = 0; i < size * size * 4; i += 4) {
    const value = Math.random() * 255; // 0 - 255 随机噪声
    data[i] = data[i + 1] = data[i + 2] = value; // 灰度噪声
    data[i + 3] = 255; // Alpha 固定 255
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // 让噪声可以平铺
  return texture;
}

// 生成 512x512 像素的噪声贴图
const noiseTexture = generateNoiseTexture(512);

const fontLoader = new FontLoader();
fontLoader.load(
  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  function (font) {
    const textGeometry = new TextGeometry('π', {
      font: font,
      size: 5,
      depth: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelOffset: 0,
      bevelSegments: 12,
    });

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xeeeeee,
      transmission: 0.9,
      opacity: 1,
      ior: 1.4,
      roughness: 0.1,
      thickness: 0.2,
      metalness: 0,
      envMapIntensity: 1.5,
      bumpMap: noiseTexture,
      bumpScale: 0.1,
    });
    const text = new THREE.Mesh(textGeometry, material);
    text.castShadow = true;
    text.rotation.x = -Math.PI / 2;
    text.position.set(0, 0, 0);

    // 计算边界框并居中
    textGeometry.computeBoundingBox();
    textGeometry.center();

    scene.add(text);

    render();
  },
);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
