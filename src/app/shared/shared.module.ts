import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from  '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { SolutionComponent } from './solution/solution.component';
import { MathObjectComponent } from './math-object/math-object.component';


@NgModule({
  declarations: [
    ErrorModalComponent,
    SolutionComponent,
    MathObjectComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    ReactiveFormsModule,
    SolutionComponent
  ]
})
export class SharedModule { }
