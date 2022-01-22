import { Expression } from "src/models/math-object/factor/expression.model";
import { Power } from "src/models/math-object/factor/power.model";
import { Rational } from "src/models/math-object/factor/rational.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Term } from "src/models/math-object/term.model";
import { Mathable } from "src/models/services/math/mathable.model";
import { Solution } from "src/models/services/math/solution/solution.model";

export class SolutionTest {
  mo!: MathObject;

  constructor(props: Partial<SolutionTest>) {
      Object.assign(this, props);
  }
}

export function solutionTester<TTest extends SolutionTest>(
  tests: TTest[]
): void {

  describe(`Should be serializable`, () => {
    tests.forEach((test: TTest) => {
      it('Should be serializable', () => {
          // console.log('mo', test.mo);
        const originalSolution = Mathable.simplify(test.mo);
          // console.log('originalSolution', originalSolution);
        const toString = originalSolution.toString();
          // console.log('toString', toString);
        const backToSolution = Solution.fromString(toString);
          // console.log('backToSolution', backToSolution);
        const toString2 = backToSolution.toString();
          // console.log('toString2', toString2);
        const backToSolution2 = Solution.fromString(toString2);
          // console.log('backToSolution2', backToSolution2);
        const toString3 = backToSolution2.toString();
          // console.log('toString3', toString3);
  
        expect(toString).toEqual(toString2);
        expect(originalSolution.equals(backToSolution)).toBeTrue();
        expect(originalSolution.changes.length).toEqual(backToSolution.changes.length);
  
        expect(toString).toEqual(toString3);
        expect(originalSolution.equals(backToSolution2)).toBeTrue();
        expect(originalSolution.changes.length).toEqual(backToSolution2.changes.length);
      });
    });
  });
}

describe('Solution', () => {
  const tests: SolutionTest[] = [
    { mo: new Expression('0') },
    { mo: new Expression('(a*b*0) + 3*1 + ((a+0+5*7)/d) + f*0 + 2*5') },
    { mo: new Term('(a*b*0) + 3*1 + ((a+0+5*7)/d) + f*0 + 2*5') },
    { mo: new Term('((a+0+5*7*sin[0])/d^(2-2))') },
    { mo: new Term('((a+0+5*7*sin[0])/d^(x-2))') },
    { mo: new Expression('-((4+2)/(x^2*x^(6-7)))')},
    { mo: new Expression('((4+2)/(x^2*x^(6-7)))')},
    { mo: new Rational('((4+2)/(x^2*x^(6-7)))')},
    { mo: new Term('((4+2)/(x^2*x^(6-7)))')},
    { mo: new Power('x^4')},
    { mo: new Expression('x^4')},
    { mo: new Term('x^4')},
  ];

  solutionTester(tests);
});