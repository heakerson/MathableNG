import { Sign } from "src/models/math-object/enums.model";
import { Expression } from "src/models/math-object/factor/expression.model";
import { Ln } from "src/models/math-object/factor/functions/log/ln.model";
import { PI } from "src/models/math-object/factor/number/contant/pi.model";
import { Power } from "src/models/math-object/factor/power.model";
import { ErrorCodes } from "src/models/services/error-handler.service";
import { Factory } from "src/models/services/factory.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { baseMathObjectErrorTests, mathObjectConstructorErrorTests, mathObjectConstructorTests, mathObjectTraverseTests } from "../math-object.spec";
import { factorConstructorTests, FactorConstTest, FactorTraverseTest } from "./factor.spec";

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

    describe('Constructor Tests', () => {
            
        const standardBuilder = (test: FactorConstTest) => new Power(test.input);
        const staticBuilder = (test: FactorConstTest) => {
            const parsed = StringFormatter.parsePowerFactor(test.input);
            return Power.fromFactors(Factory.buildFactor(parsed.base), Factory.buildFactor(parsed.exponent));
        };

        describe('Success', () => {
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
    
            mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            powerConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            powerConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
        });

        describe('Errors', () => {
            const errorTests: { input: string, errorCode: ErrorCodes }[] = [
                { input: '', errorCode: ErrorCodes.EMPTY },
                { input: '  ', errorCode: ErrorCodes.EMPTY },
                { input: 'a', errorCode: ErrorCodes.Power.MISSING_BASE_OR_EXPONENT },
                { input: '-a', errorCode: ErrorCodes.Power.MISSING_BASE_OR_EXPONENT },
                { input: 'a^', errorCode: ErrorCodes.Power.MISSING_BASE_OR_EXPONENT },
                { input: '-a^', errorCode: ErrorCodes.Power.MISSING_BASE_OR_EXPONENT },
                { input: '^b', errorCode: ErrorCodes.Power.MISSING_BASE_OR_EXPONENT },
                { input: '^-b', errorCode: ErrorCodes.Power.MISSING_BASE_OR_EXPONENT },
            ]

            const tests = errorTests.map(e => new FactorConstTest({ input: e.input, children: [], toString: '' }));
            const baseTestsBaseFactor = baseMathObjectErrorTests.map(e => new FactorConstTest({ input: `${e.input}^x`, children: [], toString: '' }));
            const baseTestsExpFactor = baseMathObjectErrorTests.map(e => new FactorConstTest({ input: `x^${e.input}`, children: [], toString: '' }));

            mathObjectConstructorErrorTests('STANDARD Constructor', [...tests, ...baseTestsBaseFactor, ...baseTestsExpFactor], standardBuilder);
        });

    });

    describe('Individual Methods', () => {

        describe('Traverse', () => {
            const standardBuilder = (test: FactorTraverseTest) => new Power(test.input);
            const staticBuilder = (test: FactorTraverseTest) => {
                const parsed = StringFormatter.parsePowerFactor(test.input);
                return Power.fromFactors(Factory.buildFactor(parsed.base), Factory.buildFactor(parsed.exponent));
            };

            const tests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: '-a^b', type: Power, count: 1, firstChild: '-a^b', lastChild: '-a^b'}), // search type is root
                new FactorTraverseTest({ input: '-a^(b^(c+(x^y)))', type: Power, count: 3, firstChild: '-a^(b^(c+(x^y)))', lastChild: 'x^y'}), // search type is root
                new FactorTraverseTest({ input: '-(x^(a-b))^(y)', type: Expression, count: 3, firstChild: '-(x^(a-b))', lastChild: '(y)'}),
                new FactorTraverseTest({ input: '-PI^(b+x+PI)', type: PI, count: 2, firstChild: '-PI', lastChild: 'PI'}),
                new FactorTraverseTest({ input: '-ln[PI]^(b+x+ln[PI])', type: Ln, count: 2, firstChild: '-ln[PI]', lastChild: 'ln[PI]'}),
            ];

            const childFirstTests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: '-a^b', type: Power, count: 1, firstChild: '-a^b', lastChild: '-a^b'}), // search type is root
                new FactorTraverseTest({ input: '-a^(b^(c+(x^y)))', type: Power, count: 3, firstChild: 'x^y', lastChild: '-a^(b^(c+(x^y)))'}), // search type is root
                new FactorTraverseTest({ input: '-(x^(a-b))^(y)', type: Expression, count: 3, firstChild: '(a-b)', lastChild: '(y)'}),
                new FactorTraverseTest({ input: '-PI^(b+x+PI)', type: PI, count: 2, firstChild: '-PI', lastChild: 'PI'}),
                new FactorTraverseTest({ input: '-ln[PI]^(b+x+ln[PI])', type: Ln, count: 2, firstChild: '-ln[PI]', lastChild: 'ln[PI]'}),
            ];

            mathObjectTraverseTests('Parent First STANDARD', tests, standardBuilder, false);
            mathObjectTraverseTests('Parent First STATIC', tests, staticBuilder, false);
            mathObjectTraverseTests('Child First STANDARD', childFirstTests, standardBuilder, true);
            mathObjectTraverseTests('Child First STATIC', childFirstTests, staticBuilder, true);
        });
    });
});
