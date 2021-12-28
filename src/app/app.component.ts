import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MathableNG';

  ngOnInit(): void {
    const expression = new Expression('(a+1*x+c*(3.5+f^(x+0+E)))');
    console.log('EXPRESSION', expression);

    expression.traverse(Double, (v, ctx) => {
      console.log('=== DOUBLE: ', v.value);
      console.log(v);
      console.log(ctx);
    })

    // const thing = new Variable('-');
    // const thing = Term.fromFactors(...[]);
    // const thing = new Rational('a');
    // const thing = Rational.fromFactors(null, null, Sign.Negative);
    // const thing = Expression.fromTerms([new Term('a'), new Term('b')], [{ termIndex: 1, addtionalOperator: Operators.Addition }])
    // const thing = new Double('x');
    // const thing = new Integer('2.3');
    // const thing = new Sin('x++b', Sign.Positive);
    
    // const thing = new Log('x-b', Sign.Positive, 'y++t');
    // console.log(thing);
    
    // const type = Term;
    // console.log('traverse for', type);
  
    expression.traverse(Term, (term: Term) => {
      // console.log('FOUND TERM', term);
    });

    // console.log(Factory.buildFactor('-sin[(x)]'));
  }
}
