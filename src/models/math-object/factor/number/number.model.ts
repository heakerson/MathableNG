import { Addable } from "../../../../interfaces/addable.interface";
import { Multipliable } from "../../../../interfaces/multipliable.interface";
import { Factor } from "../factor.model";

export abstract class Number extends Factor implements Addable<Number>, Multipliable<Number> {
    abstract add(number: Number): Number;
    abstract multiply(number: Number): Number;
}