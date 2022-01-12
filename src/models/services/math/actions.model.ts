import { Sign } from 'src/models/math-object/enums.model';
import { Expression } from 'src/models/math-object/factor/expression.model';
import { Factor } from 'src/models/math-object/factor/factor.model';
import { Double } from 'src/models/math-object/factor/number/double.model';
import { Integer } from 'src/models/math-object/factor/number/integer.model';
import { MathObject } from 'src/models/math-object/math-object.model';
import { Term } from 'src/models/math-object/term.model';
import { Context } from 'src/models/search/context.model';
import { Position } from 'src/models/search/position.model';
import { Factory } from 'src/models/services/core/factory.service';
import { Chainer, ChangeContext } from './chainer.model';
import { ActionHelpers } from './action-helpers.model';

export class Actions {

  public static removeZeroFactor(rootMo: MathObject, previousChanges: ChangeContext[]): ChangeContext[] {
    let zeroFactor: Factor = {} as Factor;

    const termWithZeroFactorCtx = rootMo.find(Term, (t: Term) => {
      zeroFactor = t.findChild<Double | Integer>(Double || Integer, (i) => i.value === 0) as Factor;
      return !!zeroFactor && t.factorCount > 1;
    });

    if (termWithZeroFactorCtx) {
      const termTgt = termWithZeroFactorCtx.target as Term;
      const newMo = rootMo.replace(termTgt, new Term(`${termTgt.sign}0`));

      return [
        new ChangeContext({
          previousMathObject: rootMo,
          newMathObject: newMo,
          previousHighlightObjects: [zeroFactor],
          newHighlightObjects: [ newMo.getObjectAtPosition(termWithZeroFactorCtx.position) as MathObject ],
          action: ActionTypes.removeZeroFactor
        }),
      ];
    }

    return [];
  }

  public static removeZeroTerm(rootMo: MathObject, previousChanges: ChangeContext[]): ChangeContext[] {
    const zeroTermCtx = rootMo.find(Term, (t: Term, ctx: Context) => {
      if (t.factorCount === 1) {
        const zero = t.findChild<Double | Integer>(Double || Integer, (n) => n.value === 0) as Double;
        const hasSiblings = !!ctx.siblings.length;
        return !!zero && hasSiblings;
      }

      return false;
    });

    if (zeroTermCtx) {
      const parentExprCtx = zeroTermCtx.parentContext;

      if (parentExprCtx) {
        const parentExpression = parentExprCtx.target;
        const newExpressionChildren = parentExpression.children.filter((c) => c.id !== zeroTermCtx?.target.id) as Term[];
        const newParentExpression = Expression.fromTerms(newExpressionChildren);
        const newMo = rootMo.replace(parentExpression, newParentExpression);

        return [
          new ChangeContext({
            previousMathObject: rootMo,
            newMathObject: newMo,
            previousHighlightObjects: [zeroTermCtx.target],
            action: ActionTypes.removeZeroTerm
          }),
        ];
      }
    }

    return [];
  }

  public static constantMultiplication(rootMo: MathObject, previousChanges: ChangeContext[]): ChangeContext[] {
    let constantFactors: Double[] = [];

    const termWithMultiplConstantsCtx = rootMo.find(Term, (t: Term) => {
      constantFactors = t.factors.filter(f => f instanceof Double) as Double[];
      return constantFactors.length > 1;
    }, true);

    if (termWithMultiplConstantsCtx) {
      const term = termWithMultiplConstantsCtx.target as Term;
      const c1 = constantFactors[0];
      const c2 = constantFactors[1];

      const newValue = c1.value*c2.value;
      const newValueString = newValue !== 0 ? newValue.toString() : `${c1.sign}${newValue.toString()}`;

      const newConstant = Factory.buildFactor(newValueString);
      const newTermFactors = term.factors.map(f => f.id === c1.id ? newConstant : f).filter(f => f.id !== c2.id);
      const newTerm = Term.fromFactors(...newTermFactors);
      const c1Position = rootMo.find(MathObject, (mo) => mo.id === c1.id)?.position as Position;

      const newMo = rootMo.replace(term, newTerm);

      return [
        new ChangeContext({
          previousMathObject: rootMo,
          newMathObject: newMo,
          previousHighlightObjects: [c1, c2],
          newHighlightObjects: [ newMo.getObjectAtPosition(c1Position) as MathObject ],
          action: ActionTypes.constantMultiplication
        }),
      ];
    }

    return [];
  }

  public static constantAdditionSubtraction(rootMo: MathObject): ChangeContext[] {
    const isConstantTerm = (t: Term) => t.factorCount === 1 && t.factors[0] instanceof Double;

    const childrenFinder = (root: MathObject) => {
      const children: Context[] = [];

      const exprWithMultipleConstantFactorsCtx = root.find(Expression, (e: Expression) => {
        const constantTerms = e.terms.filter(t => isConstantTerm(t));
        return constantTerms.length > 1;
      }, true);

      if (exprWithMultipleConstantFactorsCtx) {
        (exprWithMultipleConstantFactorsCtx.target as Expression).terms.forEach(t => {
          if (children.length < 2 && isConstantTerm(t)) {
            children.push(root.find(Term, (term: Term) => term.id === t.id) as Context);
          }
        })
      }

      return children;
    }

    return ActionHelpers.reduceChildren(
      ActionTypes.constantAdditionSubtraction,
      rootMo,
      childrenFinder,
      (childrenCtxs: Context[]) => {
        const c1 = (childrenCtxs[0].target as Term).factors[0] as Double;
        const c2 = (childrenCtxs[1].target as Term).factors[0] as Double;
        return Term.fromFactors(Factory.buildFactor((c1.value + c2.value).toString()));
      }
    );
  }

  public static removeParenthFromSingleTerm(rootMo: MathObject): ChangeContext[] {
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
        ActionTypes.removeParenthFromSingleTerm,
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
  removeParenthFromSingleTerm = 'removeParenthFromSingleTerm',
  expandNegativeFactor = 'expandNegativeFactor'
}
