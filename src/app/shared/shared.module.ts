import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderCallComponent } from './components/order-call/order-call.component';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  declarations: [
    OrderCallComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class SharedModule { }
