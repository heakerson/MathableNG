import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Test } from '@testing/models/test.model';
import { TestDataService } from '@testing/services/test-data.service';
import { Subject, takeUntil } from 'rxjs';
import { MathObject } from 'src/models/math-object/math-object.model';
import { Factory } from 'src/models/services/core/factory.service';
import { Mathable } from 'src/models/services/math/mathable.model';
import { Solution } from 'src/models/services/math/solution/solution.model';

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
  valid = false;

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

    this.form.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(v => this.checkValidity());
  }

  runTest(): void {
    const inputControl = this.form.get('input') as FormControl;
    this.mo = Factory.buildMathObject(inputControl.value);
    this.solution = Mathable.simplify(this.mo);
  }

  checkValidity(): void {
    try {
      const inputControl = this.form.get('input') as FormControl;
      Factory.buildMathObject(inputControl.value);
      this.valid = true;
    } catch {
      this.valid = false;
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }

}
