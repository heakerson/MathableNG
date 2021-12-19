import { Sign } from "src/models/math-object/enums.model";
import { Factor } from "src/models/math-object/factor/factor.model";

export function factorConstructorTests<TFactor extends Factor>(
    additionalLabel: string,
    tests: { input: string, children: string[], toString: string, sign: Sign }[],
    builder: (input: string) => TFactor
): void {

    describe(`Factor Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TFactor = builder(test.input);
                // console.log(mo);
                expect(mo.sign).toEqual(test.sign);
            });
        });
    });
}