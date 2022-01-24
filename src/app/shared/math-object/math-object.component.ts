import { Component, Input, OnInit } from '@angular/core';
import { Context } from 'src/models/search/context.model';

@Component({
  selector: 'app-math-object',
  templateUrl: './math-object.component.html',
  styleUrls: ['./math-object.component.scss']
})
export class MathObjectComponent implements OnInit {

  @Input()
  context!: Context;

  constructor() { }

  ngOnInit(): void {
  }

}
