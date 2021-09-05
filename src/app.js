import * as THREE from 'three';
import { Group, Line, Mesh } from 'three';
import { VRButton } from './components/VRButton';
import { XRControllerModelFactory } from './components/XRControllerModelFactory';
import { PlaneLineGeometry } from './geometries/PlaneLineGeometry';
import { HTMLMesh } from './interactive/HTMLMesh';
import { InteractiveGroup } from './interactive/InteractiveGroup';
import { GUI } from './libs/dat.gui.module';


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


const functionParameters = {
    scale: 0.5,
    translateX: 0.0
};

const functionGeometry = new THREE.ParametricGeometry(exampleFunction, 25, 25);
const functionMaterial = new THREE.MeshBasicMaterial({ map: parametricTexture(exampleSurface) });
functionMaterial.side = THREE.BackSide;
const functionMesh = new THREE.Mesh(functionGeometry, functionMaterial);
functionMesh.position.set(-1.5, 0, -1.5);
functionMesh.scale.set(3, 0.5, 3);
scene.add(functionMesh);

function onParameterChange() {
    functionMesh.scale.y = functionParameters.scale;
    functionMesh.position.x = -1.5 + functionParameters.translateX;
}
const gui = new GUI({ width: 300 });
gui.add(functionParameters, 'scale', 0.0, 1.0).onChange(onParameterChange);
gui.add(functionParameters, 'translateX', -1.0, 1.0).onChange(onParameterChange);
gui.domElement.style.visibility = 'hidden';

const guiGroup = new InteractiveGroup(renderer, camera);
scene.add(guiGroup);

const guiMesh = new HTMLMesh(gui.domElement);
guiMesh.position.set(-0.75, 1.5, -0.5);
guiMesh.rotation.y = Math.PI / 4;
guiMesh.scale.setScalar(2);
guiGroup.add(guiMesh);


// controllers
const controller1 = renderer.xr.getController(0);
scene.add(controller1);
const controller2 = renderer.xr.getController(1);
scene.add(controller2);

const controllerModelFactory = new XRControllerModelFactory();
const controllerGrip1 = renderer.xr.getControllerGrip(0);
controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
scene.add(controllerGrip1);
const controllerGrip2 = renderer.xr.getControllerGrip(1);
controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
scene.add(controllerGrip2);

// pointer line
const pointerGeometry = new THREE.BufferGeometry().setFromPoints([ new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1) ]);
const pointerLine = new THREE.Line(pointerGeometry);
const pointerLineActiveMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const pointerLinePassiveMaterial = new THREE.LineBasicMaterial({ color: 0x404040 });
pointerLine.name = 'pointer';
pointerLine.scale.z = 5;

controller1.add(pointerLine.clone());
controller2.add(pointerLine.clone());

const tempMatrix = new THREE.Matrix4();
const raycaster = new THREE.Raycaster();
function updatePointer(controller) {
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    const line = controller.getObjectByName('pointer');
    const intersections = raycaster.intersectObjects(guiGroup.children);
    if(intersections.length > 0) {
        const intersection = intersections[0];

        const object = intersection.object;
        line.scale.z = intersection.distance;
        line.material = pointerLineActiveMaterial;
    }
    else {
        line.scale.z = 5;
        line.material = pointerLinePassiveMaterial;
    }
}



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
    updatePointer(controller1);
    updatePointer(controller2);

    renderer.render(scene, camera);
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);
