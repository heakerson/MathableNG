import { Factor } from './factor.model';

export class Variable extends Factor {

    constructor(input: string) {
        super(input);
    }

    clone(): Variable {
        return new Variable(this.input);
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }
}
