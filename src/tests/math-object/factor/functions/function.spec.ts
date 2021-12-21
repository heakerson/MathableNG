import { Function } from "src/models/math-object/factor/functions/function.model";
import { FactorConstTest } from "../factor.spec";

export class FuncConstrTest extends FactorConstTest {
    fnString: string = '';
    inputParameters: any[] = [];

    constructor(props: Partial<FuncConstrTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export function functionConstructorTests<TFunction extends Function, TTest extends FuncConstrTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TFunction
): void {

    describe(`Function Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TFunction = builder(test);
                // console.log(mo);
                // console.log(mo.toString());
                expect(mo.functionString).toEqual(test.fnString);
            });
        });
    });
}