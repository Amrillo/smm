import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ArticleDetailedType } from 'src/types/article-detail.type';
import { ArticlesType } from 'src/types/articles.type';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

   relatedUrl: string = 'kak_borotsya_s_konkurentsiei_na_frilanse?';
   urlWord: string = '';
   relatedArticles: ArticlesType[] = []; 
   articleInfo: ArticleDetailedType | null = null; 

    constructor(private articleS: ArticleService, private _snackBar: MatSnackBar, 
    private activRoute: ActivatedRoute, ) { }

  ngOnInit(): void {

    this.activRoute.params.pipe(
      switchMap((params:Params)=> {   
        this.urlWord = params['url'];
        return combineLatest([  
          this.articleS.getArticle(this.urlWord),
          this.articleS.getRelatedArticles(this.urlWord)
        ]);
      })
    ).subscribe({  
      next:([article, relatedArticle])=>{  
        if(!relatedArticle || !article) {  
          this._snackBar.open('Данные не загрузились');
          throw new Error();
        }  
        this.articleInfo = article;  
        this.relatedArticles = relatedArticle;
        console.log(article);
        console.log(relatedArticle);
      },
      error: (errorResponse:HttpErrorResponse)=> {  
        this._snackBar.open("Ошибка при загрузки данных");
        throw new Error(errorResponse.error);
      } 
   })
  }
}
