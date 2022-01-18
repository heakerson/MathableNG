import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  loadData(): void {
    console.log('LOADING DATA!');
    const key = 'f7tolntfn4';
    const region = 'us-east-2';
    const stage = 'dev';
    const partitionKey = 'partition';
    const sortKey = 'sort';
    const baseUrl = `https://${key}.execute-api.${region}.amazonaws.com/${stage}/getByCompositeKey/${partitionKey}/${sortKey}`;
  
    this.http.get(baseUrl).subscribe(respone => {
      console.log('RESPONSE', respone);
    })
  }
}
