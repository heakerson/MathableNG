import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';
import { HttpClientModule } from  '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    ReactiveFormsModule,
  ],
  providers: [
    DataService
  ]
})
export class SharedModule { }
