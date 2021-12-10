import { MathObject } from "src/models/math-object/math-object.model";
import { LogLn } from "./log-ln.model";

export class Log extends LogLn {
    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}