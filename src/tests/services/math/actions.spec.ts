import { Expression } from "src/models/math-object/factor/expression.model";
import { Power } from "src/models/math-object/factor/power.model";
import { Rational } from "src/models/math-object/factor/rational.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Actions, ActionTypes } from "src/models/services/math/actions.model";
import { ChangeContext } from "src/models/services/math/chainer.model";

export class ActionTest {
    mo!: MathObject;
    finalResult: string = '';
    beforeHighlights: string[][] = [];
    afterHighlights: string[][] = [];
    actions: ActionTypes[] = [];
    previousChanges: ChangeContext[] = []; // to test concatinating results


    constructor(props: Partial<ActionTest>) {
        Object.assign(this, props);
    }
}

describe('Mathobject Actions', () => {

    describe('removeZeroFactor', () => {
        const tests: ActionTest[] = [
            new ActionTest({ mo: new Expression('a+0'), finalResult: '(a+0)' }),
            new ActionTest({ mo: new Expression('a-0'), finalResult: '(a-0)' }),
            new ActionTest({ mo: new Expression('0'), finalResult: '(0)' }),
            new ActionTest({ mo: new Expression('-0'), finalResult: '(-0)' }),
            new ActionTest({ mo: new Rational('0/x'), finalResult: '(0/x)' }),
            new ActionTest({ mo: new Expression('a^(3*0)'), finalResult: '(a^(0))', beforeHighlights: [['0']], afterHighlights: [['0']], actions: [ ActionTypes.removeZeroFactor ] }),
            new ActionTest({ mo: new Expression('a^(-3*0)'), finalResult: '(a^(-0))', beforeHighlights: [['0']], afterHighlights: [['-0']], actions: [ ActionTypes.removeZeroFactor ] }),
            new ActionTest({ mo: new Expression('a+3*0'), finalResult: '(a+0)', beforeHighlights: [['0']], afterHighlights: [['0']], actions: [ ActionTypes.removeZeroFactor ] }),
            new ActionTest({ mo: new Expression('a+3*-0'), finalResult: '(a+0)', beforeHighlights: [['-0']], afterHighlights: [['0']], actions: [ ActionTypes.removeZeroFactor ] }),
            new ActionTest({ mo: new Expression('a-3*-0'), finalResult: '(a-0)', beforeHighlights: [['-0']], afterHighlights: [['-0']], actions: [ ActionTypes.removeZeroFactor ] }),
            new ActionTest({ mo: new Expression('-x*0'), finalResult: '(-0)', beforeHighlights: [['0']], afterHighlights: [['-0']], actions: [ ActionTypes.removeZeroFactor ] }),
            new ActionTest({ mo: new Expression('a-3*0'), finalResult: '(a-0)', beforeHighlights: [['0']], afterHighlights: [['-0']], actions: [ ActionTypes.removeZeroFactor ] }),
            new ActionTest({ mo: new Expression('a-0*3'), finalResult: '(a-0)', beforeHighlights: [['-0']], afterHighlights: [['-0']], actions: [ ActionTypes.removeZeroFactor ] }),
            new ActionTest({ mo: new Expression('a+3*(b+c*0)*0'), finalResult: '(a+0)', beforeHighlights: [['0']], afterHighlights: [['0']], actions: [ ActionTypes.removeZeroFactor ] }),
        ];

        actionTester('Turn any terms with zero factors to a zero', tests, Actions.removeZeroFactor);
    });

    describe('removeZeroTerm', () => {
        const tests: ActionTest[] = [
            new ActionTest({ mo: new Expression('0'), finalResult: '(0)' }),
            new ActionTest({ mo: new Expression('-0'), finalResult: '(-0)' }),
            new ActionTest({ mo: new Power('a^-0'), finalResult: 'a^-0' }),
            new ActionTest({ mo: new Rational('(a/(b+(0)))'), finalResult: '(a/(b+(0)))' }),
            new ActionTest({ mo: new Rational('(a/(b+(-0)))'), finalResult: '(a/(b+(-0)))' }),
            new ActionTest({ mo: new Expression('a+0'), finalResult: '(a)', beforeHighlights: [['0']], actions: [ ActionTypes.removeZeroTerm ] }),
            new ActionTest({ mo: new Expression('a-0'), finalResult: '(a)', beforeHighlights: [['-0']], actions: [ ActionTypes.removeZeroTerm ]  }),
            new ActionTest({ mo: new Expression('a^(3+0)'), finalResult: '(a^(3))', beforeHighlights: [['0']], actions: [ ActionTypes.removeZeroTerm ] }),
            new ActionTest({ mo: new Rational('(a/(x+0*(b^(2+0))))'), finalResult: '(a/(x+0*(b^(2))))', beforeHighlights: [['0']], actions: [ ActionTypes.removeZeroTerm ] }),
            new ActionTest({ mo: new Rational('(a/(x+0*(b^(2-0))))'), finalResult: '(a/(x+0*(b^(2))))', beforeHighlights: [['-0']], actions: [ ActionTypes.removeZeroTerm ] }),
            new ActionTest({ mo: new Rational('(a/(x+0*(b^(2+0+log[y+0,10]))))'), finalResult: '(a/(x+0*(b^(2+log[(y+0),10]))))', beforeHighlights: [['0']], actions: [ ActionTypes.removeZeroTerm ] }),
            new ActionTest({ mo: new Rational('(a/(x+0*(b^(2-0+log[y+0,10]))))'), finalResult: '(a/(x+0*(b^(2+log[(y+0),10]))))', beforeHighlights: [['-0']], actions: [ ActionTypes.removeZeroTerm ] }),
        ];

        actionTester('Remove the first zero term it finds', tests, Actions.removeZeroTerm);
    });
});

