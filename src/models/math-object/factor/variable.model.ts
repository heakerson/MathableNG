import { Factor } from './factor.model';

export class Variable extends Factor {

    public readonly name: string;

    constructor(input: string) {
        super(input);
        this.name = this.setName();
    }

    protected setName(): string {
        if (this.formattedInput[0] === '-') {
            return this.formattedInput.substring(1);
        }
        return this.formattedInput;
    }

    override copy(): Variable {
        return new Variable(this.toString());
    }
}
