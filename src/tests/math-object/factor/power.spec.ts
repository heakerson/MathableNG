import { Sign } from "src/models/math-object/enums.model";
import { Power } from "src/models/math-object/factor/power.model";
import { Factory } from "src/models/services/factory.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { mathObjectConstructorTests } from "../math-object.spec";
import { factorConstructorTests, FactorConstTest } from "./factor.spec";

export function powerConstructorTests<TPower extends Power, TTest extends FactorConstTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TPower
): void {

    describe(`Power Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TPower = builder(test);
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
        const constructorTests: FactorConstTest[] = [
            new FactorConstTest({ input: 'a^b', children: ['a', 'b'], toString: 'a^b', sign: Sign.Positive }),
            new FactorConstTest({ input: '-a^b', children: ['-a', 'b'], toString: '-a^b', sign: Sign.Negative }),
            new FactorConstTest({ input: '-(a*x)^-b', children: ['-(a*x)', '-b'], toString: '-(a*x)^-b', sign: Sign.Negative }),
            new FactorConstTest({ input: '(-a)^b', children: ['(-a)', 'b'], toString: '(-a)^b', sign: Sign.Positive }),
            new FactorConstTest({ input: 'csc[b]^b', children: ['csc[b]', 'b'], toString: 'csc[b]^b', sign: Sign.Positive }),
            new FactorConstTest({ input: '-csc[b]^b', children: ['-csc[b]', 'b'], toString: '-csc[b]^b', sign: Sign.Negative }),
            new FactorConstTest({ input: 'x*a^b', children: ['(x*a)', 'b'], toString: '(x*a)^b', sign: Sign.Positive }),
            new FactorConstTest({ input: '-x*a^b', children: ['(-x*a)', 'b'], toString: '(-x*a)^b', sign: Sign.Positive }),
            new FactorConstTest({ input: 'x^a^b', children: ['x', '(a^b)'], toString: 'x^(a^b)', sign: Sign.Positive }),
            new FactorConstTest({ input: '-x^-a^b', children: ['-x', '(-a^b)'], toString: '-x^(-a^b)', sign: Sign.Negative }),
            new FactorConstTest({ input: 'x^a^b^c', children: ['x', '(a^(b^c))'], toString: 'x^(a^(b^c))', sign: Sign.Positive }),
            new FactorConstTest({ input: '-x^a^b^c', children: ['-x', '(a^(b^c))'], toString: '-x^(a^(b^c))', sign: Sign.Negative }),
            new FactorConstTest({ input: 'x+a^b', children: ['(x+a)', 'b'], toString: '(x+a)^b', sign: Sign.Positive }),
            new FactorConstTest({ input: '-b^x+y', children: ['-b', '(x+y)'], toString: '-b^(x+y)', sign: Sign.Negative }),
            new FactorConstTest({ input: '-x-a^b', children: ['(-x-a)', 'b'], toString: '(-x-a)^b', sign: Sign.Positive }),
            new FactorConstTest({ input: 'x+a^b^y', children: ['(x+a)', '(b^y)'], toString: '(x+a)^(b^y)', sign: Sign.Positive }),
            new FactorConstTest({ input: '-x-a^b^y', children: ['(-x-a)', '(b^y)'], toString: '(-x-a)^(b^y)', sign: Sign.Positive }),
            new FactorConstTest({ input: '-x-a^b^y+z', children: ['(-x-a)', '(b^y+z)'], toString: '(-x-a)^(b^y+z)', sign: Sign.Positive }),
            new FactorConstTest({ input: '-x^-a/b', children: ['-x', '(-a/b)'], toString: '-x^(-a/b)', sign: Sign.Negative }),
        ];

        const standardBuilder = (test: FactorConstTest) => new Power(test.input);
        const staticBuilder = (test: FactorConstTest) => {
            const parsed = StringFormatter.parsePowerFactor(test.input);
            return Power.fromFactors(Factory.buildFactor(parsed.base), Factory.buildFactor(parsed.exponent));
        };

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        powerConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        powerConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});
