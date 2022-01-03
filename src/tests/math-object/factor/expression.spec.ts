import { Operators, Sign } from "src/models/math-object/enums.model";
import { Expression } from "src/models/math-object/factor/expression.model";
import { Log } from "src/models/math-object/factor/functions/log/log.model";
import { Power } from "src/models/math-object/factor/power.model";
import { Variable } from "src/models/math-object/factor/variable.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Term } from "src/models/math-object/term.model";
import { ErrorCodes } from "src/models/services/error-handler.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { baseMathObjectErrorTests, mathObjectConstructorErrorTests, mathObjectConstructorTests, mathObjectReplaceTests, mathObjectTraverseTests } from "../math-object.spec";
import { factorConstructorTests, FactorConstTest, factorFlipSignTests, FactorReplaceAndFlipSignTest, FactorTraverseTest } from "./factor.spec";

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
            const removedParenth = StringFormatter.stripSurroundingParenthesis(test.input);
            let termStrings = StringFormatter.parseTermStrings(removedParenth);

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

            return Expression.fromTerms(terms, test.sign, additionalOps);
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
                return Expression.fromTerms(terms, test.sign, test.additionalOperators);
            }

            const constructorTests: ExpressionConstTest[] = baseMathObjectErrorTests.map(ex => {
                return new ExpressionConstTest({ input: ex.input, errorCode: ex.errorCode, children: [], toString: '' });
            });
    
            mathObjectConstructorErrorTests('STANDARD Constructor', constructorTests, standardBuilder);
            mathObjectConstructorErrorTests('STATIC Constructor', staticErrorTests, staticErrorBuilder);
        });
    });

    describe('Individual Methods', () => {

        describe('Traverse', () => {
            const standardBuilder = (test: FactorTraverseTest) => new Expression(test.input);
            const staticBuilder = (test: FactorTraverseTest) => {
                const removedParenth = StringFormatter.stripSurroundingParenthesis(test.input);
                let termStrings = StringFormatter.parseTermStrings(removedParenth);
    
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
    
                return Expression.fromTerms(terms, test.sign, additionalOps);
            };

            const tests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: '(-a*b)', type: Expression, count: 1, firstChild: '(-a*b)', lastChild: '(-a*b)'}), // search type is root
                new FactorTraverseTest({ input: '(a*((x)+y)*b*(z-t))', type: Expression, count: 4, firstChild: '(a*((x)+y)*b*(z-t))', lastChild: '(z-t)'}), // search type is root
                new FactorTraverseTest({ input: '(a*log[x]*b*log[y])', type: Log, count: 2, firstChild: 'log[x,10]', lastChild: 'log[y,10]'}),
                new FactorTraverseTest({ input: 'a*b^1*b^x^y*5', type: Power, count: 3, firstChild: 'b^1', lastChild: 'x^y'}),
            ];

            const childFirstTests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: '(-a*b)', type: Expression, count: 1, firstChild: '(-a*b)', lastChild: '(-a*b)'}), // search type is root
                new FactorTraverseTest({ input: '(a*(-(x)+y)*b*(z-t))', type: Expression, count: 4, firstChild: '-(x)', lastChild: '(a*(-(x)+y)*b*(z-t))'}), // search type is root
                new FactorTraverseTest({ input: '(a*log[x]*b*log[y])', type: Log, count: 2, firstChild: 'log[x,10]', lastChild: 'log[y,10]'}),
                new FactorTraverseTest({ input: 'a*b^1*b^x^y*5', type: Power, count: 3, firstChild: 'b^1', lastChild: 'b^(x^y)'}),
            ];

            mathObjectTraverseTests('Parent First STANDARD', tests, standardBuilder, false);
            mathObjectTraverseTests('Parent First STATIC', tests, staticBuilder, false);
            mathObjectTraverseTests('Child First STANDARD', childFirstTests, standardBuilder, true);
            mathObjectTraverseTests('Child First STATIC', childFirstTests, staticBuilder, true);
        });

        describe('Replace', () => {
            const standardBuilder = (test: FactorReplaceAndFlipSignTest) => new Expression(test.input);
            const staticBuilder = (test: FactorReplaceAndFlipSignTest) => {
                const removedParenth = StringFormatter.stripSurroundingParenthesis(test.input);
                let termStrings = StringFormatter.parseTermStrings(removedParenth);
    
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
    
                return Expression.fromTerms(terms, test.sign, additionalOps);
            };

            const finder = (mo: MathObject) => mo.find(Variable, (m: Variable) => m.name === 'x' && m.sign === Sign.Positive);
            const replacement = () => new Variable('-z');

            const tests: FactorReplaceAndFlipSignTest[] = [
                new FactorReplaceAndFlipSignTest({ input: 'a^x', toStringBefore: '(a^x)', toStringAfter: '(a^-z)' }),
                new FactorReplaceAndFlipSignTest({ input: 'x^a', toStringBefore: '(x^a)', toStringAfter: '(-z^a)' }),
                new FactorReplaceAndFlipSignTest({ input: 'a^b', toStringBefore: '(a^b)', toStringAfter: '(a^b)' }),
                new FactorReplaceAndFlipSignTest({ input: 'g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x)', toStringBefore: '(g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x))', toStringAfter: '(g^(a*(sin[a^(s-r*(p+(-z/d)))])*b*x))' }),
                new FactorReplaceAndFlipSignTest({ input: 'x', toStringBefore: '(x)', toStringAfter: '(-z)' }),
                new FactorReplaceAndFlipSignTest({ input: '-(x)', toStringBefore: '-(x)', toStringAfter: '-(-z)', sign: Sign.Negative }),
                new FactorReplaceAndFlipSignTest({ input: 'a+x', toStringBefore: '(a+x)', toStringAfter: '(a-z)' }),
            ];

            mathObjectReplaceTests('STANDARD Constructor', tests, standardBuilder, replacement, finder);
            mathObjectReplaceTests('STATIC Constructor', tests, staticBuilder, replacement, finder);

            const extraOpFinder = (mo: MathObject) => mo.find(Variable, (m: Variable) => m.name === 'x' && m.sign === Sign.Negative);
            const extraOpsTests: FactorReplaceAndFlipSignTest[] = [
                new FactorReplaceAndFlipSignTest({ input: 'a+-x', toStringBefore: '(a+-x)', toStringAfter: '(a+-z)' }),
                new FactorReplaceAndFlipSignTest({ input: 'a--x', toStringBefore: '(a--x)', toStringAfter: '(a--z)' }),
            ];

            mathObjectReplaceTests('STANDARD Constructor - Extra Ops', extraOpsTests, standardBuilder, replacement, extraOpFinder);
            mathObjectReplaceTests('STATIC Constructor - Extra Ops', extraOpsTests, staticBuilder, replacement, extraOpFinder);

            const replacement2 = () => new Variable('z');
            const extraOpsTestsDiffSign: FactorReplaceAndFlipSignTest[] = [
                new FactorReplaceAndFlipSignTest({ input: 'a+-x', toStringBefore: '(a+-x)', toStringAfter: '(a+z)' }),
                new FactorReplaceAndFlipSignTest({ input: 'a--x', toStringBefore: '(a--x)', toStringAfter: '(a-z)' }),
            ];

            mathObjectReplaceTests('STANDARD Constructor - Extra Ops, different replacement sign', extraOpsTestsDiffSign, standardBuilder, replacement2, extraOpFinder);
            mathObjectReplaceTests('STATIC Constructor - Extra Ops, different replacement sign', extraOpsTestsDiffSign, staticBuilder, replacement2, extraOpFinder);
        });

        describe('FlipSign', () => {
            const standardBuilder = (test: FactorReplaceAndFlipSignTest) => new Expression(test.input);
            const staticBuilder = (test: FactorReplaceAndFlipSignTest) => {
                const removedParenth = StringFormatter.stripSurroundingParenthesis(test.input);
                let termStrings = StringFormatter.parseTermStrings(removedParenth);
    
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
    
                return Expression.fromTerms(terms, test.sign, additionalOps);
            };

            const tests: FactorReplaceAndFlipSignTest[] = [
                new FactorReplaceAndFlipSignTest({ input: 'a^x', toStringBefore: '(a^x)', toStringAfter: '-(a^x)' }),
                new FactorReplaceAndFlipSignTest({ input: 'a+b', toStringBefore: '(a+b)', toStringAfter: '-(a+b)' }),
                new FactorReplaceAndFlipSignTest({ input: '(a+b)', toStringBefore: '(a+b)', toStringAfter: '-(a+b)' }),
                new FactorReplaceAndFlipSignTest({ input: 'g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x)', toStringBefore: '(g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x))', toStringAfter: '-(g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x))' }),
                new FactorReplaceAndFlipSignTest({ input: '-(x)', toStringBefore: '-(x)', toStringAfter: '(x)', sign: Sign.Negative }),
                new FactorReplaceAndFlipSignTest({ input: 'a+-x', toStringBefore: '(a+-x)', toStringAfter: '-(a+-x)' }),
                new FactorReplaceAndFlipSignTest({ input: '-(a+-x)', toStringBefore: '-(a+-x)', toStringAfter: '(a+-x)', sign: Sign.Negative }),
                new FactorReplaceAndFlipSignTest({ input: 'a--x', toStringBefore: '(a--x)', toStringAfter: '-(a--x)' }),
                new FactorReplaceAndFlipSignTest({ input: 'a+-x', toStringBefore: '(a+-x)', toStringAfter: '-(a+-x)' }),
                new FactorReplaceAndFlipSignTest({ input: 'a--x', toStringBefore: '(a--x)', toStringAfter: '-(a--x)' }),
                new FactorReplaceAndFlipSignTest({ input: '-(a+-x)', toStringBefore: '-(a+-x)', toStringAfter: '(a+-x)', sign: Sign.Negative }),
                new FactorReplaceAndFlipSignTest({ input: '-(a--x)', toStringBefore: '-(a--x)', toStringAfter: '(a--x)', sign: Sign.Negative }),
            ];

            factorFlipSignTests('STANDARD Constructor', tests, standardBuilder);
            factorFlipSignTests('STATIC Constructor', tests, staticBuilder);
        });
    });
});
