import { Component, Input, OnInit } from '@angular/core';
import { MathObject } from 'src/models/math-object/math-object.model';
import { Context } from 'src/models/search/context.model';
import { ChangeContext } from 'src/models/services/math/solution/change-context.model';
import { Solution } from 'src/models/services/math/solution/solution.model';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent implements OnInit {

  @Input()
  solution!: Solution;

  getStartContext(): Context {
    return this.solution.start.find(MathObject, (mo) => mo.id === this.solution.start.id) as Context;
  }

  getFinalContext(): Context {
    return this.solution.final.find(MathObject, (mo) => mo.id === this.solution.final.id) as Context;
  }

  constructor() { }

  ngOnInit(): void {
  }

  getPreviousMoContext(changeContext: ChangeContext): Context {
    return changeContext.previousMathObject.find(MathObject, (mo) => mo.id === changeContext.previousMathObject.id) as Context;
  }

  getNewMoContext(changeContext: ChangeContext): Context {
    return changeContext.newMathObject.find(MathObject, (mo) => mo.id === changeContext.newMathObject.id) as Context;
  }

}
