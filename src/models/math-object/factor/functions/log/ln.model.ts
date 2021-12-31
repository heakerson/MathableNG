import { Sign } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Factor } from "../../factor.model";
import { E } from "../../number/contant/e.model";
import { Log } from "./log.model";

export class Ln extends Log {

    public override get base(): E {
        return this.children[1] as E;
    }

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'E');
    }

    public static override fromFactors(factor: Factor, sign: Sign): Ln {
        return new Ln(factor.toString(), sign);
    }

    public override replaceChild(newMathObject: Factor): Ln {
        return Ln.fromFactors(newMathObject, this.sign);
    }

    public override copy(): Log {
        return Ln.fromFactors(this.contents, this.sign);
    }

    public override toString(): string {
        return `${this.sign}${this.functionString}[${this.contents}]`;
    }

    protected override setFnString(): string {
        return 'ln';
    }

    protected override getTraversableChildren(): MathObject[] {
        return [this.contents];
    }
}