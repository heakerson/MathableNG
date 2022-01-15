import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-testing-dashboard',
  templateUrl: './testing-dashboard.component.html',
  styleUrls: ['./testing-dashboard.component.scss']
})
export class TestingDashboardComponent implements OnInit {

  constructor(
    private ds: DataService
  ) { }

  ngOnInit(): void {
    this.ds.loadData();
  }

}
