import { Sign } from "src/models/math-object/enums.model";
import { Power } from "src/models/math-object/factor/power.model";
import { Factory } from "src/models/services/factory.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { mathObjectConstructorTests } from "../math-object.spec";
import { factorConstructorTests } from "./factor.spec";

export function powerConstructorTests<TPower extends Power>(
    additionalLabel: string,
    tests: { input: string, children: string[], toString: string, sign: Sign }[],
    builder: (input: string) => TPower
): void {

    describe(`Power Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TPower = builder(test.input);
                // console.log(mo);
                // console.log(mo.toString());
                expect(mo.children.length).toEqual(2);
                expect(mo.base.toString()).toEqual(test.children[0]);
                expect(mo.exponent.toString()).toEqual(test.children[1]);
            });
        });
    });
}

describe('Power', () => {

    describe('Constructor', () => {
        const constructorTests: { input: string, children: string[], toString: string, sign: Sign }[] = [
            { input: 'a^b', children: ['a', 'b'], toString: 'a^b', sign: Sign.Positive },
            { input: '-a^b', children: ['-a', 'b'], toString: '-a^b', sign: Sign.Negative },
            { input: '-(a*x)^-b', children: ['-(a*x)', '-b'], toString: '-(a*x)^-b', sign: Sign.Negative },
            { input: '(-a)^b', children: ['(-a)', 'b'], toString: '(-a)^b', sign: Sign.Positive },
            { input: 'csc[b]^b', children: ['csc[b]', 'b'], toString: 'csc[b]^b', sign: Sign.Positive },
            { input: '-csc[b]^b', children: ['-csc[b]', 'b'], toString: '-csc[b]^b', sign: Sign.Negative },
            { input: 'x*a^b', children: ['(x*a)', 'b'], toString: '(x*a)^b', sign: Sign.Positive },
            { input: '-x*a^b', children: ['(-x*a)', 'b'], toString: '(-x*a)^b', sign: Sign.Positive },
            { input: 'x^a^b', children: ['x', '(a^b)'], toString: 'x^(a^b)', sign: Sign.Positive },
            { input: '-x^-a^b', children: ['-x', '(-a^b)'], toString: '-x^(-a^b)', sign: Sign.Negative },
            { input: 'x^a^b^c', children: ['x', '(a^(b^c))'], toString: 'x^(a^(b^c))', sign: Sign.Positive },
            { input: '-x^a^b^c', children: ['-x', '(a^(b^c))'], toString: '-x^(a^(b^c))', sign: Sign.Negative },
            // { input: 'x+a^b', children: ['(x+a)', 'b'], toString: '(x+a)^b', sign: Sign.Positive },
            // { input: '-x-a^b', children: ['(-x-a)', 'b'], toString: '(-x-a)^b', sign: Sign.Positive },
            // { input: '-x^-a/b', children: ['-x', '(-a/b)'], toString: '-x^(-a/b)', sign: Sign.Negative },
        ];

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, (input: string) => new Power(input));
        mathObjectConstructorTests('STATIC Constructor', constructorTests, (input: string) => {
            const parsed = StringFormatter.parsePowerFactor(input);
            return Power.fromFactors(Factory.buildFactor(parsed.base), Factory.buildFactor(parsed.exponent));
        });

        factorConstructorTests('STANDARD Constructor', constructorTests, (input: string) => new Power(input));
        factorConstructorTests('STATIC Constructor', constructorTests, (input: string) => {
            const parsed = StringFormatter.parsePowerFactor(input);
            return Power.fromFactors(Factory.buildFactor(parsed.base), Factory.buildFactor(parsed.exponent));
        });

        powerConstructorTests('STANDARD Constructor', constructorTests, (input: string) => new Power(input));
        powerConstructorTests('STATIC Constructor', constructorTests, (input: string) => {
            const parsed = StringFormatter.parsePowerFactor(input);
            return Power.fromFactors(Factory.buildFactor(parsed.base), Factory.buildFactor(parsed.exponent));
        });

    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});
