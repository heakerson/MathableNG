import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  key = 'orgvj9dk93';
  region = 'us-east-2';
  stage = 'dev';
  partitionKey = 'fromApp';

  constructor(private http: HttpClient) { }

  loadData(): void {
    console.log('LOADING DATA!');
    const sortKey = 'sort';
    const baseUrl = `https://${this.key}.execute-api.${this.region}.amazonaws.com/${this.stage}/getByCompositeKey/${this.partitionKey}`;
    const params = new HttpParams().set('sortKey', sortKey);
  
    this.http.get(baseUrl, { params }).subscribe(respone => {
      console.log('RESPONSE', respone);
    });
  }

  createItem(): void {
    const baseUrl = `https://${this.key}.execute-api.${this.region}.amazonaws.com/${this.stage}/create`;

    this.http.post(baseUrl, { partitionKey: this.partitionKey }).subscribe(respone => {
      console.log('CREATED ITEM!', respone);
    });
  }
}
