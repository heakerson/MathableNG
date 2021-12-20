import { Sign } from "src/models/math-object/enums.model";
import { Expression } from "src/models/math-object/factor/expression.model";
import { Term } from "src/models/math-object/term.model";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { mathObjectConstructorTests } from "../math-object.spec";
import { factorConstructorTests, FactorConstTest } from "./factor.spec";

export function expressionConstructorTests<TExpression extends Expression, TTest extends FactorConstTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TExpression
): void {

    describe(`Expression Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TExpression = builder(test);
                // console.log(mo);
                // console.log(mo.toString());
                expect(mo.terms.map(c => c.toString())).toEqual(test.children);
                expect(mo.termCount).toEqual(test.children.length);
                expect(mo.isSingleTerm).toEqual(test.children.length === 1);
            });
        });
    });
}

describe('Expression', () => {

    describe('Constructor', () => {
        const constructorTests: FactorConstTest[] = [
            new FactorConstTest({ input: '(a-b)', children: ['a', '-b'], toString: '(a-b)', sign: Sign.Positive }),
            new FactorConstTest({ input: '-(a-b)', children: ['a', '-b'], toString: '-(a-b)', sign: Sign.Negative }),
            new FactorConstTest({ input: '-(a+b)', children: ['a', 'b'], toString: '-(a+b)', sign: Sign.Negative }),
            new FactorConstTest({ input: '(a+b)', children: ['a', 'b'], toString: '(a+b)', sign: Sign.Positive }),
            new FactorConstTest({ input: ' a +b', children: ['a', 'b'], toString: '(a+b)', sign: Sign.Positive }),
            new FactorConstTest({ input: ' -a +b', children: ['-a', 'b'], toString: '(-a+b)', sign: Sign.Positive }),
            new FactorConstTest({ input: '(a+  b) ^(x)', children: ['(a+b)^(x)'], toString: '((a+b)^(x))', sign: Sign.Positive }),
            new FactorConstTest({ input: '-(a+  b) ^(x)', children: ['-(a+b)^(x)'], toString: '(-(a+b)^(x))', sign: Sign.Positive }),
            new FactorConstTest({ input: '-(a+b)^-(x)', children: ['-(a+b)^-(x)'], toString: '(-(a+b)^-(x))', sign: Sign.Positive }),
            new FactorConstTest({ input: '-(a+-b)', children: ['a', '-b'], toString: '-(a+-b)', sign: Sign.Negative }),
            new FactorConstTest({ input: '-(a--b)', children: ['a', '-b'], toString: '-(a--b)', sign: Sign.Negative }),
            new FactorConstTest({ input: 'a--b', children: ['a', '-b'], toString: '(a--b)', sign: Sign.Positive }),
            new FactorConstTest({ input: '(a+b)(x+y)', children: ['(a+b)*(x+y)'], toString: '((a+b)*(x+y))', sign: Sign.Positive }),
            new FactorConstTest({ input: '(a+b)(x+y)-sin[a^b]', children: ['(a+b)*(x+y)', '-sin[a^b]'], toString: '((a+b)*(x+y)-sin[a^b])', sign: Sign.Positive }),
            // { input: '-(a+b)^(x)', toString: '(-(a+b)^(x))' },
            // { input: '-(a+b)^-(x)', toString: '(-(a+b)^-(x))' },
            // { input: '(a+b)  -(x+y)', toString: '((a+b)-(x+y))' },
            // { input: '-(a+b)(x+y)', toString: '(-(a+b)*(x+y))' },
            // { input: '-(a+b)/(x+y)', toString: '(-(a+b)/(x+y))' },
            // { input: 'a/b', toString: '(a/b)' },
            // { input: '-a/b', toString: '(-a/b)' },
            // { input: '-a^b', toString: '(-a^b)' },
        ];

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, (test: FactorConstTest) => new Expression(test.input));
        mathObjectConstructorTests('STATIC Constructor', constructorTests, (test: FactorConstTest) => {
            const terms = StringFormatter.parseTermStrings(test.input).map(t => new Term(t));
            return Expression.fromTerms(...terms);
        });

        factorConstructorTests('STANDARD Constructor', constructorTests, (test: FactorConstTest) => new Expression(test.input));
        factorConstructorTests('STATIC Constructor', constructorTests, (test: FactorConstTest) => {
            const terms = StringFormatter.parseTermStrings(test.input).map(t => new Term(t));
            return Expression.fromTerms(...terms);
        });

        expressionConstructorTests('STANDARD Constructor', constructorTests, (test: FactorConstTest) => new Expression(test.input));
        expressionConstructorTests('STATIC Constructor', constructorTests, (test: FactorConstTest) => {
            const terms = StringFormatter.parseTermStrings(test.input).map(t => new Term(t));
            return Expression.fromTerms(...terms);
        });

    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});