import * as THREE from "three";
import { SVGLoader } from "../../components/SVGLoader";

export class LaTeXObject extends THREE.Group {
    constructor(formula, color=0xffffff) {
        super();

        let wrapper = MathJax.tex2svg(`${formula}`, {em: 10, ex: 5,display: true});
        let mjOut = wrapper.getElementsByTagName('svg')[0];
        const svg = mjOut.outerHTML;
        const svgUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;

        const loader = new SVGLoader();
        loader.load(
            svgUri,
            (data) => {
                const paths = data.paths;
                const group = new THREE.Group();
        
                for ( let i = 0; i < paths.length; i ++ ) {
        
                    const path = paths[ i ];
        
                    const material = new THREE.MeshBasicMaterial( {
                        color: 0xffffff,
                        side: THREE.DoubleSide,
                        depthWrite: false
                    } );
        
                    const shapes = SVGLoader.createShapes( path );
        
                    for ( let j = 0; j < shapes.length; j ++ ) {
                        const shape = shapes[ j ];
                        const geometry = new THREE.ShapeGeometry( shape );
                        const mesh = new THREE.Mesh( geometry, material );
                        group.add( mesh );
        
                    }
        
                }
                const box = new THREE.Box3().setFromObject(group);
                let aspect = (box.max.y - box.min.y) / (box.max.x - box.min.x);
                let aspectX = 1;
                if(aspect > 1) {
                    aspectX = 1/aspect;
                    aspect = 1;
                }
        
                for(let mesh of group.children) {
                    mesh.geometry.translate(-box.min.x, -box.min.y, 0);
                    mesh.geometry.scale(1/(box.max.x - box.min.x) * aspectX, -1/(box.max.y - box.min.y) * aspect, 1);
                }
        
                group.position.y += 0.5 * aspect;
                group.position.x -= 0.5 * aspectX;
                box.setFromObject(group);
        
        
                this.add(group);
            },
            // called when loading is in progresses
            function ( xhr ) {
        
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
            },
            // called when loading has errors
            function ( error ) {
        
                console.log( error );
        
            });
    }
}