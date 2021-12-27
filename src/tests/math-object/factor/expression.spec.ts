import { Operators, Sign } from "src/models/math-object/enums.model";
import { Expression } from "src/models/math-object/factor/expression.model";
import { Term } from "src/models/math-object/term.model";
import { ErrorCodes } from "src/models/services/error-handler.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { baseMathObjectErrorTests, mathObjectConstructorErrorTests, mathObjectConstructorTests } from "../math-object.spec";
import { factorConstructorTests, FactorConstTest } from "./factor.spec";

export class ExpressionConstTest extends FactorConstTest {
    additionalOperators?: { termIndex: number, addtionalOperator: Operators }[]

    constructor(props: Partial<ExpressionConstTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export function expressionConstructorTests<TExpression extends Expression, TTest extends ExpressionConstTest>(
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
        const standardBuilder = (test: ExpressionConstTest) => new Expression(test.input);
        const staticBuilder = (test: ExpressionConstTest) => {
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
            const constructorTests: ExpressionConstTest[] = [
                new ExpressionConstTest({ input: '(a-b)', children: ['a', '-b'], toString: '(a-b)', sign: Sign.Positive }),
                new ExpressionConstTest({ input: '-(a-b)', children: ['a', '-b'], toString: '-(a-b)', sign: Sign.Negative }),
                new ExpressionConstTest({ input: '-(a+b)', children: ['a', 'b'], toString: '-(a+b)', sign: Sign.Negative }),
                new ExpressionConstTest({ input: '(a+b)', children: ['a', 'b'], toString: '(a+b)', sign: Sign.Positive }),
                new ExpressionConstTest({ input: ' a +b', children: ['a', 'b'], toString: '(a+b)', sign: Sign.Positive }),
                new ExpressionConstTest({ input: ' -a +b', children: ['-a', 'b'], toString: '(-a+b)', sign: Sign.Positive }),
                new ExpressionConstTest({ input: '(a+  b) ^(x)', children: ['(a+b)^(x)'], toString: '((a+b)^(x))', sign: Sign.Positive }),
                new ExpressionConstTest({ input: '-(a+  b) ^(x)', children: ['-(a+b)^(x)'], toString: '(-(a+b)^(x))', sign: Sign.Positive }),
                new ExpressionConstTest({ input: '-(a+b)^-(x)', children: ['-(a+b)^-(x)'], toString: '(-(a+b)^-(x))', sign: Sign.Positive }),
                new ExpressionConstTest({ input: '-(a+-b)', children: ['a', '-b'], toString: '-(a+-b)', sign: Sign.Negative }),
                new ExpressionConstTest({ input: '-(a--b)', children: ['a', '-b'], toString: '-(a--b)', sign: Sign.Negative }),
                new ExpressionConstTest({ input: 'a--b', children: ['a', '-b'], toString: '(a--b)', sign: Sign.Positive }),
                new ExpressionConstTest({ input: '(a+b)(x+y)', children: ['(a+b)*(x+y)'], toString: '((a+b)*(x+y))', sign: Sign.Positive }),
                new ExpressionConstTest({ input: '(a+b)(x+y)-sin[a^b]', children: ['(a+b)*(x+y)', '-sin[a^b]'], toString: '((a+b)*(x+y)-sin[a^b])', sign: Sign.Positive }),
                new ExpressionConstTest({ input: '-(a+b)^(x)', toString: '(-(a+b)^(x))', children: ['-(a+b)^(x)'], sign: Sign.Positive }),
                new ExpressionConstTest({ input: '-(a+b)^-(x)', toString: '(-(a+b)^-(x))', children: ['-(a+b)^-(x)'], sign: Sign.Positive }),
                new ExpressionConstTest({ input: '(a+b)  -(x+y)', toString: '((a+b)-(x+y))', children: ['(a+b)', '-(x+y)'], sign: Sign.Positive }),
                new ExpressionConstTest({ input: '-(a+b)(x+y)', toString: '(-(a+b)*(x+y))', children: ['-(a+b)*(x+y)'], sign: Sign.Positive }),
                new ExpressionConstTest({ input: '-(-(a+b)(x+y))', toString: '-(-(a+b)*(x+y))', children: ['-(a+b)*(x+y)'], sign: Sign.Negative }),
                new ExpressionConstTest({ input: '-(a+b)/(x+y)', toString: '((-(a+b)/(x+y)))', children: ['(-(a+b)/(x+y))'], sign: Sign.Positive }),
                new ExpressionConstTest({ input: 'a/b', toString: '((a/b))', children: ['(a/b)'], sign: Sign.Positive }),
                new ExpressionConstTest({ input: '-a/b', toString: '((-a/b))', children: ['(-a/b)'], sign: Sign.Positive }),
                new ExpressionConstTest({ input: '-a^b', toString: '(-a^b)', children: ['-a^b'], sign: Sign.Positive }),
            ];
    
            mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            expressionConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            expressionConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
        });

        describe('Errors', () => {
            const staticErrorTestInputs: { children: string[], errorCode: ErrorCodes, additionalOperators?: { termIndex: number, addtionalOperator: Operators }[] }[] = [
                { children: [''], errorCode: ErrorCodes.EMPTY },
                { children: ['a', 'b'], additionalOperators: [{ termIndex: -1, addtionalOperator: Operators.Subtraction }], errorCode: ErrorCodes.Expression.INVALID_ADDITIONAL_OPERATOR_INDEX },
                { children: ['a', 'b'], additionalOperators: [{ termIndex: -5, addtionalOperator: Operators.Subtraction }], errorCode: ErrorCodes.Expression.INVALID_ADDITIONAL_OPERATOR_INDEX },
                { children: ['a', 'b'], additionalOperators: [{ termIndex: 1, addtionalOperator: Operators.Multiplication }], errorCode: ErrorCodes.Expression.INVALID_ADDITIONAL_OPERATOR },
                { children: ['a', 'b'], additionalOperators: [{ termIndex: 1, addtionalOperator: Operators.Division }], errorCode: ErrorCodes.Expression.INVALID_ADDITIONAL_OPERATOR },
                { children: ['a', 'b'], additionalOperators: [{ termIndex: 1, addtionalOperator: Operators.Addition }], errorCode: ErrorCodes.MALFORMED_OPERATORS },
                { children: ['a', 'b'], additionalOperators: [{ termIndex: 1, addtionalOperator: Operators.Subtraction }], errorCode: ErrorCodes.MALFORMED_OPERATORS },
            ];

            const staticErrorTests = staticErrorTestInputs.map(ex => {
                return new ExpressionConstTest({ input: '', errorCode: ex.errorCode as number, children: ex.children, toString: '', additionalOperators: ex.additionalOperators });
            });

            const staticErrorBuilder = (test: ExpressionConstTest) => {
                const terms = test.children.map(t => new Term(t));
                return Expression.fromTerms(terms, test.additionalOperators);
            }

            const constructorTests: ExpressionConstTest[] = baseMathObjectErrorTests.map(ex => {
                return new ExpressionConstTest({ input: ex.input, errorCode: ex.errorCode, children: [], toString: '' });
            });
    
            mathObjectConstructorErrorTests('STANDARD Constructor', constructorTests, standardBuilder);
            mathObjectConstructorErrorTests('STATIC Constructor', staticErrorTests, staticErrorBuilder);
        });
    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});
