import { Sign, TrigTypes, LogTypes, Constants } from "../../math-object/enums.model";
import { Expression } from "../../math-object/factor/expression.model";
import { Factor } from "../../math-object/factor/factor.model";
import { E } from "../../math-object/factor/number/contant/e.model";
import { PI } from "../../math-object/factor/number/contant/pi.model";
import { Double } from "../../math-object/factor/number/double.model";
import { Integer } from "../../math-object/factor/number/integer.model";
import { Power } from "../../math-object/factor/power.model";
import { Rational } from "../../math-object/factor/rational.model";
import { Ln } from "../../math-object/factor/functions/log/ln.model";
import { Log } from "../../math-object/factor/functions/log/log.model";
import { Cos } from "../../math-object/factor/functions/trig/cos.model";
import { Cot } from "../../math-object/factor/functions/trig/cot.model";
import { Csc } from "../../math-object/factor/functions/trig/csc.model";
import { Sec } from "../../math-object/factor/functions/trig/sec.model";
import { Sin } from "../../math-object/factor/functions/trig/sin.model";
import { Tan } from "../../math-object/factor/functions/trig/tan.model";
import { Variable } from "../../math-object/factor/variable.model";
import { StringFormatter } from "./string-formatter.service";
import { MathObject } from "src/models/math-object/math-object.model";
import { Term } from "src/models/math-object/term.model";

export class Factory {

    public static buildMathObject(type: string, input: string): MathObject {
        switch (type) {
            case 'Term':
                return new Term(input);
            default:
                return this.buildFactor(input);
        }
    }

    public static buildFactor(input: string): Factor {
        const multipleTerms = StringFormatter.parseTermStrings(input).length > 1;
        if (multipleTerms) {
            return new Expression(input)
        }

        const multipleFactors = StringFormatter.parseFactorStrings(input).length > 1;
        if (multipleFactors) {
            return new Expression(input);
        }

        const sign = input[0] === '-' ? Sign.Negative : Sign.Positive;

        if (sign == Sign.Negative) {
            input = input.substring(1);
        }

        const rationalParsed = StringFormatter.parseRationalExpressions(input);
        const isRational = !!rationalParsed.denominator && !!rationalParsed.numerator;

        if (isRational) {
            return new Rational(`${sign}${input}`);
        }

        const powerParsed = StringFormatter.parsePowerFactor(input);
        const isPower = !!powerParsed.base && !!powerParsed.exponent;

        if (isPower) {
            return new Power(`${sign}${input}`);
        }

        const isExpression = input[0] === '(' && StringFormatter.getMatchingParenthesisIndex(input, 0);

        if (isExpression) {
            return new Expression(`${sign}${input}`);
        }

        const fnString = StringFormatter.getFnString(input);
        if (fnString) {
            const parameters = StringFormatter.getFunctionContents(input);

            switch (fnString) {
                case TrigTypes.sin:
                    return new Sin(`${parameters[0]}`, sign);
                case TrigTypes.cos:
                    return new Cos(`${parameters[0]}`, sign);
                case TrigTypes.tan:
                    return new Tan(`${parameters[0]}`, sign);
                case TrigTypes.sec:
                    return new Sec(`${parameters[0]}`, sign);
                case TrigTypes.csc:
                    return new Csc(`${parameters[0]}`, sign);
                case TrigTypes.cot:
                    return new Cot(`${parameters[0]}`, sign);
                case LogTypes.ln:
                    return new Ln(`${parameters[0]}`, sign);
                case LogTypes.log:
                    const base = !!parameters[1] ? parameters[1] : '10';
                    return new Log(`${parameters[0]}`, sign, base);
            }
        }

        const constant = StringFormatter.getConstantString(input);
        if (constant) {
            switch (constant) {
                case Constants.E:
                    return new E(sign);
                case Constants.PI:
                    return new PI(sign);
            }
        }

        const isFloat = input.includes('.') && !!parseFloat(`${sign}${input}`);
        if (isFloat) {
            return new Double(`${sign}${input}`);
        }

        const tryInt = parseInt(`${sign}${input}`);
        const isInt = !isNaN(tryInt);
        if (isInt) {
            return new Integer(`${sign}${input}`);
        }
        
        return new Variable(`${sign}${input}`);
    }
}