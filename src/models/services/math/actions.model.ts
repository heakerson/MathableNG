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
import { ChangeContext } from './chainer.model';
import { Utilities } from './utilities.model';

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

  public static constantAdditionSubtraction(rootMo: MathObject, previousChanges: ChangeContext[]): ChangeContext[] {
    let constantTerms: Term[] = [];

    const exprWithMultipleConstantFactorsCtx = rootMo.find(Expression, (e: Expression) => {
      constantTerms = e.terms.filter(t => t.factorCount === 1 && t.factors[0] instanceof Double);
      return constantTerms.length > 1;
    }, true);

    if (exprWithMultipleConstantFactorsCtx) {
      const exp = exprWithMultipleConstantFactorsCtx.target as Expression;
      const t1 = constantTerms[0];
      const t2 = constantTerms[1];
      const newConstant = Factory.buildFactor(((t1.factors[0] as Double).value+(t2.factors[0] as Double).value).toString());
      const newTerms = exp.terms.map(t => t.id === t1.id ? Term.fromFactors(newConstant) : t).filter(t => t.id !== t2.id);
      const newExp = Expression.fromTerms(newTerms, exp.sign);
      const newConstantPosition = rootMo.find(MathObject, (mo) => mo.id === t1.id)?.position as Position;

      const newMo = rootMo.replace(exp, newExp);

      return [
        new ChangeContext({
          previousMathObject: rootMo,
          newMathObject: newMo,
          previousHighlightObjects: [t1, t2],
          newHighlightObjects: [ newMo.getObjectAtPosition(newConstantPosition) as MathObject ],
          action: ActionTypes.constantAdditionSubtraction
        }),
      ];
    }

    return [];
  }

  public static removeParenthFromSingleTerm(rootMo: MathObject, previousChanges: ChangeContext[]): ChangeContext[] {
    const childFinder: (mo: MathObject) => Context = (mo: MathObject) => mo.find(Expression, (e: Expression, ctx: Context) => {
      const singleTermExprNonRoot = e.termCount === 1 && !ctx.isRoot;
      const parentIsTerm = !!ctx.parent && ctx.parent instanceof Term;
      return singleTermExprNonRoot && parentIsTerm;
    }, true) as Context;

    let singleTermExpressionCtx = childFinder(rootMo);

    if (singleTermExpressionCtx) {
      const isNegative = (singleTermExpressionCtx.target as Expression).sign == Sign.Negative;

      if (isNegative) {
        const negativeChanges = Actions.expandNegativeFactor(rootMo, childFinder);
        const newMo = negativeChanges[0].newMathObject;
        singleTermExpressionCtx = childFinder(newMo) as Context;
        return [...negativeChanges, ...Actions.removeParenthFromSingleTermExpressionHelper(singleTermExpressionCtx.root, childFinder)];
      }

      return Actions.removeParenthFromSingleTermExpressionHelper(rootMo, childFinder);
    }

    return [];
  }

  private static expandNegativeFactor(rootMo: MathObject, negativeFactorFinder: (root: MathObject) => Context): ChangeContext[] {
    return Actions.replaceChildren(
      ActionTypes.expandNegativeFactor,
      rootMo,
      negativeFactorFinder,
      (childToReplaceCtx: Context) => [new Integer('-1'), (childToReplaceCtx.target as Factor).flipSign()],
      (parentCtx: Context, childToReplaceCtx: Context, newChildren: MathObject[]) => {
        const newParentTermFactors = Utilities.insert(childToReplaceCtx.position.index, (parentCtx.target as Term).factors.filter(f => f.id !== childToReplaceCtx.target.id), newChildren) as Factor[];
        return Term.fromFactors(...newParentTermFactors);
      }
    );
  }

  private static removeParenthFromSingleTermExpressionHelper(rootMo: MathObject, expressionFinder: (root: MathObject) => Context): ChangeContext[] {
    return Actions.replaceChildren(
      ActionTypes.removeParenthFromSingleTerm,
      rootMo,
      expressionFinder,
      (childToReplaceCtx: Context) => (childToReplaceCtx.target as Expression).terms[0].factors,
      (parentCtx: Context, childToReplaceCtx: Context, newChildren: MathObject[]) => {
        const newParentTermFactors = Utilities.insert(childToReplaceCtx.position.index, (parentCtx.target as Term).factors.filter(f => f.id !== childToReplaceCtx.target.id), newChildren) as Factor[];
        return Term.fromFactors(...newParentTermFactors);
      }
    );
  }

  private static replaceChildren(
    action: ActionTypes,
    root: MathObject,
    childToReplaceFinder: (root: MathObject) => Context,
    replacementChildrenBuilder: (childToReplaceCtx: Context, parentCtx: Context) => MathObject[],
    newParentBuilder: (parentCtx: Context, childToReplaceCtx: Context, newChildren: MathObject[]) => MathObject
  ): ChangeContext[]
  {
    const childCtx = childToReplaceFinder(root);
    const parentCtx = childCtx.parentContext;

    if (parentCtx) {
      const replacementChildren = replacementChildrenBuilder(childCtx, parentCtx);
      const newParent = newParentBuilder(parentCtx, childCtx, replacementChildren);
  
      const newMo = root.replace(parentCtx.target, newParent);
      const newParentInsideNewMo = newMo.find(MathObject, (c, ctx) => ctx.position.equals(parentCtx.position)) as Context;
      const newHighlightObjects = newParentInsideNewMo.target.children.filter((c, i) => i >= childCtx.position.index && i < childCtx.position.index + replacementChildren.length);
  
      return [
        new ChangeContext({
          previousMathObject: root,
          newMathObject: newMo,
          previousHighlightObjects: [childCtx.target],
          newHighlightObjects,
          action
        })
      ];
    }

    return [];
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
