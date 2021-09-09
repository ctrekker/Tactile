import { BufferGeometry, Float32BufferAttribute, Group, Line, LineBasicMaterial } from "three";
import { DynamicElements } from "../../interactive/DynamicElements";
import { Axis2D } from "../frame/Axis2D";

export class Line2D extends Group {
    constructor({x, y, fn, step, start, stop, animated=false, color=0xff0000}) {
        super();

        this.add(new Axis2D());

        this.lines = [];
        this.x = x;
        this.y = y;

        if(fn) {
            if(typeof fn === 'function') {
                fn = [fn];
            }
            this.fn = fn;
            this.step = step;
            this.start = start;
            this.stop = stop;

            this.x = [];
            this.y = [];
    
            for(let _fn of fn) {
                this.x.push([]);
                this.y.push([]);

                calculateFunctionValues(_fn, [], start, stop, step, this.x[this.x.length-1], this.y[this.y.length-1], true);
            }
        }
        
        x = this.x;
        y = this.y;
        const xMin = Math.min(...x.flat());
        const yMin = Math.min(...y.flat());
        const xMax = Math.max(...x.flat());
        const yMax = Math.max(...y.flat());
        this.xScale = Math.max(Math.abs(xMin), Math.abs(xMax));
        this.yScale = Math.max(Math.abs(yMin), Math.abs(yMax));

        if(x[0].length || x.length === 0) {
            if(x.length !== y.length) {
                throw new Error(`x and y must contain the same number of lines (${x.length} != ${y.length})`);
            }

            for(let i=0; i<x.length; i++) {
                this.addLine(x[i], y[i], color.length ? color[i] : color);
            }
        }
        else {
            this.addLine(x, y, color);
        }

        this.animated = animated;
        if(this.animated) {
            DynamicElements.add(this);
        }
    }
    
    addLine(xValues, yValues, color) {
        const line = new Line(
            new Line2DGeometry(xValues, yValues, this.xScale, this.yScale),
            new LineBasicMaterial({ color })
        )
        this.lines.push(line);
        this.add(line);
    }

    update(t, delta) {
        let i = 0;
        for(let fn of this.fn) {
            calculateFunctionValues(fn, [t], this.start, this.stop, this.step, this.x[i], this.y[i], false);
            this.lines[i].geometry.update(this.x[i], this.y[i], this.xScale, this.yScale);
            i++;
        }
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

        return new Line2D({x: xValues, y: yValues, color});
    }
}

function calculateFunctionValues(fn, args, start, stop, step, x, y, doPush=false) {
    let i = 0;
    for(let _x=start; _x<=stop+step; _x+=step) {
        if(doPush) {
            x.push(_x);
            y.push(fn(_x, ...args));
        }
        else {
            x[i] = _x;
            y[i] = fn(_x, ...args);
            i++;
        }
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

    update(xValues, yValues, xScale, yScale) {
        for(let i=0; i<xValues.length; i++) {
            const x = xValues[i] / xScale;
            const y = yValues[i] / yScale;
            this.attributes.position.setXYZ(i, x, y, 0);
        }
        this.attributes.position.needsUpdate = true;
    }
}