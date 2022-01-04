import { MathObject } from "src/models/math-object/math-object.model";

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
}

export class ChangeContext {
    public previousMathObject!: MathObject;
    public newMathObject!: MathObject;
    public previousHighlightObjects: MathObject[] = [];
    public newHighlightObjects: MathObject[] = [];

    constructor(props: Partial<ChangeContext>) {
        Object.assign(this, props);
    }
}