import { Operators, Sign } from "src/models/math-object/enums.model";
import { Expression } from "src/models/math-object/factor/expression.model";
import { Term } from "src/models/math-object/term.model";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { baseMathObjectErrorTests, mathObjectConstructorErrorTests, mathObjectConstructorTests } from "../math-object.spec";
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

    describe('Constructor Tests', () => {
        const standardBuilder = (test: FactorConstTest) => new Expression(test.input);
        const staticBuilder = (test: FactorConstTest) => {
            let termStrings = StringFormatter.parseTermStrings(test.input);

            const additionalOps: { termIndex: number, addtionalOperator: Operators }[] = [];
            termStrings = termStrings.map((termString, i) => {
                if (termString.length > 2) {
                    const prefix = termString.substring(0, 2);
    
                    if (prefix === '--') {
                        additionalOps.push({ termIndex: i, addtionalOperator: Operators.Subtraction});
                        return termString.substring(1);
                    } else if (prefix === '+-') {
                        additionalOps.push({ termIndex: i, addtionalOperator: Operators.Addition});
                        return termString.substring(1);
                    }
                }

                return termString;
            });

            const terms = termStrings.map(t => new Term(t));

            return Expression.fromTerms(terms, additionalOps);
        };

        describe('Success', () => {
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
                new FactorConstTest({ input: '-(a+b)^(x)', toString: '(-(a+b)^(x))', children: ['-(a+b)^(x)'], sign: Sign.Positive }),
                new FactorConstTest({ input: '-(a+b)^-(x)', toString: '(-(a+b)^-(x))', children: ['-(a+b)^-(x)'], sign: Sign.Positive }),
                new FactorConstTest({ input: '(a+b)  -(x+y)', toString: '((a+b)-(x+y))', children: ['(a+b)', '-(x+y)'], sign: Sign.Positive }),
                new FactorConstTest({ input: '-(a+b)(x+y)', toString: '(-(a+b)*(x+y))', children: ['-(a+b)*(x+y)'], sign: Sign.Positive }),
                new FactorConstTest({ input: '-(-(a+b)(x+y))', toString: '-(-(a+b)*(x+y))', children: ['-(a+b)*(x+y)'], sign: Sign.Negative }),
                new FactorConstTest({ input: '-(a+b)/(x+y)', toString: '((-(a+b)/(x+y)))', children: ['(-(a+b)/(x+y))'], sign: Sign.Positive }),
                new FactorConstTest({ input: 'a/b', toString: '((a/b))', children: ['(a/b)'], sign: Sign.Positive }),
                new FactorConstTest({ input: '-a/b', toString: '((-a/b))', children: ['(-a/b)'], sign: Sign.Positive }),
                new FactorConstTest({ input: '-a^b', toString: '(-a^b)', children: ['-a^b'], sign: Sign.Positive }),
            ];
    
            mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            expressionConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            expressionConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
        });

        describe('Errors', () => {
            const constructorTests: FactorConstTest[] = baseMathObjectErrorTests.map(ex => {
                return new FactorConstTest({ input: ex.input, errorCode: ex.errorCode, children: [], toString: '' });
            })
    
            mathObjectConstructorErrorTests('STANDARD Constructor', constructorTests, standardBuilder);
        });
    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});