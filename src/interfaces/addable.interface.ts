import { MathObject } from "../models/math-object.model";

export interface Addable<TMathObject extends MathObject> {
    add(mathObject: TMathObject): TMathObject;
}