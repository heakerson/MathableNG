import { Component, OnInit } from '@angular/core';
import { Expression } from 'src/models/math-object/factor/expression.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MathableNG';

  ngOnInit(): void {
    const mo = new Expression('(*a+b)');
    // console.log(mo);
  }
}
