import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '@shared/models/config.model';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly PARTITION_KEY = 'mathable';
  private config = new Config();

  public readonly updatingData$ = new ReplaySubject<boolean>();
  public readonly loadingData$ = new ReplaySubject<boolean>();

  constructor(private http: HttpClient) { }

  public setUpdatingStatus(updating: boolean): void {
    this.updatingData$.next(updating);
  }

  public setLoadingStatus(loading: boolean): void {
    this.loadingData$.next(loading);
  }
}
