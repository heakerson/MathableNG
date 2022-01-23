import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestingDashboardComponent } from './testing-dashboard/testing-dashboard.component';
import { MaterialModule } from '../material/material.module';
import { TestingRoutingModule } from './testing-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TestDataService } from './services/test-data.service';
import { TestsTableComponent } from './tests-table/tests-table.component';
import { SolutionComponent } from './solution/solution.component';



@NgModule({
  declarations: [
    TestingDashboardComponent,
    TestsTableComponent,
    SolutionComponent
  ],
  imports: [
    CommonModule,
    TestingRoutingModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    TestingDashboardComponent
  ],
  providers: [
    TestDataService
  ]
})
export class TestingModule { }
