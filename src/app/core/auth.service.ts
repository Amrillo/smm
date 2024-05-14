import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';
import { UserInfoType } from 'src/types/user-info.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    public accessTokenKey: string = 'accessToken';
    public refreshTokenKey: string = 'refreshToken';
    public userIdKey: string  = 'userId';
    private isLogged: boolean = false;
    public isLogged$: Subject<boolean> = new Subject<boolean>();
 

  constructor(private http: HttpClient ) {
       this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

    login(email: string , password: string , rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
       return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {email, password, rememberMe})
    }

    signup(name: string,email: string , password: string ): Observable<LoginResponseType | DefaultResponseType> {
       return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'signup', {name, email, password})
    }
    logOut(): Observable<DefaultResponseType> {
      const refreshTokenKey = this.getTokens().refreshToken ;
      if(refreshTokenKey) {
        return this.http.post<DefaultResponseType>(environment.api + 'logout', {refreshToken: refreshTokenKey});
      }

      throw throwError(()=> 'Не получилось найти токен');
   }

   refreshPost():Observable<LoginResponseType | DefaultResponseType> {
        const refreshTokenKey = this.getTokens().refreshToken;
        if(refreshTokenKey) {
          return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'refresh', {refreshToken: refreshTokenKey})
        }
        throw throwError(()=> 'Не получилось найти токен');
   }

    getUserInfo():Observable<UserInfoType | DefaultResponseType> {
        const tokens = this.getTokens();
        let headers ;
        if(tokens && tokens.accessToken) {
          headers = new HttpHeaders({
            'x-auth':  tokens.accessToken,
            'Accept':  'application/json'
          });
        }
        return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users', {headers})
    }

   public setTokens(accessToken:string, refreshToken:string):void {
       localStorage.setItem(this.accessTokenKey,accessToken);
       localStorage.setItem(this.refreshTokenKey,refreshToken);
       this.isLogged = true;
       this.isLogged$.next(true);

  };

    public getTokens():{accessToken: string | null, refreshToken: string | null } {
        return {
          accessToken: localStorage.getItem(this.accessTokenKey),
          refreshToken: localStorage.getItem(this.refreshTokenKey)
        }
    }

    public removeTokens():void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        this.isLogged = false;
        this.isLogged$.next(false);
    }

    public getIsLoggedIn() {
        return this.isLogged;
    }

    set userId(id: string | null){
       if(id){
        localStorage.setItem(this.userIdKey, id);
       } else {
        localStorage.removeItem(this.userIdKey);
       }
    }


    get userId():null | string {
      return localStorage.getItem(this.userIdKey);
    }
}
