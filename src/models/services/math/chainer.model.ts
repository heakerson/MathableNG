import { MathObject } from "src/models/math-object/math-object.model";
import { Factory } from "../core/factory.service";
import { ActionTypes } from "./actions.model";
import { Position } from '../../search/position.model';

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

export class ChangeContext {
    public previousMathObject!: MathObject;
    public newMathObject!: MathObject;
    public previousHighlightObjects: MathObject[] = [];
    public newHighlightObjects: MathObject[] = [];
    public action!: ActionTypes;

    constructor(props: Partial<ChangeContext>) {
        Object.assign(this, props);
    }

    toString(): string {
        const serializable = {
            previousMathObjectString: this.previousMathObject.toString(),
            newMathObjectString: this.newMathObject.toString(),
            // previousHighlightObjectPositions: this.previousHighlightObjects.map(mo => this.previousMathObject)
        } as SerializableChangeContext;

        return JSON.stringify(serializable);
    }

    public static fromString(serialized: string): ChangeContext {
        const serializable: SerializableChangeContext = JSON.parse(serialized);
        const previousMathObject = Factory.buildFactor(serializable.previousMathObjectString);
        const newMathObject = Factory.buildFactor(serializable.newMathObjectString);

        return new ChangeContext({
            previousMathObject,
            newMathObject,
            previousHighlightObjects: serializable.previousHighlightObjectPositions.map(p => {
                const position = new Position(p);
                return previousMathObject.getObjectAtPosition(position) as MathObject;
            }),
            newHighlightObjects: serializable.newHighlightObjectPositions.map(p => {
                const position = new Position(p);
                return newMathObject.getObjectAtPosition(position) as MathObject;
            }),
            action: serializable.action
        });
    }
}

export class SerializableChangeContext {
    public previousMathObjectString!: string;
    public newMathObjectString!: string;
    public previousHighlightObjectPositions: number[][] = [];
    public newHighlightObjectPositions: number[][] = [];
    public action!: ActionTypes;
}