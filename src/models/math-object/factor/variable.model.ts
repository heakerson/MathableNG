import { ErrorCodes, ErrorHandler } from 'src/models/services/core/error-handler.service';
import { Constants } from '../enums.model';
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

    public replaceChild(): Variable {
        return this.copy();
    }

    protected override checkCustomFormattingErrors(): void {
        let removedSign = this.inputWhitespaceRemoved;

        if (removedSign[0] === '-' || removedSign[0] === '+') {
            removedSign = removedSign.substring(1);
        }

        if (!removedSign.match(/^[a-zA-Z0-9_]+$/)) {
            ErrorHandler.throwError(ErrorCodes.Variable.NON_ALPHA_NUMERIC_INPUT, this.constructor.name, this.inputWhitespaceRemoved, `Variable names are only alphanumeric and an optional single +/- sign prefix`);
        }

        Object.keys(Constants).forEach(c => {
            if (removedSign === c) {
                ErrorHandler.throwError(ErrorCodes.Variable.RESERVED_NAME, this.constructor.name, this.inputWhitespaceRemoved, `'${c}' is a reserved type. Use a different name`);
            }
        });
    }

    protected setName(): string {
        if (this.formattedInput[0] === '-' || this.formattedInput[0] === '+') {
            return this.formattedInput.substring(1);
        }
        return this.formattedInput;
    }
}
