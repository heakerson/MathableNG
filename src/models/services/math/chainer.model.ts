import { MathObject } from "src/models/math-object/math-object.model";
import { ActionTypes } from "./actions.model";
import { ChangeContext } from "./solution/change-context.model";

export class Chainer {

    public static loopChain(startMo: MathObject, updateFns: ((mo: MathObject, currentChanges: ChangeContext[]) => ChangeContext[] | null)[]): ChangeContext[] {
        let fnIndex = 0;
        let mostRecentMo = startMo;
        let updates: ChangeContext[] = [];

        while (fnIndex < updateFns.length) {
            const fn = updateFns[fnIndex];
            const newUpdates = fn(mostRecentMo, updates);

            if (newUpdates?.length) {
                fnIndex = 0;
                updates = updates.concat(newUpdates);
                mostRecentMo = newUpdates[newUpdates.length - 1].newMathObject;
            } else {
                fnIndex++;
            }
        }

        return updates;
    }

    public static chain(startMo: MathObject, updateFns: ((mo: MathObject, currentChanges: ChangeContext[]) => ChangeContext[] | null)[]): ChangeContext[] {
        let fnIndex = 0;
        let mostRecentMo = startMo;
        let updates: ChangeContext[] = [];

        while (fnIndex < updateFns.length) {
            const fn = updateFns[fnIndex];
            const newUpdates = fn(mostRecentMo, updates);

            if (newUpdates?.length) {
                updates = updates.concat(newUpdates);
                mostRecentMo = newUpdates[newUpdates.length - 1].newMathObject;
            }

            fnIndex++;
        }

        return updates;
    }
}
