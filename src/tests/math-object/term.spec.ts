import { Sign } from "src/models/math-object/enums.model";
import { Term } from "src/models/math-object/term.model";
import { Factory } from "src/models/services/factory.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { mathObjectConstructorTests, MathObjectConstTest } from "./math-object.spec";

export class TermConstTest extends MathObjectConstTest {
    sign: Sign = Sign.Positive;

    constructor(props: Partial<TermConstTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export function termConstructorTests<TTerm extends Term, TTest extends TermConstTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TTerm
): void {

    describe(`Term Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TTerm = builder(test);
                // console.log(mo);
                // console.log(mo.toString());
                expect(mo.factors.map(c => c.toString())).toEqual(test.children);
                expect(mo.factorCount).toEqual(test.children.length);
                expect(mo.isSingleFactor).toEqual(test.children.length === 1);
                expect(mo.sign).toEqual(test.sign);
                expect(mo.isNegative).toEqual(test.sign === Sign.Negative);
            });
        });
    });
}

describe('Term', () => {

    describe('Constructor Tests', () => {
        const constructorTests: { input: string, children: string[], toString: string, sign: Sign }[] = [
            new TermConstTest({ input: 'a', children: ['a'], toString: 'a', sign: Sign.Positive }),
            new TermConstTest({ input: 'a*b', children: ['a', 'b'], toString: 'a*b', sign: Sign.Positive }),
            new TermConstTest({ input: '-a*b', children: ['-a', 'b'], toString: '-a*b', sign: Sign.Negative }),
            new TermConstTest({ input: '+a*b', children: ['a', 'b'], toString: 'a*b', sign: Sign.Positive }),
            new TermConstTest({ input: '-a-b', children: ['(-a-b)'], toString: '(-a-b)', sign: Sign.Positive }),
            new TermConstTest({ input: 'a*b^c', children: ['a', 'b^c'], toString: 'a*b^c', sign: Sign.Positive }),
            new TermConstTest({ input: 'a*-b^c', children: ['a', '-b^c'], toString: 'a*-b^c', sign: Sign.Positive }),
            new TermConstTest({ input: '-cot[x-b]^(c)*((e)/(f))', children: ['-cot[(x-b)]^(c)', '((e)/(f))'], toString: '-cot[(x-b)]^(c)*((e)/(f))', sign: Sign.Negative }),
            new TermConstTest({ input: '-cot[x-b]^(c)-log[a-b, -x]', children: ['(-cot[(x-b)]^(c)-log[(a-b),-x])'], toString: '(-cot[(x-b)]^(c)-log[(a-b),-x])', sign: Sign.Positive }),
            new TermConstTest({ input: 'a+-b', children: ['(a+-b)'], toString: '(a+-b)', sign: Sign.Positive })
        ];
    
        mathObjectConstructorTests('STANDARD Constructor', constructorTests, (test: TermConstTest) => new Term(test.input));
        mathObjectConstructorTests('STATIC Constructor', constructorTests, (test: TermConstTest) => {
            const factors = StringFormatter.parseFactorStrings(test.input).map(f => Factory.buildFactor(f));
            return Term.fromFactors(...factors)
        });

        termConstructorTests('STANDARD CONSTRUCTOR', constructorTests, (test: TermConstTest) => new Term(test.input))
        termConstructorTests('STATIC Constructor', constructorTests, (test: TermConstTest) => {
            const factors = StringFormatter.parseFactorStrings(test.input).map(f => Factory.buildFactor(f));
            return Term.fromFactors(...factors)
        });
    });

    describe('Individual Methods', () => {
        describe('adsf', () => {
        });
    });
});
