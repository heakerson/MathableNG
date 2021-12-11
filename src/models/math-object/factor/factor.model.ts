import { StringFormatter } from "src/models/string-formatter.model";
import { Sign } from "../enums.model";
import { MathObject } from "../math-object.model";

export abstract class Factor extends MathObject {
    get sign(): Sign {
        return this.formattedInput[0] === '-' ? Sign.Negative : Sign.Positive;
    }

    public flipSign<TFactor extends Factor>(): TFactor {
        return StringFormatter.buildFactor(`${this.sign === Sign.Positive ? Sign.Negative : Sign.Positive}${this.formattedInput}`) as TFactor;
    }
}