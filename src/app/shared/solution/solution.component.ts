import { Component, Input, OnInit } from '@angular/core';
import { MathObject } from 'src/models/math-object/math-object.model';
import { Solution } from 'src/models/services/math/solution/solution.model';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent implements OnInit {

  @Input()
  solution!: Solution;

  constructor() { }

  ngOnInit(): void {
  }

}
