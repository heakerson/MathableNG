import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Test } from '@testing/models/test.model';
import { TestDataService } from '@testing/services/test-data.service';
import { Subject, takeUntil } from 'rxjs';
import { MathObject } from 'src/models/math-object/math-object.model';
import { Factory } from 'src/models/services/core/factory.service';
import { Mathable, Solution } from 'src/models/services/math/mathable.model';

@Component({
  selector: 'app-testing-dashboard',
  templateUrl: './testing-dashboard.component.html',
  styleUrls: ['./testing-dashboard.component.scss']
})
export class TestingDashboardComponent implements OnInit, OnDestroy {

  destroyed$ = new Subject();
  tests: Test[] = [];
  mo!: MathObject;
  solution!: Solution;

  form: FormGroup = new FormGroup({
    input: new FormControl('')
  });

  constructor(
    private dataService: TestDataService
  ) { }

  ngOnInit(): void {
    this.dataService.loadData();

    this.dataService.tests$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tests) => this.tests = tests);
  }

  runTest(): void {
    const inputControl = this.form.get('input') as FormControl;
    this.mo = Factory.buildFactor(inputControl.value);
    this.solution = Mathable.simplify(this.mo);
    console.log('solution', this.solution);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }

}
