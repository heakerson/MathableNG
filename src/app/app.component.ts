import { Component, OnInit } from '@angular/core';
import { Context } from 'src/models/search/context.model';
import { Operators, Sign } from 'src/models/math-object/enums.model';
import { Expression } from 'src/models/math-object/factor/expression.model';
import { Function } from 'src/models/math-object/factor/functions/function.model';
import { Log } from 'src/models/math-object/factor/functions/log/log.model';
import { Sin } from 'src/models/math-object/factor/functions/trig/sin.model';
import { Double } from 'src/models/math-object/factor/number/double.model';
import { Integer } from 'src/models/math-object/factor/number/integer.model';
import { RealNumber } from 'src/models/math-object/factor/number/real-number.model';
import { Rational } from 'src/models/math-object/factor/rational.model';
import { Variable } from 'src/models/math-object/factor/variable.model';
import { Term } from 'src/models/math-object/term.model';
import { Factory } from 'src/models/services/factory.service';
import { MathObject } from 'src/models/math-object/math-object.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MathableNG';

  ngOnInit(): void {
    // const thing = -0;
    // const thing2 = 0;
    // console.log('zero', thing);
    // console.log('zero to string', thing.toString());
    // console.log('equals -0', thing === -0);
    // console.log('equals 0', thing === 0);

    // let expression = new Expression('(a-1*(z+(b-1*(b+sin[z])*0))+c*(3.5*0+7+f^(x+-1+E)))');
    // let expression = new Expression('(a-1*(z+(b-1*(b+z)*0)))');
    // console.log('START', expression.toString());

    // expression = this.replaceZeroFactors(expression) as Expression;
    // expression = this.replaceZeroTerms(expression) as Expression;
    // console.log('FINAL', expression.toString());
  }

  replaceZeroTerms(mo: MathObject): MathObject {
    let findZeroTerm = (m: MathObject) => {
      return m.find(Term, (t: Term) => {
        if (t.factorCount === 1) {
          const zero = t.findChild<Double | Integer>(Double || Integer, (n) => n.value === 0);
  
          if (zero) {
            return true;
          }
        }
  
        return false;
      });
    }

    let termIsZeroCtx = findZeroTerm(mo);

    while (termIsZeroCtx) {
      const parentExprCtx = termIsZeroCtx.parentContext;

      if (parentExprCtx) {
        const parentExpression = parentExprCtx.target;
        const newExpressionChildren = parentExpression.children.filter(c => c.id !== termIsZeroCtx?.target.id) as Term[];
        const newParentExpression = Expression.fromTerms(newExpressionChildren);

        mo = mo.replace(parentExpression, newParentExpression);
  
        termIsZeroCtx = findZeroTerm(mo);
      } else {
        termIsZeroCtx = null;
      }
    }

    return mo;
  }

  replaceZeroFactors(mo: MathObject): MathObject {
    let termWithZeroCtx = mo.find(Term, (t: Term) => {
      const zeroFactor = t.findChild<Double | Integer>(Double || Integer, (i) => i.value === 0);
      return !!zeroFactor && t.factorCount > 1;
    });

    while (termWithZeroCtx) {
      mo = mo.replace(termWithZeroCtx.target, new Term('0'));

      termWithZeroCtx = mo.find(Term, (t: Term) => {
        const zeroFactor = t.findChild<Double | Integer>(Double || Integer, (i) => i.value === 0);
        return !!zeroFactor && t.factorCount > 1;
      });
    }

    return mo;
  }
}
