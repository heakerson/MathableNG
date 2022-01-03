import { Sign } from "src/models/math-object/enums.model";
import { Variable } from "src/models/math-object/factor/variable.model";
import { ErrorCodes } from "src/models/services/error-handler.service";
import { mathObjectConstructorErrorTests, mathObjectConstructorTests, mathObjectReplaceTests, mathObjectTraverseTests } from "../math-object.spec";
import { factorConstructorTests, FactorConstTest, FactorReplaceTest, FactorTraverseTest } from "./factor.spec";

export class VariableConstTest extends FactorConstTest {
    name: string = '';

    constructor(props: Partial<VariableConstTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export function variableConstructorTests<TVariable extends Variable, TTest extends VariableConstTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TVariable
): void {

    describe(`Variable Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TVariable = builder(test);
                // console.log(mo);
                // console.log(mo.toString());
                expect(mo.name.toString()).toEqual(test.name);
                expect(mo.children).toEqual([]);
            });
        });
    });
}

describe('Variable', () => {

    describe('Constructor Tests', () => {
        const standardBuilder = (test: VariableConstTest) => new Variable(test.input);

        describe('Success', () => {
            const constructorTests: VariableConstTest[] = [
                new VariableConstTest({ input: 'a', children: [], toString: 'a', sign: Sign.Positive, name: 'a' }),
                new VariableConstTest({ input: 'X', children: [], toString: 'X', sign: Sign.Positive, name: 'X' }),
                new VariableConstTest({ input: '-a', children: [], toString: '-a', sign: Sign.Negative, name: 'a' }),
                new VariableConstTest({ input: '-X', children: [], toString: '-X', sign: Sign.Negative, name: 'X' }),
                new VariableConstTest({ input: '+a', children: [], toString: 'a', sign: Sign.Positive, name: 'a' }),
                new VariableConstTest({ input: 'bob', children: [], toString: 'bob', sign: Sign.Positive, name: 'bob' }),
                new VariableConstTest({ input: '-bob', children: [], toString: '-bob', sign: Sign.Negative, name: 'bob' }),
                new VariableConstTest({ input: '-WOW', children: [], toString: '-WOW', sign: Sign.Negative, name: 'WOW' }),
                new VariableConstTest({ input: 'WOW', children: [], toString: 'WOW', sign: Sign.Positive, name: 'WOW' }),
                new VariableConstTest({ input: 'W_W', children: [], toString: 'W_W', sign: Sign.Positive, name: 'W_W' }),
            ];
    
            mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            variableConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        });

        describe('Errors', () => {
            const errorTests: { input: string, errorCode: ErrorCodes }[] = [
                { input: '', errorCode: ErrorCodes.EMPTY },
                { input: '  ', errorCode: ErrorCodes.EMPTY },
                { input: '--b', errorCode: ErrorCodes.Variable.NON_ALPHA_NUMERIC_INPUT },
                { input: '-', errorCode: ErrorCodes.Variable.NON_ALPHA_NUMERIC_INPUT },
                { input: '-/b', errorCode: ErrorCodes.Variable.NON_ALPHA_NUMERIC_INPUT },
                { input: '+-b', errorCode: ErrorCodes.Variable.NON_ALPHA_NUMERIC_INPUT },
                { input: '--PI', errorCode: ErrorCodes.Variable.NON_ALPHA_NUMERIC_INPUT },
                { input: 'PI', errorCode: ErrorCodes.Variable.RESERVED_NAME },
                { input: '+PI', errorCode: ErrorCodes.Variable.RESERVED_NAME },
                { input: 'E', errorCode: ErrorCodes.Variable.RESERVED_NAME },
                { input: '-E', errorCode: ErrorCodes.Variable.RESERVED_NAME },
            ]

            const tests = errorTests.map(e => new VariableConstTest({ input: e.input, children: [], toString: '' }));

            mathObjectConstructorErrorTests('STANDARD Constructor', tests, standardBuilder);
        });

    });

    describe('Individual Methods', () => {

        describe('Traverse', () => {
            const standardBuilder = (test: FactorTraverseTest) => new Variable(test.input);

            const tests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: 'a', type: Variable, count: 1, firstChild: 'a', lastChild: 'a'}),
                new FactorTraverseTest({ input: '-a', type: Variable, count: 1, firstChild: '-a', lastChild: '-a'}),
                new FactorTraverseTest({ input: '-bob', type: Variable, count: 1, firstChild: '-bob', lastChild: '-bob'}),
            ];

            const childFirstTests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: 'a', type: Variable, count: 1, firstChild: 'a', lastChild: 'a'}),
                new FactorTraverseTest({ input: '-a', type: Variable, count: 1, firstChild: '-a', lastChild: '-a'}),
                new FactorTraverseTest({ input: '-bob', type: Variable, count: 1, firstChild: '-bob', lastChild: '-bob'}),
            ];

            mathObjectTraverseTests('Parent First STANDARD', tests, standardBuilder, false);
            mathObjectTraverseTests('Child First STANDARD', childFirstTests, standardBuilder, true);
        });

        describe('Replace', () => {
            const standardBuilder = (test: FactorReplaceTest) => new Variable(test.input);

            const finder = (variable: Variable) => variable.find(Variable, (m: Variable) => m.name === 'x' && m.sign === Sign.Positive);
            const replacement = () => new Variable('-z');

            const tests: FactorReplaceTest[] = [
                new FactorReplaceTest({ input: 'x', toStringBefore: 'x', toStringAfter: '-z' }),
                new FactorReplaceTest({ input: '-x', toStringBefore: '-x', toStringAfter: '-x' }),
            ];

            mathObjectReplaceTests('STANDARD Constructor', tests, standardBuilder, replacement, finder);
        });
    });
});