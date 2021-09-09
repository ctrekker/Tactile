import { Vector3 } from "three";

export class DataArray {
    constructor(data, elementSize) {
        this.data = data;
        this.elementSize = elementSize;
    }

    get x() {
        return this.data.map(v => v.x);
    }
    get y() {
        return this.data.map(v => v.y);
    }
    get z() {
        return this.data.map(v => v.z);
    }

    get length() {
        return this.data.length;
    }

    get buffer() {
        const buf = new Float32Array(this.data.length * this.elementSize);
        for(let i=0; i<this.data.length; i++) {
            const pos = i * this.elementSize;
            for(let j=0; j<this.elementSize; j++) {
                buf[pos + j] = this.data[i].getComponent(j);
            }
        }
        return buf;
    }

    set(i, val) {
        this.data[i] = val;
    }
    get(i) {
        return this.data[i];
    }

    max(prop) {
        return Math.max(...this[prop]);
    }
    min(prop) {
        return Math.min(...this[prop]);
    }

    scale(scaleVector) {
        const newData = new Array(this.data.length);
        for(let i=0; i<this.data.length; i++) {
            const v = new Vector3();
            v.copy(this.data[i]);
            v.divide(scaleVector);
            newData[i] = v;
        }
        return new DataArray(newData, 3);
    }


    // Takes arrays of DataArrays, gives max of all them
    static reduceMax(arr, prop) {
        return Math.max(...(arr.map(d => d.max(prop))));
    }
    static reduceMin(arr, prop) {
        return Math.min(...(arr.map(d => d.min(prop))));
    }
}