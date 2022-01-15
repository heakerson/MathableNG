import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  loadData(): void {
    console.log('LOAD DATA!');
  }
}
