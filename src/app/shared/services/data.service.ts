import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  loadData(): void {
    console.log('LOADING DATA!');
    const key = 'orgvj9dk93';
    const region = 'us-east-2';
    const stage = 'dev';
    const partitionKey = 'partition';
    const sortKey = 'sort';
    const baseUrl = `https://${key}.execute-api.${region}.amazonaws.com/${stage}/getByCompositeKey/${partitionKey}`;
    const params = new HttpParams().set('sortKey', sortKey);
  
    this.http.get(baseUrl, { params }).subscribe(respone => {
      console.log('RESPONSE', respone);
    })
  }
}
