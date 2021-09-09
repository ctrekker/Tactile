export const ArgTypes = generateEnum([
    'SPACE',      // space parameter along plot axes
    'TIME',       // time/animation parameter
    'PARAMETRIC', // parametric parameter
    'INTERACTIVE' // user controlled interactive parameter
]);
export const ReturnTypes = generateEnum([
    'SCALAR', // for surfaces
    'VECTOR'  // for fields, parametric, and (possibly) complex plots
]);

export class FunctionWrapper {
    constructor(fn, properties) {
        this.fn = fn;
        this.properties = properties;
    }

    call(...args) {
        return fn(...args);
    }

    range(start, stop, step, ...args) {
        const out = new Float32Array((stop-start) / step + 1);
        let i = 0;
        for(let x=start; x<=stop+step; x+=step) {
            out[i] = this.fn(x, ...args);
            i++;
        }
        return out;
    }
}


function generateEnum(props) {
    const obj = {};
    for(let i=0; i<props.length; i++) {
        obj[props[i]] = i;
    }
    return obj;
}
