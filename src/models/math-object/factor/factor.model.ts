import { Factory } from "src/models/services/factory.service";
import { Sign } from "../enums.model";
import { MathObject } from "../math-object.model";

export abstract class Factor extends MathObject {
    get sign(): Sign {
        return this.formattedInput[0] === '-' ? Sign.Negative : Sign.Positive;
    }

    public flipSign<TFactor extends Factor>(): TFactor {
        return Factory.buildFactor(`${this.sign === Sign.Positive ? Sign.Negative : Sign.Positive}${this.formattedInput}`) as TFactor;
    }

    protected override getFormattedInputString(): string {
        let formatted = super.getFormattedInputString();

        if (this.inputWhitespaceRemoved[0] === '+') {
            formatted = formatted.substring(1);
        }

        return formatted;
    }
}