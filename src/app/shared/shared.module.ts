import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderCallComponent } from './components/order-call/order-call.component';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PhoneValidatorDirective } from './directives/phone-validator.directive';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AuthAccountComponent } from './components/auth-account/auth-account.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';

@NgModule({
  declarations: [
    OrderCallComponent,
    PhoneValidatorDirective,
    AuthAccountComponent,
    ArticleCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  exports : [OrderCallComponent, PhoneValidatorDirective, AuthAccountComponent, ArticleCardComponent ]
})
export class SharedModule { }
