import { Type } from "@angular/core";
import { Expression } from "src/models/math-object/factor/expression.model";
import { E } from "src/models/math-object/factor/number/contant/e.model";
import { PI } from "src/models/math-object/factor/number/contant/pi.model";
import { Double } from "src/models/math-object/factor/number/double.model";
import { Integer } from "src/models/math-object/factor/number/integer.model";
import { Power } from "src/models/math-object/factor/power.model";
import { Rational } from "src/models/math-object/factor/rational.model";
import { Ln } from "src/models/math-object/factor/special-function/log-ln/ln.model";
import { Log } from "src/models/math-object/factor/special-function/log-ln/log.model";
import { Cos } from "src/models/math-object/factor/special-function/trig/cos.model";
import { Cot } from "src/models/math-object/factor/special-function/trig/cot.model";
import { Csc } from "src/models/math-object/factor/special-function/trig/csc.model";
import { Sec } from "src/models/math-object/factor/special-function/trig/sec.model";
import { Sin } from "src/models/math-object/factor/special-function/trig/sin.model";
import { Tan } from "src/models/math-object/factor/special-function/trig/tan.model";
import { Variable } from "src/models/math-object/factor/variable.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Factory } from "src/models/services/factory.service";

describe('Factory', () => {

    describe('buildFactor', () => {
        const inputs: { input: string, type: Type<MathObject>}[] = [
            { input: 'x', type: Variable },
            { input: 'bob', type: Variable },
            { input: '-bob', type: Variable },
            { input: '1', type: Integer },
            { input: '-1', type: Integer },
            { input: '1.2', type: Double },
            { input: '1.0', type: Double },
            { input: '1.', type: Double },
            { input: '.3', type: Double },
            { input: '-1.2', type: Double },
            { input: 'e', type: E },
            { input: 'E', type: E },
            { input: 'pi', type: PI },
            { input: 'PI', type: PI },
            { input: '(a)', type: Expression },
            { input: '(sin[x])', type: Expression },
            { input: '-(a)', type: Expression },
            { input: '-(a^b)', type: Expression },
            { input: 'a*b', type: Expression },
            { input: 'a*sin[log[x]]', type: Expression },
            { input: 'a-sin[log[x]]', type: Expression },
            { input: 'a+b', type: Expression },
            { input: 'a+b^tan[x]', type: Expression },
            { input: 'a^b^c', type: Power },
            { input: '(a)^(x)', type: Power },
            { input: '-(a)^(x)', type: Power },
            { input: 'a^x', type: Power },
            { input: '-a^-x', type: Power },
            { input: 'a/b', type: Rational },
            { input: 'a/b^c', type: Rational },
            { input: 'a^c/b', type: Rational },
            { input: 'a^-c/-b', type: Rational },
            { input: '(a)/(b)', type: Rational },
            { input: '(a/b)', type: Rational },
            { input: 'log[(a/b)]', type: Log },
            { input: 'LOG[(a/b)]', type: Log },
            { input: '-log[(a/b)]', type: Log },
            { input: '-log[(a/b), 10]', type: Log },
            { input: 'ln[(a/b)]', type: Ln },
            { input: 'lN[(a/b)]', type: Ln },
            { input: '-ln[(a/b)]', type: Ln },
            { input: 'Sin[x]', type: Sin },
            { input: '-sin[x*log[y]]', type: Sin },
            { input: 'Cos[x]', type: Cos },
            { input: '-cos[x*log[y]]', type: Cos },
            { input: 'Tan[x]', type: Tan },
            { input: '-tan[x*log[y]]', type: Tan },
            { input: 'Sec[x]', type: Sec },
            { input: '-sec[x*log[y]]', type: Sec },
            { input: 'Csc[x]', type: Csc },
            { input: '-csc[x*log[y]]', type: Csc },
            { input: 'Cot[x]', type: Cot },
            { input: '-cot[x*log[y]]', type: Cot },
        ];

        inputs.forEach((test) => {
            it(`Should create a factor from '${test.input}' of type '${test.type.name}'`, () => {
                const result = Factory.buildFactor(test.input);
                expect(result).toBeInstanceOf(test.type);
            });
        });
    });
});