export function actionTester<TTest extends ActionTest>(
    additionalLabel: string,
    tests: TTest[],
    action: (mo: MathObject, currentChanges: ChangeContext[]) => ChangeContext[] | null
): void {

    describe(`Action should: ${additionalLabel}`, () => {
        tests.forEach((test: TTest) => {
            it(`'${test.mo.toString()}' => should result in correct changes`, () => {
                const mo = test.mo;
                const allChangeCtxs = action(mo, test.previousChanges);
                // console.log(test);
                // console.log(mo);
                // console.log('toString', mo.toString());
                // console.log(result);

                if (allChangeCtxs?.length) {
                    const finalMo = allChangeCtxs[allChangeCtxs.length - 1].newMathObject;
                    // console.log('finalMo toString', finalMo.toString());
                    // console.log('allChangeCtxs', allChangeCtxs);

                    expect(finalMo.toString()).toEqual(test.finalResult);
                    
                    allChangeCtxs.forEach((changeCtx: ChangeContext, ci: number) => {
                        // console.log('ChangeContext', changeCtx);
                        
                        const prevHighlightStrs = test.beforeHighlights[ci];
                        const newHighlightStrs = test.afterHighlights[ci];

                        expect(changeCtx.previousHighlightObjects.length).toEqual(prevHighlightStrs ? prevHighlightStrs.length: 0);
                        expect(changeCtx.newHighlightObjects.length).toEqual(newHighlightStrs ? newHighlightStrs.length : 0);
                        expect(changeCtx.action).toEqual(test.actions[ci]);

                        changeCtx.previousHighlightObjects.forEach((prevHighlightMo: MathObject, hi: number) => {
                            const highlightStr = prevHighlightStrs[hi];
                            expect(prevHighlightMo.toString()).toEqual(highlightStr);
                            const prevHighlightCtx = mo.find(MathObject, (child) => child.id === prevHighlightMo.id);
                            expect(prevHighlightCtx?.target).toBeTruthy();
                        });

                        changeCtx.newHighlightObjects.forEach((newHighlightMO: MathObject, hi: number) => {
                            const highlightStr = newHighlightStrs[hi];
                            expect(newHighlightMO.toString()).toEqual(highlightStr);
                            const newHighlightCtx = changeCtx.newMathObject.find(MathObject, (child) => child.id === newHighlightMO.id);
                            expect(newHighlightCtx?.target).toBeTruthy();
                        });
                    });
                } else {
                    expect(mo.toString()).toEqual(test.finalResult);
                }
            });
        });
    });
}
