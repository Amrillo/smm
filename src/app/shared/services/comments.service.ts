import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { environment } from 'src/environments/environment';
import { ActiveActionsType } from 'src/types/active-actions.type';
import { CommentActionType } from 'src/types/comment-action.type';
import { CommentPostType } from 'src/types/comment-post.type';
import { CommentsAllType } from 'src/types/comments-all.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {


    constructor(private http: HttpClient, private authService: AuthService) {
    }


    getAllComments(quantity: number, id: string): Observable<CommentsAllType | DefaultResponseType>{
      let params = new HttpParams()
        .set('offset', quantity)
        .set('article', id);
        return this.http.get<CommentsAllType | DefaultResponseType>(environment.api + 'comments',{params: params});
    }

    postComments(params: CommentPostType):Observable<DefaultResponseType> {
        let headers = new HttpHeaders() ;
        const accessToken =  this.authService.getTokens().accessToken;
        if(accessToken) {
          headers = headers.set('x-auth', accessToken);
        }
        headers = headers.set('Accept', 'application/json');
      return this.http.post<DefaultResponseType>(environment.api + 'comments', params ,{headers : headers});
    }

    postReaction(commentId: string, action: string):Observable<DefaultResponseType> {
      let headers = new HttpHeaders() ;
      const accessToken =  this.authService.getTokens().accessToken;
      if(accessToken) {
        headers = headers.set('x-auth', accessToken);
        headers = headers.set('Accept', 'application/json');
      }

      return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {action: action},{headers : headers});
    }

    getActionComment(id:string):Observable<CommentActionType | DefaultResponseType> {
      let headers = new HttpHeaders() ;
      const accessToken =  this.authService.getTokens().accessToken;
      if(accessToken) {
        headers = headers.set('x-auth', accessToken);
        headers = headers.set('Accept', 'application/json');
      }
    return this.http.get<CommentActionType | DefaultResponseType>(environment.api + 'comments/' + id + '/actions',{headers : headers});
  }
    getActionComments(articleId:string):Observable<CommentActionType[] | DefaultResponseType> {
        let headers = new HttpHeaders() ;
        const accessToken =  this.authService.getTokens().accessToken;
        if(accessToken) {
          headers = headers.set('x-auth', accessToken);
          headers = headers.set('Accept', 'application/json');
        }
        const url = `${environment.api}comments/article-comment-actions?articleId=${articleId}`;
        return this.http.get<CommentActionType[] | DefaultResponseType>(url,{headers : headers});
  }
}
