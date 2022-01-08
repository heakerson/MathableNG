import { Sign } from "src/models/math-object/enums.model";
import { Sin } from "src/models/math-object/factor/functions/trig/sin.model";
import { Double } from "src/models/math-object/factor/number/double.model";
import { Power } from "src/models/math-object/factor/power.model";
import { Variable } from "src/models/math-object/factor/variable.model";
import { Term } from "src/models/math-object/term.model";
import { Factory } from "src/models/services/core/factory.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { baseMathObjectErrorTests, MathObjecReplaceTest, mathObjectConstructorErrorTests, mathObjectConstructorTests, MathObjectConstTest, mathObjectReplaceTests, MathObjectTraverseTest, mathObjectTraverseTests } from "./math-object.spec";

export class TermConstTest extends MathObjectConstTest {
    sign: Sign = Sign.Positive;

    constructor(props: Partial<TermConstTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export class TermFlipSignTest extends MathObjecReplaceTest {
    sign: Sign = Sign.Positive;

    constructor(props: Partial<TermFlipSignTest>) {
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

export function factorFlipSignTests<TTerm extends Term, TTest extends TermFlipSignTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TTerm
): void {

    describe(`MathObject Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach((test: TTest) => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TTerm = builder(test);
                const flipped = mo.flipFirstFactorSign();
                // console.log(test);
                // console.log(mo);
                // console.log('toString', mo.toString());
                expect(mo.toString()).toEqual(test.toStringBefore);
                expect(flipped.toString()).toEqual(test.toStringAfter);
                expect(flipped.sign).not.toEqual(mo.sign);
            });
        });
    });
}

describe('Term', () => {

    describe('Constructor Tests', () => {

        describe('Success', () => {
            const constructorTests: TermConstTest[] = [
                new TermConstTest({ input: 'a', children: ['a'], toString: 'a', sign: Sign.Positive }),
                new TermConstTest({ input: 'a*b', children: ['a', 'b'], toString: 'a*b', sign: Sign.Positive }),
                new TermConstTest({ input: '-a*b', children: ['-a', 'b'], toString: '-a*b', sign: Sign.Negative }),
                new TermConstTest({ input: '-0*b', children: ['-0', 'b'], toString: '-0*b', sign: Sign.Negative }),
                new TermConstTest({ input: '+a*b', children: ['a', 'b'], toString: 'a*b', sign: Sign.Positive }),
                new TermConstTest({ input: '-a-b', children: ['(-a-b)'], toString: '(-a-b)', sign: Sign.Positive }),
                new TermConstTest({ input: 'a*b^c', children: ['a', 'b^c'], toString: 'a*b^c', sign: Sign.Positive }),
                new TermConstTest({ input: 'a*-b^c', children: ['a', '-b^c'], toString: 'a*-b^c', sign: Sign.Positive }),
                new TermConstTest({ input: '-cot[x-b]^(c)*((e)/(f))', children: ['-cot[(x-b)]^(c)', '((e)/(f))'], toString: '-cot[(x-b)]^(c)*((e)/(f))', sign: Sign.Negative }),
                new TermConstTest({ input: '-cot[x-b]^(c)-log[a-b, -x]', children: ['(-cot[(x-b)]^(c)-log[(a-b),-x])'], toString: '(-cot[(x-b)]^(c)-log[(a-b),-x])', sign: Sign.Positive }),
                new TermConstTest({ input: 'a+-b', children: ['(a+-b)'], toString: '(a+-b)', sign: Sign.Positive })
            ];
    
            const standardBuilder = (test: TermConstTest) => new Term(test.input);
            const staticBuilder = (test: TermConstTest) => {
                const factors = StringFormatter.parseFactorStrings(test.input).map(f => Factory.buildFactor(f));
                return Term.fromFactors(...factors)
            };
        
            mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            termConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            termConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
        });

        describe('Errors', () => {
            const constructorTests: TermConstTest[] = baseMathObjectErrorTests.map(ex => {
                return new TermConstTest({ input: ex.input, errorCode: ex.errorCode, children: [], toString: '' });
            })
    
            const standardBuilder = (test: TermConstTest) => new Term(test.input);
    
            mathObjectConstructorErrorTests('STANDARD Constructor', constructorTests, standardBuilder);
        });
    });

    describe('Individual Methods', () => {

        describe('Traverse', () => {
            const standardBuilder = (test: MathObjectTraverseTest) => new Term(test.input);
            const staticBuilder = (test: MathObjectTraverseTest) => {
                const factors = StringFormatter.parseFactorStrings(test.input).map(f => Factory.buildFactor(f));
                return Term.fromFactors(...factors)
            };

            const tests: MathObjectTraverseTest[] = [
                new MathObjectTraverseTest({ input: '-a*b', type: Term, count: 1, firstChild: '-a*b', lastChild: '-a*b'}), // search type is root
                new MathObjectTraverseTest({ input: 'a*1*b*5', type: Double, count: 2, firstChild: '1', lastChild: '5'}),
                new MathObjectTraverseTest({ input: 'a*b^1*b^x^y*5', type: Power, count: 3, firstChild: 'b^1', lastChild: 'x^y'}),
                new MathObjectTraverseTest({ input: 'sin[sin[x]]', type: Sin, count: 2, firstChild: 'sin[sin[x]]', lastChild: 'sin[x]'}),
                new MathObjectTraverseTest({ input: 'sin[sin[x]]', type: Variable, count: 1, firstChild: 'x', lastChild: 'x'}),
            ];

            const childFirstTests: MathObjectTraverseTest[] = [
                new MathObjectTraverseTest({ input: '-a*b', type: Term, count: 1, firstChild: '-a*b', lastChild: '-a*b'}), // search type is root
                new MathObjectTraverseTest({ input: 'a*1*b*5', type: Double, count: 2, firstChild: '1', lastChild: '5'}),
                new MathObjectTraverseTest({ input: 'a*b^1*b^x^y*5', type: Power, count: 3, firstChild: 'b^1', lastChild: 'b^(x^y)'}),
                new MathObjectTraverseTest({ input: 'sin[sin[x]]', type: Sin, count: 2, firstChild: 'sin[x]', lastChild: 'sin[sin[x]]'}),
                new MathObjectTraverseTest({ input: 'sin[sin[x]]', type: Variable, count: 1, firstChild: 'x', lastChild: 'x'}),
            ];

            mathObjectTraverseTests('Parent First STANDARD', tests, standardBuilder, false);
            mathObjectTraverseTests('Parent First STATIC', tests, staticBuilder, false);
            mathObjectTraverseTests('Child First STANDARD', childFirstTests, standardBuilder, true);
            mathObjectTraverseTests('Child First STATIC', childFirstTests, staticBuilder, true);
        });

        describe('Replace', () => {
            const standardBuilder = (test: MathObjecReplaceTest) => new Term(test.input);
            const staticBuilder = (test: MathObjecReplaceTest) => {
                const factors = StringFormatter.parseFactorStrings(test.input).map(f => Factory.buildFactor(f));
                return Term.fromFactors(...factors)
            };

            const finder = (mo: Term) => mo.find(Variable, (m: Variable) => m.name === 'x' && m.sign === Sign.Positive);
            const replacement = () => new Variable('-z');

            const tests: MathObjecReplaceTest[] = [
                new MathObjecReplaceTest({ input: 'a*x*b', toStringBefore: 'a*x*b', toStringAfter: 'a*-z*b' }),
                new MathObjecReplaceTest({ input: 'x*a*b', toStringBefore: 'x*a*b', toStringAfter: '-z*a*b' }),
                new MathObjecReplaceTest({ input: 'x', toStringBefore: 'x', toStringAfter: '-z' }),
                new MathObjecReplaceTest({ input: 'a^x*b', toStringBefore: 'a^x*b', toStringAfter: 'a^-z*b' }),
                new MathObjecReplaceTest({ input: 'a/x', toStringBefore: '(a/x)', toStringAfter: '(a/-z)' }),
                new MathObjecReplaceTest({ input: 'a*c*b', toStringBefore: 'a*c*b', toStringAfter: 'a*c*b' }),
                new MathObjecReplaceTest({ input: '-x', toStringBefore: '-x', toStringAfter: '-x' }),
                new MathObjecReplaceTest({ input: 'a*(sin[a^(s-r*(p+(x/d)))])*b*x', toStringBefore: 'a*(sin[a^(s-r*(p+(x/d)))])*b*x', toStringAfter: 'a*(sin[a^(s-r*(p+(-z/d)))])*b*x' }),
            ];

            mathObjectReplaceTests('STANDARD Constructor', tests, standardBuilder, replacement, finder);
            mathObjectReplaceTests('STATIC Constructor', tests, staticBuilder, replacement, finder);
        });

        describe('FlipFirstFactorSign', () => {
            const standardBuilder = (test: TermFlipSignTest) => new Term(test.input);
            const staticBuilder = (test: TermFlipSignTest) => {
                const factors = StringFormatter.parseFactorStrings(test.input).map(f => Factory.buildFactor(f));
                return Term.fromFactors(...factors)
            };

            const tests: TermFlipSignTest[] = [
                new TermFlipSignTest({ input: 'a*x*b', toStringBefore: 'a*x*b', toStringAfter: '-a*x*b' }),
                new TermFlipSignTest({ input: '-a*x*b', toStringBefore: '-a*x*b', toStringAfter: 'a*x*b' }),
                new TermFlipSignTest({ input: '5', toStringBefore: '5', toStringAfter: '-5' }),
                new TermFlipSignTest({ input: '0', toStringBefore: '0', toStringAfter: '-0' }),
                new TermFlipSignTest({ input: '-0*a', toStringBefore: '-0*a', toStringAfter: '0*a' }),
                new TermFlipSignTest({ input: 'a/x', toStringBefore: '(a/x)', toStringAfter: '-(a/x)' }),
                new TermFlipSignTest({ input: 'a+x', toStringBefore: '(a+x)', toStringAfter: '-(a+x)' }),
                new TermFlipSignTest({ input: '-a^x', toStringBefore: '-a^x', toStringAfter: 'a^x' }),
            ];

            factorFlipSignTests('STANDARD Constructor', tests, standardBuilder);
            factorFlipSignTests('STATIC Constructor', tests, staticBuilder);
        });
    });
});
