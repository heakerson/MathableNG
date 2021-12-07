import { Factor } from './factor.model';

export class Variable extends Factor {

    constructor(public readonly variableName: string) {
        super();
    }

    clone(): Variable {
        return new Variable(this.variableName);
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }
}
