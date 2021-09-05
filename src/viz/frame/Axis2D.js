import { BufferAttribute, BufferGeometry, DoubleSide, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, PlaneGeometry, TrianglesDrawMode } from "three";

export class Axis2D extends Group {
    constructor(color=0xc0c0c0) {
        super();

        this.axes = new LineSegments(
            new Axis2DGeometry(),
            new LineBasicMaterial({ color })
        );
        this.axes.name = 'axes';
        this.add(this.axes);

        const arrowMaterial = new MeshBasicMaterial({ color });
        arrowMaterial.side = DoubleSide;
        this.axisArrows = new Mesh(
            new AxisArrowsGeometry(),
            arrowMaterial
        );
        this.axisArrows.name = 'axisArrows';
        this.add(this.axisArrows);

        // const backdropGeometry = new PlaneGeometry(2, 2);
        // this.backdrop = new Mesh(backdropGeometry, new MeshBasicMaterial({ color: 0x202020, opacity: 0.1, side: DoubleSide }));
        // this.backdrop.position.set(0, 0, -0.001);
        // this.add(this.backdrop);
    }
}

class Axis2DGeometry extends BufferGeometry {
    constructor() {
        super();

        const vertices = [];
        // Horizontal line
        vertices.push(-1, 0, 0);
        vertices.push(1, 0, 0);
        // Vertical line
        vertices.push(0, -1, 0);
        vertices.push(0, 1, 0);

        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    }
}

class AxisArrowsGeometry extends BufferGeometry {
    constructor(arrowWidth=0.05, arrowHeight=0.05) {
        super();

        const halfWidth = arrowWidth / 2;

        const vertices = new Float32Array([
            // X arrows
            -1, 0, 0,
            -1 + arrowHeight, -halfWidth, 0,
            -1 + arrowHeight, halfWidth, 0,

            1, 0, 0,
            1 - arrowHeight, halfWidth, 0,
            1 - arrowHeight, -halfWidth, 0,

            // Y arrows
            0, 1, 0,
            -halfWidth, 1 - arrowHeight, 0,
            halfWidth, 1 - arrowHeight, 0,

            0, -1, 0,
            halfWidth, -1 + arrowHeight, 0,
            -halfWidth, -1 + arrowHeight, 0
        ]);

        this.setAttribute('position', new BufferAttribute(vertices, 3));
    }
}
