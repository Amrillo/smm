import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderCallComponent } from './components/order-call/order-call.component';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PhoneValidatorDirective } from './directives/phone-validator.directive';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AuthAccountComponent } from './components/auth-account/auth-account.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { RouterModule } from '@angular/router';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  declarations: [
    OrderCallComponent,
    PhoneValidatorDirective,
    AuthAccountComponent,
    ArticleCardComponent,
    CommentCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    HttpClientModule,
    RouterModule

  ],
  exports : [OrderCallComponent, PhoneValidatorDirective, AuthAccountComponent, ArticleCardComponent ,CommentCardComponent]
})
export class SharedModule { }
