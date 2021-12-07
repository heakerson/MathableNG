import { MathObject } from "../models/math-object.model";

export interface Multipliable<TMathObject extends MathObject> {
    multiply(mathObject: TMathObject): TMathObject;
}