import { MathObject } from 'src/models/math-object/math-object.model';
import { Chainer, ChangeContext } from './chainer.model';
import { Actions } from './actions.model';

export class Mathable {
  public static simplify(mo: MathObject): Solution {
    const changes = Chainer.loopChain(mo, [
      Actions.removeZeroTerm,
      Actions.removeParenthBasic,
      Actions.removeZeroFactor,
      Actions.constantMultiplication,
      Actions.constantAdditionSubtraction
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
