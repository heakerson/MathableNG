import { Component, Input, OnInit } from '@angular/core';
import { Sign } from 'src/models/math-object/enums.model';
import { MathObject } from 'src/models/math-object/math-object.model';
import { Term } from 'src/models/math-object/term.model';
import { Context } from 'src/models/search/context.model';
import { ChangeContext } from 'src/models/services/math/solution/change-context.model';
import { Factor } from 'src/models/math-object/factor/factor.model';

@Component({
  selector: 'app-math-object',
  templateUrl: './math-object.component.html',
  styleUrls: ['./math-object.component.scss']
})
export class MathObjectComponent implements OnInit {

  @Input()
  context!: Context;

  @Input()
  changeContext?: ChangeContext;

  get mathObject(): MathObject {
    return this.context?.target;
  }

  get mathObjectType(): string {
    return this.context.target.constructor.name;
  }

  get isFirst(): boolean {
    return this.context.position.index === 0;
  }

  get isRoot(): boolean {
    return this.context.isRoot;
  }

  constructor() { }

  getChild(index: number): MathObject {
    return this.context.target.children[index];
  }

  getChildContext(index: number): Context {
    return this.getChild(index).getContext(this.context.root) as Context;
  }

  isPositive(mo: MathObject): boolean {
    if (mo instanceof Term || mo instanceof Factor) {
      return mo.sign === Sign.Positive;
    }
    return false;
  }

  ngOnInit(): void {
  }

}
