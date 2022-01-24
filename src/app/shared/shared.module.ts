import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from  '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { SolutionComponent } from './solution/solution.component';


@NgModule({
  declarations: [
    ErrorModalComponent,
    SolutionComponent
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
