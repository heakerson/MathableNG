import { Factory } from "src/models/services/core/factory.service";
import { Sign } from "../enums.model";
import { MathObject } from "../math-object.model";

export abstract class Factor extends MathObject {
    get sign(): Sign {
        return this.formattedInput[0] === '-' ? Sign.Negative : Sign.Positive;
    }

    public flipSign<TFactor extends Factor>(): TFactor {
        let factorString = this.toString();

        if (this.sign === Sign.Negative) {
            factorString = factorString.substring(1);
        } else {
            factorString = `-${factorString}`;
        }
        return Factory.buildFactor(factorString) as TFactor;
    }

    public override copy(): Factor {
        return Factory.buildFactor(this.toString());
    }
}