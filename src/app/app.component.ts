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
import { Factory } from 'src/models/services/core/factory.service';
import { MathObject } from 'src/models/math-object/math-object.model';
import { Mathable } from 'src/models/services/math/mathable.model';
import { Position } from 'src/models/search/position.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MathableNG';

  ngOnInit(): void {
    // const mo = new Expression('(a*b*0) + 3*1 + ((a+0+5*7)/d) + f*0 + 2*5');
    // const solution = Mathable.simplify(mo);
    // console.log(`${mo.toString()} ====== `);

    // solution.changes.forEach(c => {
    //   console.log('   ', c.newMathObject.toString());
    // });

    // console.log(`${solution.final.toString()} ====== STEP COUNT: ${solution.changes.length} `);


    // const sevenCtx = mo.find(Integer, (i: Integer) => i.value === 7);
    // if (sevenCtx) {
    //   const newMo = mo.replace(sevenCtx?.target, new Integer('100'));
    //   const newOneHundred = newMo.getObjectAtPosition(sevenCtx.position);
    //   // const newInt = newMo.getObjectAtPosition(new Position([0, 10, 0]));

    //   console.log('FOUND 100?', newOneHundred);
    // }
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
