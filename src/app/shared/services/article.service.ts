import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticleDetailedType } from 'src/types/article-detail.type';
import { ArticlesAllType } from 'src/types/articles-all.type';
import { ArticlesType } from 'src/types/articles.type';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

    getTopArticles(): Observable<ArticlesType[]>{
        return this.http.get<ArticlesType[]>(environment.api + 'articles/top');
    }

    getAllArticles(params: ActiveParamsType): Observable<ArticlesAllType> {
       return this.http.get<ArticlesAllType>(environment.api + 'articles', {
        params: params
       });
    }

    getRelatedArticles(url:string):Observable<ArticlesType[]> {  
       return this.http.get<ArticlesType[]>(environment.api + 'articles/related/' +  url );
    }

    getArticle(url: string):Observable<ArticleDetailedType> {  
        return this.http.get<ArticleDetailedType>(environment.api + 'articles/' +  url);
    }
}
