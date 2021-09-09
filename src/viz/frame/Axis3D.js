import { BufferGeometry, ConeGeometry, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, SphereGeometry } from "three";

export class Axis3D extends Group {
    constructor(color=0xc0c0c0) {
        super();

        this.axes = new LineSegments(
            new Axis3DGeometry(),
            new LineBasicMaterial({ color })
        );
        this.axes.name = 'axes';
        this.add(this.axes);

        // const arrowMaterial = new MeshBasicMaterial({ color });
        // this.axisArrows = new Arrowheads3D(arrowMaterial);
        // this.axisArrows.name = 'axisArrows';
        // this.add(this.axisArrows);
    }
}

class Axis3DGeometry extends BufferGeometry {
    constructor() {
        super();

        const vertices = [];
        // Horizontal line
        vertices.push(-1, 0, 0);
        vertices.push(1, 0, 0);
        // Depth line
        vertices.push(0, 0, -1);
        vertices.push(0, 0, 1);
        // Vertical line
        vertices.push(0, -1, 0);
        vertices.push(0, 1, 0);

        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    }
}

// TODO: make this it's own geometry so it has better performance
class Arrowheads3D extends Group {
    constructor(material, arrowWidth=0.05, arrowHeight=0.05) {
        super();

        const halfWidth = arrowWidth / 2;

        const ay = new Mesh(new ConeGeometry(halfWidth, arrowHeight, 6), material);
        ay.position.set(0, 1, 0);
        this.add(ay);

        const any = ay.clone();
        any.position.set(0, -1, 0);
        any.rotation.x += Math.PI;
        this.add(any);

        const ax = ay.clone();
        ax.position.set(1, 0, 0);
        ax.rotation.z -= Math.PI / 2;
        this.add(ax);

        const anx = ay.clone();
        anx.position.set(-1, 0, 0);
        anx.rotation.z += Math.PI / 2;
        this.add(anx);

        const az = ay.clone();
        az.position.set(0, 0, 1);
        az.rotation.x += Math.PI / 2;
        this.add(az);

        const anz = ay.clone();
        anz.position.set(0, 0, -1);
        anz.rotation.x -= Math.PI / 2;
        this.add(anz);
    }
}
