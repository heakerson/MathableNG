import { MathObject } from 'src/models/math-object/math-object.model';
import { Chainer } from './chainer.model';
import { Actions } from './actions.model';
import { Solution } from './solution/solution.model';

export class Mathable {
  public static simplify(mo: MathObject): Solution {
    const changes = Chainer.loopChain(mo, [
      Actions.removeZeroTerm,
      Actions.removeParenthBasic,
      Actions.removeZeroFactor,
      Actions.constantMultiplication,
      Actions.constantAdditionSubtraction
    ]);

    return new Solution({ start: mo, changes });
  }
}
