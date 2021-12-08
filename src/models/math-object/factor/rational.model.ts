import { Factor } from './factor.model';

export class Rational extends Factor {

    constructor(input: string) {
        super(input);
    }

    clone(): Rational {
        return new Rational(this.formattedInput);
    }
}