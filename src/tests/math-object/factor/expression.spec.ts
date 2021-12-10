import { Expression } from "src/models/math-object/factor/expression.model";

describe('Expression', () => {

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });

    describe('Constructor', () => {
        const inputs: { input: string, toString: string }[] = [
            { input: 'a+b', toString: '(a+b)' },
            { input: ' a +b', toString: '(a+b)' },
            { input: '(a+b)', toString: '(a+b)' },
            { input: '-(a+b)', toString: '-(a+b)' },
            { input: '(a+  b) ^(x)', toString: '((a+b)^(x))' },
            { input: '-(a+b)^(x)', toString: '(-(a+b)^(x))' },
            { input: '-(a+b)^-(x)', toString: '(-(a+b)^-(x))' },
            { input: '(a+b)(x+y)', toString: '((a+b)*(x+y))' },
            { input: '(a+b)  -(x+y)', toString: '((a+b)-(x+y))' },
            { input: '-(a+b)(x+y)', toString: '(-(a+b)*(x+y))' },
            { input: '-(a+b)/(x+y)', toString: '(-(a+b)/(x+y))' },
            { input: 'a/b', toString: '(a/b)' },
            { input: '-a/b', toString: '(-a/b)' },
            { input: '-a^b', toString: '(-a^b)' },
        ];

        inputs.forEach((test) => {
            const mo = new Expression(test.input);

            fit(`Should transform '${test.input}' to '${test.toString}'`, () => {
                expect(mo.toString()).toEqual(test.toString);
            });
        });
    });
});