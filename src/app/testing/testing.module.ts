import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestingDashboardComponent } from './testing-dashboard/testing-dashboard.component';
import { MaterialModule } from '../material/material.module';
import { TestingRoutingModule } from './testing-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    TestingDashboardComponent
  ],
  imports: [
    CommonModule,
    TestingRoutingModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    TestingDashboardComponent
  ]
})
export class TestingModule { }
