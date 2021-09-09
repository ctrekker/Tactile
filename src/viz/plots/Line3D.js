import { BufferAttribute, BufferGeometry, Group, Line, LineBasicMaterial, Vector3 } from "three";
import { DynamicElements } from "../../interactive/DynamicElements";
import { Axis3D } from "../frame/Axis3D";
import { DataArray } from "../util/DataArray";

export class Line3D extends Group {
    // data: Array<Vector3>
    constructor(data, { animated=false, color=0xff0000, _fn }={}) {
        super();

        this.add(new Axis3D());

        this.data = Array.isArray(data) ? data : [data];
        this.lines = [];
        this.color = color;
        this.animated = animated;

        // DO NOT USE THIS BESIDES FOR UPDATES
        // TODO: Abstract away function methods like `update` to a superclass
        this._fn = _fn;

        this.plotScale = new Vector3(
            Math.max(Math.abs(DataArray.reduceMax(this.data, 'x')), Math.abs(DataArray.reduceMin(this.data, 'x'))) * 1.5,
            Math.max(Math.abs(DataArray.reduceMax(this.data, 'y')), Math.abs(DataArray.reduceMin(this.data, 'y'))) * 1.5,
            Math.max(Math.abs(DataArray.reduceMax(this.data, 'z')), Math.abs(DataArray.reduceMin(this.data, 'z'))) * 1.5,
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
        return new Line3D(fn.map(f => f.range(start, stop, step)), {
            ...parameters,
            _fn: {
                start, stop, step,
                fns: fn
            }
        });
    }

    addLine(data, color) {
        const line = new Line(
            new Line3DGeometry(data.scale(this.plotScale)),
            new LineBasicMaterial({ color })
        );
        this.lines.push(line);
        this.add(line);
    }

    update(t, delta) {
        if(!this._fn) {
            throw new Error('Animation is currently only supported for plots built from functions');
        }

        let i = 0;
        for(let fn of this._fn.fns) {
            fn.rangeInPlace(this._fn.start, this._fn.stop, this._fn.step, this.data[i], t);
            this.lines[i].geometry.update(this.data[i].scale(this.plotScale));
            i++;
        }
    }
}

class Line3DGeometry extends BufferGeometry {
    constructor(data) {
        super();

        console.log(data);

        this.setAttribute('position', new BufferAttribute(data.buffer, 3));
    }

    update(data) {
        for(let i=0; i<data.length; i++) {
            const v = data.get(i);
            this.attributes.position.setXYZ(i, v.x, v.y, v.z);
        }
        this.attributes.position.needsUpdate = true;
    }
}
