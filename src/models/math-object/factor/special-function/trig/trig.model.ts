import { TrigTypes } from "src/models/math-object/enums.model";
import { SpecialFunction } from "../special-function.model";

export abstract class Trig extends SpecialFunction {
    abstract readonly trigType: TrigTypes;
}