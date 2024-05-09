import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
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

  constructor(private authService : AuthService, private _snackBar: MatSnackBar, private router: Router) {
       this.loggedIn = this.authService.getIsLoggedIn();
       console.log(this.loggedIn)
  }

  ngOnInit(): void {
      if(this.loggedIn) {
        this.authService.getUserInfo()
        .subscribe({
          next: (data: UserInfoType | DefaultResponseType | null)=> {
            let error = null ;
              if((data as DefaultResponseType).error !== undefined) {
                error = (data as DefaultResponseType).message;
                this._snackBar.open(error);
                throw new Error(error);
              }
              this.userName = (data as UserInfoType).name
              console.log(data);
          },
          error: (errorResponse: HttpErrorResponse)=> {
              if(errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message);
              } else {
                this._snackBar.open('Не удалось получить имя пользователя')
          }
        }
      })
    }
    this.authService.isLogged$.subscribe((isloggedIn:boolean)=>{
      this.loggedIn = isloggedIn;
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
      })
  };

   doLogOut():void {
      this.authService.removeTokens();
      this.authService.userId = null ;
      this._snackBar.open('Вы вышли из системы');
      this.router.navigate(['/login'])
   };

}

