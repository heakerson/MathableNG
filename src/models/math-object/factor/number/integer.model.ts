import { ErrorCodes, ErrorHandler } from "src/models/services/error-handler.service";
import { Double } from "./double.model";

export class Integer extends Double {

    get isEven() : boolean {
        return this.value % 2 === 0;
    }

    constructor(input: string) {
        super(input);
    }

    public static override fromNumber(number: number): Integer {
        return new Integer(number.toString());
    }

    protected override checkCustomFormattingErrors(): void {
        super.checkCustomFormattingErrors();

        const parsed = Number.parseFloat(this.inputWhitespaceRemoved);
        const notAnInteger = parsed % 1 !== 0;

        if (notAnInteger) {
            ErrorHandler.throwError(ErrorCodes.Number.Integer.NOT_AN_INTEGER, this.constructor.name, this.inputWhitespaceRemoved, `Must be an Integer`);
        }
    }
}