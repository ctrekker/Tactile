import './index.css';

import * as THREE from 'three';
import { VRButton } from './components/VRButton';
import { XRControllerModelFactory } from './components/XRControllerModelFactory';
import { PlaneLineGeometry } from './geometries/PlaneLineGeometry';
import { HTMLMesh } from './interactive/HTMLMesh';
import { InteractiveGroup } from './interactive/InteractiveGroup';
import { GUI } from './libs/dat.gui.module';
import { Line2D } from './viz/plots/Line2D';
import { LaTeXObject } from './viz/text/LaTeXObject';
import { DynamicElements } from './interactive/DynamicElements';
import { Axis3D } from './viz/frame/Axis3D';
import { ArgTypes, FunctionWrapper, ReturnTypes } from './viz/util/FunctionWrapper';
import { Line3D } from './viz/plots/Line3D';
import { Vector2, Vector3 } from 'three';
import { VoxelPlot } from './viz/plots/Voxel';


const scene = new THREE.Scene();


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.xr.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.3, 1.1, 0);
camera.lookAt(0, 1, -1);
scene.add(camera);


const overheadLight = new THREE.DirectionalLight(0xffffff, 1.25);
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
// scene.add(functionMesh);


window.onlatex = () => {
    // const latex = new LaTeXObject(`f(x)=e^{-x^2}`);
    // latex.position.set(-0.07, 1.13, -0.5);
    // latex.scale.set(0.125, 0.125, 1);
    // scene.add(latex);

    // const latex2 = new LaTeXObject(`f(x)=sin(x)`);
    // latex2.position.set(0.16, 1.2, -0.5);
    // latex2.scale.set(0.125, 0.125, 1);
    // scene.add(latex2);
};
if(MathJax.tex2svg) window.onlatex();


// 2d function example
// const myFn = (x, t=0) => Math.cos(t) * Math.exp(-Math.pow(x, 2));
// const myFn2 = (x, t=0) => new Vector2(x, Math.sin(Math.PI * x - 3 * t) + Math.sin(Math.PI * x + 2 * t) + Math.sin(2 * Math.PI * x + 2 * t));

// const myFn2_wrapper = new FunctionWrapper(myFn2, {
//     args: [
//         ArgTypes.SPACE,
//         ArgTypes.TIME
//     ],
//     return: ReturnTypes.VECTOR
// });

// const line2d = Line2D.fromFunction([myFn2_wrapper], -2, 2, 0.1, {
//     color: [0xff0000, 0x00ff00],
//     animated: true
// });
// line2d.scale.set(0.25, 0.25, 1);
// line2d.position.set(0, 1, -0.5);
// scene.add(line2d);


// Example: Voxel Plot
const voxelPlot = new VoxelPlot([
    [[0, 1, 1]],
    [[1, 0, 1]],
    [[0, 1, 1]]
], {
    // opacity: 0.8,
    // gap: 0.2,
    // color: 0xff0000
});
voxelPlot.scale.set(0.25, 0.25 * 1/3, 0.25);
voxelPlot.position.set(1, 0, -2);
scene.add(voxelPlot);


// TODO: Make functions mutate vectors rather than instantiate them (for performance)


// function onParameterChange() {
//     functionMesh.scale.y = functionParameters.scale;
//     functionMesh.position.x = -1.5 + functionParameters.translateX;
// }
// const gui = new GUI({ width: 300 });
// gui.add(functionParameters, 'scale', 0.0, 1.0).onChange(onParameterChange);
// gui.add(functionParameters, 'translateX', -1.0, 1.0).onChange(onParameterChange);
// gui.domElement.style.visibility = 'hidden';

const guiGroup = new InteractiveGroup(renderer, camera);
// scene.add(guiGroup);

// const guiMesh = new HTMLMesh(gui.domElement);
// guiMesh.position.set(-0.75, 1.5, -0.5);
// guiMesh.rotation.y = Math.PI / 4;
// guiMesh.scale.setScalar(2);
// guiGroup.add(guiMesh);


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
const clock = new THREE.Clock();
renderer.setAnimationLoop(animate);
function animate() {
    const delta = clock.getDelta();

    updatePointer(controller1);
    updatePointer(controller2);

    DynamicElements.update(clock.getElapsedTime(), delta);

    renderer.render(scene, camera);
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);
