import { Factor } from "src/models/math-object/factor/factor.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Term } from "src/models/math-object/term.model";
import { Context } from "src/models/search/context.model";
import { ActionTypes } from "./actions.model";
import { ChangeContext } from "./chainer.model";

export class ActionHelpers {

  public static replaceChild(
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
        const newParent = ActionHelpers.buildParentForReplacingChildren(parentCtx, childCtx, replacementChildren);
    
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
  
  private static buildParentForReplacingChildren(parentCtx: Context, childToReplaceCtx: Context, newChildren: MathObject[]): MathObject {
    const newParentTermFactors = ActionHelpers.insert(childToReplaceCtx.position.index, (parentCtx.target as Term).factors.filter(f => f.id !== childToReplaceCtx.target.id), newChildren) as Factor[];
    return Term.fromFactors(...newParentTermFactors);
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