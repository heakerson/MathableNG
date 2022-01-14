import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestingDashboardComponent } from './testing-dashboard/testing-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: TestingDashboardComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestingRoutingModule { }