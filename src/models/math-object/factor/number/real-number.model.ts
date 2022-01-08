import { ErrorCodes, ErrorHandler } from "src/models/services/core/error-handler.service";
import { Sign } from "../../enums.model";
import { Factor } from "../factor.model";

export abstract class RealNumber extends Factor {

    public readonly value: number;

    constructor(input: string, value: number) {
        super(input);
        this.value = value;
    }

    public replaceChild(): RealNumber {
        return this.copy() as RealNumber;
    }

    public override toString(): string {
        if (this.sign === Sign.Negative && this.value === 0) {
            return `-${this.value.toString()}`
        }
        return this.value.toString();
    }

    protected override checkCustomFormattingErrors(): void {
        const parsedValue = Number.parseFloat(this.inputWhitespaceRemoved);

        if (isNaN(parsedValue)) {
            ErrorHandler.throwError(ErrorCodes.Number.NOT_A_NUMBER, this.constructor.name, this.inputWhitespaceRemoved, `Must be a real number`);
        }
    }
}