import { Sign } from "src/models/math-object/enums.model";
import { Variable } from "src/models/math-object/factor/variable.model";
import { mathObjectConstructorTests } from "../math-object.spec";
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
            });
        });
    });
}

describe('Variable', () => {

    describe('Constructor', () => {
        const constructorTests: VariableConstTest[] = [
            new VariableConstTest({ input: 'a', children: [], toString: 'a', sign: Sign.Positive, name: 'a' }),
            new VariableConstTest({ input: '-a', children: [], toString: '-a', sign: Sign.Negative, name: 'a' }),
            new VariableConstTest({ input: 'bob', children: [], toString: 'bob', sign: Sign.Positive, name: 'bob' }),
            new VariableConstTest({ input: '-bob', children: [], toString: '-bob', sign: Sign.Negative, name: 'bob' }),
        ];

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, (test: VariableConstTest) => new Variable(test.input));
        factorConstructorTests('STANDARD Constructor', constructorTests, (test: VariableConstTest) => new Variable(test.input));
        variableConstructorTests('STANDARD Constructor', constructorTests, (test: VariableConstTest) => new Variable(test.input));

    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});