import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentsAllType } from 'src/types/comments-all.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

    getAllComments(quantity: number, id: string): Observable<CommentsAllType | DefaultResponseType>{
      let params = new HttpParams()
        .set('offset', quantity)
        .set('article', id)
        return this.http.get<CommentsAllType | DefaultResponseType>(environment.api + 'comments',{params: params});
    }


}
