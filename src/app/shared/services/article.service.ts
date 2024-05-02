import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArticlesAllType } from 'src/types/articles-All.type';
import { ArticlesType } from 'src/types/articles.type';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

    getTopArticles(): Observable<ArticlesType[]>{
        return this.http.get<ArticlesType[]>(environment.api + 'articles/top');
    }

    getAllArticles(): Observable<ArticlesAllType> {   
       return this.http.get<ArticlesAllType>(environment.api + 'articles');
    }

}
