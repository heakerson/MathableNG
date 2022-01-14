import { Sign } from 'src/models/math-object/enums.model';
import { Expression } from 'src/models/math-object/factor/expression.model';
import { Factor } from 'src/models/math-object/factor/factor.model';
import { Double } from 'src/models/math-object/factor/number/double.model';
import { Integer } from 'src/models/math-object/factor/number/integer.model';
import { MathObject } from 'src/models/math-object/math-object.model';
import { Term } from 'src/models/math-object/term.model';
import { Context } from 'src/models/search/context.model';
import { Factory } from 'src/models/services/core/factory.service';
import { Chainer, ChangeContext } from './chainer.model';
import { ActionHelpers } from './action-helpers.model';
import { Constant } from 'src/models/math-object/factor/number/contant/constant.model';

export class Actions {

  public static removeZeroFactor(rootMo: MathObject): ChangeContext[] {
    const childrenFinder = (root: MathObject) => {
      const termWithZeroFactorCtx = rootMo.find(Term, (t: Term) => {
        const zeroFactor = t.findChild<Double | Integer>(Double || Integer, (i) => i.value === 0) as Factor;
        return !!zeroFactor && t.factorCount > 1;
      });

      if (termWithZeroFactorCtx && termWithZeroFactorCtx.target.children.length > 1) {
        return termWithZeroFactorCtx.target.children.map(c => root.getObjectById(c.id));
      }

      return [];
    }

    const newChildBuilder = (childrenCtxs: Context[]) => Factory.buildFactor(`${(childrenCtxs[0].target as Factor).sign}0`);
    const optionalPrevHighlightsBuilder = (childToReplaceCtxs: Context[]) => [ childToReplaceCtxs.find(ctx => ctx.target instanceof Double && ctx.target.value === 0)?.target as Double ];

    return ActionHelpers.reduceRemoveChildren(
      ActionTypes.removeZeroFactor,
      rootMo,
      childrenFinder,
      newChildBuilder,
      optionalPrevHighlightsBuilder
    );
  }

  public static removeZeroTerm(rootMo: MathObject): ChangeContext[] {
    const childrenFinder = (root: MathObject) => {
      const zeroTermCtx = root.find(Term, (t: Term, ctx: Context) => {
        if (t.factorCount === 1) {
          const zero = t.findChild<Double | Integer>(Double || Integer, (n) => n.value === 0) as Double;
          const hasSiblings = !!ctx.siblings.length;
          return !!zero && hasSiblings;
        }
  
        return false;
      });

      return zeroTermCtx ? [zeroTermCtx] : [];
    }

    return ActionHelpers.reduceRemoveChildren(
      ActionTypes.removeZeroTerm,
      rootMo,
      childrenFinder
    );
  }

  public static constantMultiplication(rootMo: MathObject): ChangeContext[] {
    const isConstantFactor = (f: Factor) => f instanceof Double && !(f instanceof Constant);

    const childrenFinder = (root: MathObject) => {
      let children: Context[] = [];
      const parentTermCtx = root.find(Term, (e: Term) => e.factors.filter(t => isConstantFactor(t)).length > 1, true);

      if (parentTermCtx) {
        (parentTermCtx.target as Term).factors.forEach(f => {
          if (children.length < 2 && isConstantFactor(f)) {
            children.push(root.find(Factor, (factor: Factor) => factor.id === f.id) as Context);
          }
        })
      }

      return children;
    }

    const newChildBuilder = (childrenCtxs: Context[]) => {
      const c1 = (childrenCtxs[0].target as Double);
      const c2 = (childrenCtxs[1].target as Double);
      const newValue = c1.value*c2.value;
      const newValueString = newValue !== 0 ? newValue.toString() : `${c1.sign}${newValue.toString()}`
      return Factory.buildFactor(newValueString);
    };

    return ActionHelpers.reduceRemoveChildren(
      ActionTypes.constantMultiplication,
      rootMo,
      childrenFinder,
      newChildBuilder
    );
  }

  public static constantAdditionSubtraction(rootMo: MathObject): ChangeContext[] {
    const isConstantTerm = (t: Term) => t.factorCount === 1 && t.factors[0] instanceof Double && !(t.factors[0] instanceof Constant);

    const childrenFinder = (root: MathObject) => {
      let children: Context[] = [];
      const parentExprCtx = root.find(Expression, (e: Expression) => e.terms.filter(t => isConstantTerm(t)).length > 1, true);

      if (parentExprCtx) {
        (parentExprCtx.target as Expression).terms.forEach(t => {
          if (children.length < 2 && isConstantTerm(t)) {
            children.push(root.find(Term, (term: Term) => term.id === t.id) as Context);
          }
        })
      }

      return children;
    }

    const newChildBuilder = (childrenCtxs: Context[]) => {
      const c1 = (childrenCtxs[0].target as Term).factors[0] as Double;
      const c2 = (childrenCtxs[1].target as Term).factors[0] as Double;
      return Term.fromFactors(Factory.buildFactor((c1.value + c2.value).toString()));
    };

    return ActionHelpers.reduceRemoveChildren(
      ActionTypes.constantAdditionSubtraction,
      rootMo,
      childrenFinder,
      newChildBuilder
    );
  }

  public static removeParenthBasic(rootMo: MathObject): ChangeContext[] {
    const childFinder: (mo: MathObject) => Context = (mo: MathObject) => mo.find(Expression, (e: Expression, ctx: Context) => {
      const singleTermExprNonRoot = e.termCount === 1 && !ctx.isRoot;
      const parentIsTerm = !!ctx.parent && ctx.parent instanceof Term;
      return singleTermExprNonRoot && parentIsTerm;
    }, true) as Context;

    const negativeChildFinder = (mo: MathObject) => {
      const childCtx = childFinder(mo);
      if (childCtx && childCtx.target instanceof Factor) {
        return childCtx.target.sign === Sign.Negative ? childCtx : null;
      }
      return null;
    }

    return Chainer.chain(rootMo, [
      (root: MathObject) => Actions.expandNegativeFactor(root, negativeChildFinder),
      (root: MathObject) => ActionHelpers.replaceExpandChild(
        ActionTypes.removeParenthBasic,
        root,
        childFinder,
        (childToReplaceCtx: Context) => (childToReplaceCtx.target as Expression).terms[0].factors
      )
    ]);
  }

  private static expandNegativeFactor(rootMo: MathObject, negativeFactorFinder: (root: MathObject) => Context | null): ChangeContext[] {
    return ActionHelpers.replaceExpandChild(
      ActionTypes.expandNegativeFactor,
      rootMo,
      negativeFactorFinder,
      (childToReplaceCtx: Context) => [new Integer('-1'), (childToReplaceCtx.target as Factor).flipSign()]
    );
  }
}

export enum ActionTypes {
  removeZeroFactor = 'removeZeroFactor',
  removeZeroTerm = 'removeZeroTerm',
  constantAdditionSubtraction = 'constantAdditionSubtraction',
  constantMultiplication = 'constantMultiplication',
  removeParenthBasic = 'removeParenthBasic',
  expandNegativeFactor = 'expandNegativeFactor'
}
