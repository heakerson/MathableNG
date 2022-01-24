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
  solution!: Solution | null;
  valid = false;

  form: FormGroup = new FormGroup({
    input: new FormControl('')
  });

  constructor(
    private testDataService: TestDataService
  ) { }

  ngOnInit(): void {
    this.testDataService.loadData();

    this.testDataService.tests$
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

  saveTest(includeSolution: boolean): void {
    const newTest = Test.init({
      input: (this.form.get('input') as FormControl).value,
      solutionString: includeSolution ? this.solution?.toString() : '',
      count: includeSolution ? (this.solution?.changes ? this.solution.changes.length : 0) : 0,
      final: includeSolution ? this.solution?.final.toString() : ''
    });

    this.testDataService.addNewTest(newTest);
  }

  clearSolution(): void {
    this.solution = null;
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
