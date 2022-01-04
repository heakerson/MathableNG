import { Expression } from 'src/models/math-object/factor/expression.model';
import { Factor } from 'src/models/math-object/factor/factor.model';
import { Double } from 'src/models/math-object/factor/number/double.model';
import { Integer } from 'src/models/math-object/factor/number/integer.model';
import { MathObject } from 'src/models/math-object/math-object.model';
import { Term } from 'src/models/math-object/term.model';
import { Factory } from 'src/models/services/factory.service';
import { ChangeContext } from './chainer.model';

export class Operations {

  public static removeFirstZeroFactor(rootMo: MathObject, previousChanges: ChangeContext[]): ChangeContext[] {
    let zeroFactor: Factor = {} as Factor;

    const termWithZeroFactorCtx = rootMo.find(Term, (t: Term) => {
      zeroFactor = t.findChild<Double | Integer>(Double || Integer, (i) => i.value === 0) as Factor;
      return !!zeroFactor && t.factorCount > 1;
    });

    if (termWithZeroFactorCtx) {
      const newMo = rootMo.replace(termWithZeroFactorCtx.target, new Term('0'));

      return [
        new ChangeContext({
          previousMathObject: rootMo,
          newMathObject: newMo,
          previousHighlightObjects: [zeroFactor],
          newHighlightObjects: [termWithZeroFactorCtx.target],
        }),
      ];
    }

    return [];
  }

  public static removeFirstZeroTerm(rootMo: MathObject, previousChanges: ChangeContext[]): ChangeContext[] {
    const zeroTermCtx = rootMo.find(Term, (t: Term) => {
      if (t.factorCount === 1) {
        const zero = t.findChild<Double | Integer>(Double || Integer, (n) => n.value === 0) as Double;
        return !!zero;
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
    });

    if (termWithMultiplConstantsCtx) {
      const term = termWithMultiplConstantsCtx.target as Term;
      const c1 = constantFactors[0];
      const c2 = constantFactors[1];
      const newConstant = Factory.buildFactor((c1.value*c2.value).toString());
      const newTermFactors = term.factors.map(f => f.id === c1.id ? newConstant : f).filter(f => f.id !== c2.id);
      const newTerm = Term.fromFactors(...newTermFactors);

      const newMo = rootMo.replace(term, newTerm);

      return [
        new ChangeContext({
          previousMathObject: rootMo,
          newMathObject: newMo,
          previousHighlightObjects: [c1, c2],
          newHighlightObjects: [newConstant],
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
    })

    if (exprWithMultipleConstantFactorsCtx) {
      const exp = exprWithMultipleConstantFactorsCtx.target as Expression;
      const t1 = constantTerms[0];
      const t2 = constantTerms[1];
      const newConstant = Factory.buildFactor(((t1.factors[0] as Double).value+(t2.factors[0] as Double).value).toString());
      const newTerms = exp.terms.map(t => t.id === t1.id ? Term.fromFactors(newConstant) : t).filter(t => t.id !== t2.id);
      const newExp = Expression.fromTerms(newTerms, exp.sign);

      const newMo = rootMo.replace(exp, newExp);

      return [
        new ChangeContext({
          previousMathObject: rootMo,
          newMathObject: newMo,
          previousHighlightObjects: [t1, t2],
          newHighlightObjects: [newConstant],
        }),
      ];
    }

    return [];
  }
}
