import { ErrorCodes, ErrorHandler } from "src/models/services/error-handler.service";
import { Factor } from "../factor.model";

export abstract class RealNumber extends Factor {

    public readonly value: number;

    constructor(input: string, value: number) {
        super(input);
        this.value = value;
    }

    public override toString(): string {
        return this.value.toString();
    }

    protected override checkCustomFormattingErrors(): void {
        const parsedValue = Number.parseFloat(this.inputWhitespaceRemoved);

        if (isNaN(parsedValue)) {
            ErrorHandler.throwError(ErrorCodes.Number.NOT_A_NUMBER, this.constructor.name, this.inputWhitespaceRemoved, `Must be a real number`);
        }
    }
}