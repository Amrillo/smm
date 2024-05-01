import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {}

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const tokens = this.authService.getTokens();
        if(tokens && tokens.accessToken) {

           const authReq = req.clone({
            headers: req.headers.set('x-auth', tokens.accessToken)
           })

           return next.handle(authReq).pipe(
              catchError((error)=> {
                 if(error.status === 500 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
                    return this.handle500Error(authReq, next);
                 }
                  return throwError(()=> error);
              })
           )
        }
        return next.handle(req);
   }

    handle500Error(req: HttpRequest<any>, next:HttpHandler) {
       return this.authService.refreshPost()
         .pipe(
           switchMap((result: DefaultResponseType | LoginResponseType)=> {
             let error = '';
              if((result as DefaultResponseType).error !== undefined) {
                 error = (result as DefaultResponseType).message;
              }

              const refreshResult = result as LoginResponseType;
              if(!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
                 error = "Ошибка авторизации"
              }

              if(error) {
                return throwError(()=> new Error(error))
              }

              this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

              const authReq = req.clone( {
                headers:req.headers.set('x-auth',  refreshResult.accessToken)
              });

                return next.handle(authReq)
           }),
            catchError(
               error=> {
                 this.authService.removeTokens();
                 this.authService.userId = null ; 
                 this.router.navigateByUrl('/');
                 return throwError(()=> error)
               }
            )
         )
    }
}
