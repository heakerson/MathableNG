import { MathObject } from "src/models/math-object/math-object.model";

export class Utilities {

    public static insert(index: number, list: MathObject[], inserting: MathObject[]): MathObject[] {
        const preList = list.filter((mo, i) => i < index);
        const postList = list.filter((mo, i) => i >= index);
        return [...preList, ...inserting, ...postList];
    }

}