import { Sign } from "src/models/math-object/enums.model";
import { Variable } from "src/models/math-object/factor/variable.model";
import { ErrorCodes } from "src/models/services/error-handler.service";
import { mathObjectConstructorErrorTests, mathObjectConstructorTests } from "../math-object.spec";
import { factorConstructorTests, FactorConstTest } from "./factor.spec";

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
                new VariableConstTest({ input: '-a', children: [], toString: '-a', sign: Sign.Negative, name: 'a' }),
                new VariableConstTest({ input: '+a', children: [], toString: 'a', sign: Sign.Positive, name: 'a' }),
                new VariableConstTest({ input: 'bob', children: [], toString: 'bob', sign: Sign.Positive, name: 'bob' }),
                new VariableConstTest({ input: '-bob', children: [], toString: '-bob', sign: Sign.Negative, name: 'bob' }),
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

        describe('', () => {

        });
    });
});