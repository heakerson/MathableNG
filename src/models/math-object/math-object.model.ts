export abstract class MathObject {
    abstract toString(): string;
    abstract clone(): MathObject;
}