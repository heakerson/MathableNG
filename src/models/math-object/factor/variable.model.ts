import { ErrorCodes, ErrorHandler } from 'src/models/services/error-handler.service';
import { Factor } from './factor.model';

export class Variable extends Factor {

    public readonly name: string;

    constructor(input: string) {
        super(input);
        this.name = this.setName();
    }

    public override copy(): Variable {
        return new Variable(this.toString());
    }

    protected override checkFormattingErrors(): void {
        let removedSign = this.inputWhitespaceRemoved;

        if (removedSign[0] === '-' || removedSign[0] === '+') {
            removedSign = removedSign.substring(1);
        }

        if (!removedSign.match(/^[0-9a-z]+$/)) {
            ErrorHandler.throwError(ErrorCodes.Variable.NON_ALPHA_NUMERIC_INPUT, this.constructor.name, this.inputWhitespaceRemoved, `Variable names are only alphanumeric`);
        }
    }

    protected setName(): string {
        if (this.formattedInput[0] === '-' || this.formattedInput[0] === '+') {
            return this.formattedInput.substring(1);
        }
        return this.formattedInput;
    }
}
