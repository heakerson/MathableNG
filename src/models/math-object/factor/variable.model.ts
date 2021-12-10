import { Factor } from './factor.model';

export class Variable extends Factor {

    get name(): string {
        return this.formattedInput;
    }

    constructor(input: string) {
        super(input);
    }

    copy(): Variable {
        return new Variable(this.formattedInput);
    }
}
