import { Component, Input, OnInit } from '@angular/core';
import { Operators, Sign } from 'src/models/math-object/enums.model';
import { MathObject } from 'src/models/math-object/math-object.model';
import { Term } from 'src/models/math-object/term.model';
import { Context } from 'src/models/search/context.model';
import { ChangeContext } from 'src/models/services/math/solution/change-context.model';
import { Factor } from 'src/models/math-object/factor/factor.model';
import { Expression } from 'src/models/math-object/factor/expression.model';
import { Function } from 'src/models/math-object/factor/functions/function.model';
import { Log } from 'src/models/math-object/factor/functions/log/log.model';

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

  vm!: MathObjectViewModel;

  constructor() { }

  ngOnInit(): void {
    if (this.context) {
      this.vm = this.buildViewModel();
    }
  }

  buildViewModel(): MathObjectViewModel {
    let isFirstTerm = false;

    if (this.context.target instanceof Factor) {
      if (this.context.parent && this.context.parent instanceof Term) {
        isFirstTerm = this.context.parentContext?.position.index === 0;
      }
    }

    let additionalOpString = '';

    if (this.context.target instanceof Term && this.context.parentContext) {
      const parent = this.context.parent;

      if (parent instanceof Expression) {
        const termIndex = this.context.position.index;
        const op = parent.getAdditionalOperatorForIndex(termIndex);

        if (op !== Operators.None) {
          additionalOpString = ` ${op} `;
        }
      }
    }

    const isSubscript = this.context.parent && this.context.parent instanceof Log ? this.context.position.index === 1 : false;

    const isBeforeHighlight = this.isHighlight(this.context, this.changeContext?.previousHighlightObjects as MathObject[] || []);
    const isAfterHighlight = this.isHighlight(this.context, this.changeContext?.newHighlightObjects as MathObject[] || []);

    let customStyles = {
      color: isBeforeHighlight ? 'red' : (isAfterHighlight ? 'limegreen' : 'black'),
      'font-size': isSubscript ? 'smaller' : '16px'
    };

    return new MathObjectViewModel({
      mathObject: this.context.target,
      typeString: this.getTypeString(),
      isRoot: this.context.isRoot,
      inFirstTerm: isFirstTerm,
      isFirstSibling: this.context.isFirstSibling,
      isPositive: this.context.target instanceof Term || this.context.target instanceof Factor ? this.context.target.sign === Sign.Positive : false,
      flippedFactorStr: this.context.target instanceof Factor ? this.context.target.flipSign().toString() : '',
      functionStr: this.context.target instanceof Function ? this.context.target.functionString : '',
      additionalOpString,
      isSubscript,
      customStyles,
      childContexts: this.context.target.children.map(c => c.getContext(this.context.root) as Context)
    });
  }

  isHighlight(targetContext: Context, highlightObjects: MathObject[]): boolean {

    const isTarget = highlightObjects.find(mo => mo.id === targetContext.target.id);

    if (isTarget) {
      return true;
    }

    if (targetContext.parentContext) {
      return this.isHighlight(targetContext.parentContext, highlightObjects);
    }

    return false;
  }

  isPositive(mo: MathObject): boolean {
    if (mo instanceof Term || mo instanceof Factor) {
      return mo.sign === Sign.Positive;
    }
    return false;
  }

  getTypeString(): string {
    if (this.context.target instanceof Function) {
      if (this.context.target instanceof Log) {
        return 'Log';
      }
      return 'Function';
    }
    return this.context.target.constructor.name;
  }
}

class MathObjectViewModel {
  mathObject!: MathObject;
  typeString!: string;
  isRoot: boolean = false;
  isFirstSibling: boolean = false;
  inFirstTerm: boolean = false;
  isPositive: boolean = false;
  flippedFactorStr!: string;
  functionStr!: string;
  additionalOpString!: string;
  isSubscript = false;
  customStyles: any = {};
  childContexts: Context[] = [];

  constructor(start: Partial<MathObjectViewModel>) {
    Object.assign(this, start);
  }
}
