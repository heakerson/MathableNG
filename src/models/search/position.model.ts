export class Position {

    public get index(): number {
        return this.indexPath[this.indexPath.length - 1];
    }

    constructor(public indexPath: number[]) {}
}