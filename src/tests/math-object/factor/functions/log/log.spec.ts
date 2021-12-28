import { Sign } from "src/models/math-object/enums.model";
import { Log } from "src/models/math-object/factor/functions/log/log.model";
import { Factory } from "src/models/services/factory.service";
import { baseMathObjectErrorTests, mathObjectConstructorErrorTests, mathObjectConstructorTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests } from "../../factor.spec";
import { FuncConstrTest, functionConstructorTests } from "../function.spec";

export class LogConstrTest extends FuncConstrTest {
    base?: string = undefined;

    constructor(props: Partial<LogConstrTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export function logConstructorTests<TFunction extends Log, TTest extends LogConstrTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TFunction
): void {

    describe(`Log Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TFunction = builder(test);
                // console.log(mo);
                // console.log(mo.toString());
                expect(mo.contents.toString()).toEqual(test.children[0]);
                expect(mo.base.toString()).toEqual(test.children[1]);
            });
        });
    });
}

describe('Log', () => {

    describe('Constructor Tests', () => {
        const standardBuilder = (test: LogConstrTest) => new Log(test.input, test.sign, test.base);
        const staticBuilder = (test: LogConstrTest) => {
            const contents = Factory.buildFactor(test.input);
            const base: any = test.base ? Factory.buildFactor(test.base) : undefined;
            return Log.fromFactors(contents, test.sign, base);
        };

        describe('Success', () => {
            const constructorTests: LogConstrTest[] = [
                new LogConstrTest({ input: 'a', base: '10', children: ['a', '10'], fnString: 'log', toString: 'log[a,10]', sign: Sign.Positive }),
                new LogConstrTest({ input: '-a', base: 'x', children: ['-a', 'x'], fnString: 'log', toString: 'log[-a,x]', sign: Sign.Positive }),
                new LogConstrTest({ input: '-a+ c ', children: ['(-a+c)', '10'], fnString: 'log', toString: '-log[(-a+c),10]', sign: Sign.Negative }),
                new LogConstrTest({ input: '(-a+ c) ', base: 'a+b', children: ['(-a+c)', '(a+b)'], fnString: 'log', toString: '-log[(-a+c),(a+b)]', sign: Sign.Negative }),
                new LogConstrTest({ input: 'a/b', base: 'E', children: ['(a/b)', 'E'], fnString: 'log', toString: 'log[(a/b),E]', sign: Sign.Positive }),
                new LogConstrTest({ input: 'sin[x+t/-v]', children: ['sin[(x+(t/-v))]', '10'], fnString: 'log', toString: '-log[sin[(x+(t/-v))],10]', sign: Sign.Negative }),
            ];
    
            mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            functionConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            functionConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            logConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            logConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
        });

        describe('Errors', () => {
            const baseTestsContents = baseMathObjectErrorTests.map(e => new LogConstrTest({ input: `${e.input}`, children: [], toString: '' }));
            const baseTestsBase = baseMathObjectErrorTests.map(e => new LogConstrTest({ input: `x`, base: e.input, children: [], toString: '' }));

            mathObjectConstructorErrorTests('STANDARD Constructor', [...baseTestsContents, ...baseTestsBase], standardBuilder);
        });
    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});