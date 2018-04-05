export class Middleware {

    public use(fn: Function) {
        this.go = (stack => (next: Function) => stack(fn.bind(this, next.bind(this))))(this.go);
    }

    public go(next: Function) {
        next();
    }

}