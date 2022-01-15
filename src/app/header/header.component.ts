import { Component, OnInit } from '@angular/core';
import { isDevMode } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  devMode = isDevMode();

  constructor() { }

  ngOnInit(): void {
  }

}
