import * as THREE from 'three';
import { VRButton } from './components/VRButton';
import { PlaneLineGeometry } from './geometries/PlaneLineGeometry';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.xr.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1., 0);
scene.add(camera);

const overheadLight = new THREE.DirectionalLight(0xffffff, 0.5);
overheadLight.position.set(1, 1, 1);
scene.add(overheadLight);
const overheadLight2 = new THREE.DirectionalLight(0xffffff, 0.54);
overheadLight2.position.set(-1, -1, -1);
scene.add(overheadLight2);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const floor = new THREE.LineSegments(
    new PlaneLineGeometry(3, 3, 10, 10),
    new THREE.LineBasicMaterial({ color: 0x808080 })
);
scene.add(floor);

const functionGeometry = new THREE.ParametricGeometry(exampleFunction, 25, 25);
functionGeometry.scale(3, 0.5, 3);
const functionMaterial = new THREE.MeshLambertMaterial({ map: parametricTexture(exampleSurface) });
functionMaterial.side = THREE.BackSide;
const functionMesh = new THREE.Mesh(functionGeometry, functionMaterial);
functionMesh.position.set(-1.5, 0, -1.5);
scene.add(functionMesh);

function parametricTexture(fn) {
    const width = 250;
    const height = 250;

    const size = width * height;
    const data = new Uint8Array(3 * size);
    
    for(let i=0; i<size; i++) {
        const x = Math.floor(i / width);
        const z = i % height;
        const y = (fn(x/width, z/height) + 1) / 2;

        const stride = i*3;
        data[stride] = (y) * 255;
        data[stride + 1] = (1-y) * 255;
        data[stride + 2] = 0;
    }

    return new THREE.DataTexture(data, width, height, THREE.RGBFormat);
}
function exampleSurface(x, y) {
    return 0.5 * Math.sin(10 * x) + 0.5 * Math.sin(10 * y)
}
function exampleFunction(u, v, vec) {
    vec.set(u, exampleSurface(u, v), v);
}

// Render loop
renderer.setAnimationLoop(animate);
function animate() {
    renderer.render(scene, camera);
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);
