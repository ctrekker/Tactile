import { BufferGeometry, Float32BufferAttribute, Group, Line, LineBasicMaterial } from "three";
import { Axis2D } from "../frame/Axis2D";

export class Line2D extends Group {
    constructor(xValues, yValues, color=0xff0000) {
        super();

        this.add(new Axis2D());

        const xMin = Math.min(...xValues.flat());
        const yMin = Math.min(...yValues.flat());
        const xMax = Math.max(...xValues.flat());
        const yMax = Math.max(...yValues.flat());
        this.xScale = Math.max(Math.abs(xMin), Math.abs(xMax));
        this.yScale = Math.max(Math.abs(yMin), Math.abs(yMax));

        if(xValues[0].length || xValues.length === 0) {
            if(xValues.length !== yValues.length) {
                throw new Error(`xValues and yValues must contain the same number of lines (${xValues.length} != ${yValues.length})`);
            }

            for(let i=0; i<xValues.length; i++) {
                this.addLine(xValues[i], yValues[i], color.length ? color[i] : color);
            }
        }
        else {
            this.addLine(xValues, yValues, color);
        }
    }
    
    addLine(xValues, yValues, color) {
        const lines = new Line(
            new Line2DGeometry(xValues, yValues, this.xScale, this.yScale),
            new LineBasicMaterial({ color })
        )
        this.add(lines);
    }

    // set color(newColor) {

    // }


    static fromFunction(fns, color, xMin=-2, xMax=2, step=0.1) {
        const xValues = [];
        const yValues = [];

        if(typeof fns === 'function') {
            fns = [fns];
        }

        for(let fn of fns) {
            xValues.push([]);
            yValues.push([]);
            for(let x=xMin; x<=xMax+step; x+=step) {
                xValues[xValues.length-1].push(x);
                yValues[xValues.length-1].push(fn(x));
            }
        }

        return new Line2D(xValues, yValues, color);
    }
}

class Line2DGeometry extends BufferGeometry {
    constructor(xValues, yValues, xScale, yScale) {
        super();

        if(xValues.length !== yValues.length) {
            throw new Error(`xValues and yValues must have the same length (${xValues.length} != ${yValues.length})`);
        }

        const vertices = [];
        for(let i=0; i<xValues.length; i++) {
            const x = xValues[i] / xScale;
            const y = yValues[i] / yScale;
            vertices.push(x, y, 0);
        }

        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    }
}