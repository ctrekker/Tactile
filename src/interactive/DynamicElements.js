export class DynamicElements {
    static elements = [];

    // Called when an object is dynamic
    static add(el) {
        DynamicElements.elements.push(el);
    }
    // Called on each animation frame
    static update(elapsed, delta) {
        for(let element of DynamicElements.elements) {
            element.update(elapsed, delta);
        }
    }
}
