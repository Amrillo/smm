import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {EMPTY, Observable, concatMap } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { UserInfoType } from 'src/types/user-info.type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedIn: boolean = false;
  userName: string = '';
  shown: boolean = false;  
  constructor(private authService : AuthService, private _snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLogged$.pipe(
        concatMap((isloggedIn:boolean):Observable<UserInfoType| DefaultResponseType >=> {  
          this.loggedIn = isloggedIn;
          if(this.loggedIn) {  
            return this.authService.getUserInfo()
          }
          return EMPTY
        })
    ).subscribe({
            next: (data: UserInfoType | DefaultResponseType ):void=> {
              if(data) {  
                let error:any = null ;
                if((data as DefaultResponseType).error !== undefined) {
                  error = (data as DefaultResponseType).message;
                  this._snackBar.open(error);
                  throw new Error(error);
                }
                this.userName = (data as UserInfoType).name;
              }
            },
            error: (errorResponse: HttpErrorResponse):void=> {
                if(errorResponse.error && errorResponse.error.message) {
                  this._snackBar.open(errorResponse.error.message);
                   this.doLogOut();
                } else {
                  this._snackBar.open('Не удалось получить имя пользователя');
                  this.doLogOut();
            }
          }
        });
  }

  logOut():void {
    this.authService.logOut()
      .subscribe({
        next: ()=>{
          this.doLogOut();
        },
        error: ()=> {
          this.doLogOut();
        }
      });
  };

   doLogOut():void {
      this.authService.removeTokens();
      this.authService.userId = null ;
      this._snackBar.open('Вы вышли из системы');
      this.router.navigate(['/login']);
   };

   toogleMenu() {  
     this.shown = !this.shown; 
   }

   shutDownMenu() {  
      this.shown = false; 
   }
}

