import { BoxGeometry, BufferAttribute, BufferGeometry, DynamicDrawUsage, Group, InstancedMesh, Mesh, MeshLambertMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D } from "three";

export class VoxelPlot extends Group {
    /*
    `data` is an array of arrays of arrays, ordered [x][y][z]
    TODO: Implement NDArray parallel in JavaScript for better compatibility
        - Possibly extension of `DataArray`
    */
    constructor(data, { color=0xffffff, opacity=1., gap=0 }={}) {
        super();

        this.data = data;

        this.shape = [this.data.length, this.data[0].length, this.data[0][0].length];
        this.length = this.shape.reduce((agg, n) => agg * n);

        // const mesh = new InstancedMesh(
        //     new BoxGeometry(1, 1, 1),
        //     new MeshLambertMaterial({ color: 0xffffff }),
        //     this.length
        // );
        // mesh.instanceMatrix.setUsage( DynamicDrawUsage );
        const transparency = opacity === 1. ? {} : { opacity, transparent: true };
        const mesh = new InstancedMesh(
            new BoxGeometry(1, 1, 1),
            new MeshLambertMaterial({ color, ...transparency }),
            this.length
        );

        const dummy = new Object3D();
        dummy.scale.set(1 / this.shape[0], 1 / this.shape[1], 1 / this.shape[2]);
        dummy.scale.multiplyScalar(1 - gap);

        let i = 0;
        for(let x=0; x<this.shape[0]; x++) {
            for(let y=0; y<this.shape[1]; y++) {
                for(let z=0; z<this.shape[2]; z++) {
                    if(this.data[x][y][z] !== 0) {
                        dummy.position.set(x / this.shape[0], y / this.shape[1], z / this.shape[2]);
                        dummy.updateMatrix();
                        mesh.setMatrixAt(i++, dummy.matrix);
                    }
                }
            }
        }

        this.add(mesh);
    }
}

// Literally a cube but I wanted BufferGeometry practice :)
// class VoxelGeometry extends BufferGeometry {
//     constructor() {
//         const vertices = new Float32Array([
//             0, 0, 0,
//             1, 0, 0
//         ]);

//         this.setAttribute('position', new BufferAttribute(vertices, 3));
//     }
// }
