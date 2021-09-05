import * as THREE from 'three';

export class PlaneLineGeometry extends THREE.BufferGeometry {
    constructor(width=1, depth=1, widthSegments=5, depthSegments=5) {
        super();

        const vertices = [];

        const widthHalf = width/2;
        const depthHalf = depth/2;

        let x = -widthHalf;
        let z = -depthHalf;
        const xStep = width / (widthSegments-1);
        const zStep = depth / (depthSegments-1);
        for(let i=0; i<widthSegments; i++) {
            vertices.push(x, 0, -depthHalf);
            vertices.push(x, 0, depthHalf);

            x += xStep;
        }
        for(let i=0; i<depthSegments; i++) {
            vertices.push(-widthHalf, 0, z);
            vertices.push(widthHalf, 0, z);

            z += zStep;
        }

        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    }
}
