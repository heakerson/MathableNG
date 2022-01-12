import { Expression } from "src/models/math-object/factor/expression.model";
import { Factor } from "src/models/math-object/factor/factor.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Term } from "src/models/math-object/term.model";
import { Context } from "src/models/search/context.model";
import { ActionTypes } from "./actions.model";
import { ChangeContext } from "./chainer.model";

export class ActionHelpers {

  public static replaceExpandChild(
    action: ActionTypes,
    root: MathObject,
    childToReplaceFinder: (root: MathObject) => Context | null,
    replacementChildrenBuilder: (childToReplaceCtx: Context, parentCtx: Context) => MathObject[]
  ): ChangeContext[]
  {
    const childCtx = childToReplaceFinder(root);

    if (childCtx) {
      const parentCtx = childCtx.parentContext;

      if (parentCtx) {
        const replacementChildren = replacementChildrenBuilder(childCtx, parentCtx);
        const newParent = ActionHelpers.buildParentForReplaceChild(parentCtx, childCtx, replacementChildren);
    
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
    }

    return [];
  }
  
  private static buildParentForReplaceChild(parentCtx: Context, childToReplaceCtx: Context, newChildren: MathObject[]): MathObject {
    const newParentTermFactors = ActionHelpers.insert(childToReplaceCtx.position.index, (parentCtx.target as Term).factors.filter(f => f.id !== childToReplaceCtx.target.id), newChildren) as Factor[];
    return Term.fromFactors(...newParentTermFactors);
  }

  public static reduceChildren(
    action: ActionTypes,
    root: MathObject,
    childrenToReplaceFinder: (root: MathObject) => Context[],
    replacementChildBuilder: (childToReplaceCtx: Context[], parentCtx: Context) => MathObject
  ): ChangeContext[]
  {
    const allChildrenCtxs = childrenToReplaceFinder(root);

    if (allChildrenCtxs?.length) {
      const parentCtx = (allChildrenCtxs.map(c => c.parentContext).filter(c => !!c) as Context[])[0];

      if (parentCtx) {
        const replacementChild = replacementChildBuilder(allChildrenCtxs, parentCtx);
        const newParent = ActionHelpers.buildParentForReducingChildren(parentCtx, allChildrenCtxs, replacementChild);
        const newMo = root.replace(parentCtx.target, newParent);
        const newHighlightObjects = [newMo.getObjectAtPosition(allChildrenCtxs[0].position) as MathObject];
    
        return [
          new ChangeContext({
            previousMathObject: root,
            newMathObject: newMo,
            previousHighlightObjects: allChildrenCtxs.map(c => c.target),
            newHighlightObjects,
            action
          })
        ];
      }
    }

    return [];
  }

  private static buildParentForReducingChildren(parentCtx: Context, childrenToReplaceCtxs: Context[], newChild: MathObject): MathObject {
    const parent = parentCtx.target;
    const removedChildren = parent.children.filter(t => !childrenToReplaceCtxs.find(c => c.target.id === t.id))
    const newChildren = ActionHelpers.insert(childrenToReplaceCtxs[0].position.index, removedChildren, [newChild]);

    switch (parent.constructor) {
      case Expression:
        return Expression.fromTerms(newChildren as Term[], (parent as Expression).sign);
      case Term:
      default:
        return Term.fromFactors(...newChildren as Factor[])
    }
  }

  private static insert(index: number, list: MathObject[], inserting: MathObject[]): MathObject[] {
    const preList = list.filter((mo, i) => i < index);
    const postList = list.filter((mo, i) => i >= index);
    return [...preList, ...inserting, ...postList];
  }

  private static replace(index: number, list: MathObject[], replacement: MathObject[]): MathObject[] {
    const preList = list.filter((mo, i) => i < index);
    const postList = list.filter((mo, i) => i > index);
    return [...preList, ...replacement, ...postList];
  }

}