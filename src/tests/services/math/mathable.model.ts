import { MathObject } from 'src/models/math-object/math-object.model';
import { Chainer, ChangeContext } from './chainer.model';
import { Operations } from './operations.model';

export class Mathable {
  public static simplify(mo: MathObject): Solution {
    const changes = Chainer.loopChain(mo, [
      Operations.removeFirstZeroTerm,
      Operations.removeFirstZeroFactor,
      Operations.constantMultiplication,
      Operations.constantAdditionSubtraction
    ]);

    return new Solution({ changes });
  }
}

export class Solution {
  changes!: ChangeContext[];

  get final(): MathObject {
    return this.changes[this.changes.length - 1].newMathObject;
  }

  constructor(props: Partial<Solution>) {
    Object.assign(this, props);
  }
}
