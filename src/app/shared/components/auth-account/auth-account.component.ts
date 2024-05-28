import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input} from '@angular/core';
import { FormBuilder,  Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';

@Component({
  selector: 'auth-account',
  templateUrl: './auth-account.component.html',
  styleUrls: ['./auth-account.component.scss']
})
export class AuthAccountComponent  {

  @Input() registration: string = '';
  private destroy$ = new Subject<void>();

  hide:boolean = true; 


  constructor(private fb: FormBuilder, private router: Router,
     private authService: AuthService, private _snackBar: MatSnackBar) { }

    userForm =  this.fb.group({
    name:  ['', [Validators.required,Validators.pattern(/^[A-ZА-Я][a-zа-я]*/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    rememberMe: [false],
    agree: [false, Validators.required]
});

    passToLogin() {
      this.router.navigate(['/login']);
    }

    passToSignup() {
      this.router.navigate(['/signup']);
    }

    signup() {
      if(this.userForm.valid && this.userForm.value.name && this.userForm.value.email && this.userForm.value.password ) {

        this.authService.signup(this.userForm.value.name, this.userForm.value.email,this.userForm.value.password )
        .pipe(takeUntil(this.destroy$))
           .subscribe( {
             next: (data: DefaultResponseType | LoginResponseType)=> {
               let error = null;
               if((data as DefaultResponseType).error !== undefined) {
                  error = data as DefaultResponseType;
                  this._snackBar.open(error.message);
                  throw new Error();
               }
               const loginResponse = data as LoginResponseType ;
               this.processAuthorization(loginResponse, 'Вы успешно зарегистрировались');
             },
             error: (errorResponse: HttpErrorResponse)=> {
               if(errorResponse.error && errorResponse.error.message) {
                  this._snackBar.open(errorResponse.error.message);
               } else {
                  this._snackBar.open('Ошибка регистрации');
               }
             }
           }
          );
      }
    }

    login() {
        if(this.userForm.value.email && this.userForm.value.password && this.userForm.value.rememberMe) {
            this.authService.login(this.userForm.value.email,this.userForm.value.password,this.userForm.value.rememberMe)
            .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (data: DefaultResponseType | LoginResponseType)=> {
                  let error = null;
                  if((data as DefaultResponseType).error !== undefined) {
                     error = (data as DefaultResponseType).message;
                     this._snackBar.open(error);
                     throw new Error(error);
                  }
                  const loginResponse = data as LoginResponseType ;
                  this.processAuthorization(loginResponse, 'Вы успешно вошли систему');
                },
                error: (errorResponse: HttpErrorResponse)=> {
                  if(errorResponse.error && errorResponse.error.message) {
                     this._snackBar.open(errorResponse.error.message);
                  } else {
                     this._snackBar.open('Ошибка регистрации');
                  }
                }
          }  );
        }
    }
   private processAuthorization(data: LoginResponseType, text: string):void {
        this.authService.setTokens(data.accessToken, data.refreshToken);
        this.authService.userId = data.userId ;
        this._snackBar.open(text);
        this.router.navigate(['/']);
    }

    togglePassword():void {  
        this.hide = !this.hide; 
    }

    
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
