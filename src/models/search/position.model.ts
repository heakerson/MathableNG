export class Position {

    public get index(): number {
        return this.indexPath[this.indexPath.length - 1];
    }

    constructor(public indexPath: number[]) {}

    public equals(position: Position): boolean {
        if (this.indexPath.length === position.indexPath.length) {
            return !this.indexPath.some((indexValue: number, i: number) => indexValue !== position.indexPath[i]);
        }

        return false;
    }
}