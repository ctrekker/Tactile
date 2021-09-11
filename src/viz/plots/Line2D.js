import { BufferGeometry, Float32BufferAttribute, Group, Line, LineBasicMaterial, Vector2, Vector3 } from "three";
import { DynamicElements } from "../../interactive/DynamicElements";
import { Axis2D } from "../frame/Axis2D";
import { DataArray } from "../util/DataArray";

export class Line2D extends Group {
    constructor(data, { animated=false, color=0xff0000, _fn={} }) {
        super();

        this.add(new Axis2D());

        this.data = Array.isArray(data) ? data : [data];
        this.lines = [];
        this.color = color;
        this.animated = animated;
        this._fn = _fn;

        this.plotScale = new Vector3(
            Math.max(Math.abs(DataArray.reduceMax(this.data, 'x')), Math.abs(DataArray.reduceMin(this.data, 'x'))) || 1,
            Math.max(Math.abs(DataArray.reduceMax(this.data, 'y')), Math.abs(DataArray.reduceMin(this.data, 'y'))) || 1,
            1
        );

        for(let i=0; i<this.data.length; i++) {
            this.addLine(this.data[i], this.color.length ? this.color[i] : this.color);
        }

        if(this.animated) {
            DynamicElements.add(this);
        }
    }

    static fromFunction(fn, start, stop, step, parameters={}) {
        if(!Array.isArray(fn)) {
            fn = [fn];
        }
        return new Line2D(fn.map(f => f.range(start, stop, step)), {
            ...parameters,
            _fn: {
                start, stop, step,
                fns: fn
            }
        });
    }
    
    addLine(data, color) {
        const line = new Line(
            new Line2DGeometry(data.x, data.y, this.plotScale.x, this.plotScale.y),
            new LineBasicMaterial({ color })
        )
        this.lines.push(line);
        this.add(line);
    }

    update(t, delta) {
        let i = 0;
        for(let fn of this._fn.fns) {
            fn.rangeInPlace(this._fn.start, this._fn.stop, this._fn.step, this.data[i], t);
            this.lines[i].geometry.update(this.data[i], this.plotScale);
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

    update(data, scale) {
        const scaledData = data.scale(scale);
        for(let i=0; i<data.length; i++) {
            const v = scaledData.get(i);
            this.attributes.position.setXYZ(i, v.x, v.y, 0);
        }
        this.attributes.position.needsUpdate = true;
    }
}