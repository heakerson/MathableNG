import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestingDashboardComponent } from './testing-dashboard/testing-dashboard.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    TestingDashboardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class TestingModule { }
