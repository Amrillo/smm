import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, switchMap} from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { ArticleDetailedType } from 'src/types/article-detail.type';
import { ArticlesType } from 'src/types/articles.type';
import { CommentsAllType } from 'src/types/comments-all.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

   relatedUrl: string = 'kak_borotsya_s_konkurentsiei_na_frilanse?';
   urlWord: string = '';
   defaultCount: number = 3 ;
   relatedArticles: ArticlesType[] = [];
   articleInfo: ArticleDetailedType | null = null;
   allComments!: CommentsAllType ;
   isLogged: boolean = false ;
    constructor(private articleS: ArticleService, private _snackBar: MatSnackBar,
    private activRoute: ActivatedRoute, private authService: AuthService , private commentsService: CommentsService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.activRoute.params.pipe(
      switchMap((params:Params)=> {
        this.urlWord = params['url'];
        return combineLatest([
          this.articleS.getArticle(this.urlWord),
          this.articleS.getRelatedArticles(this.urlWord)
        ]);
      }),
      switchMap(([article, relatedArticle])=> {
          if(!article || !relatedArticle) {
            this._snackBar.open('Данные не загрузились');
              throw new Error();
          }
          this.articleInfo = article as ArticleDetailedType;
          this.relatedArticles = relatedArticle as ArticlesType[];
          this.isLogged = this.authService.getIsLoggedIn();
          console.log(article);
          console.log(relatedArticle);

          return this.commentsService.getAllComments(this.defaultCount,this.articleInfo.id);
      })

    ).subscribe({
      next:(comments: CommentsAllType | DefaultResponseType)=>{
        if((comments as DefaultResponseType).error !== undefined) {
          this._snackBar.open((comments as DefaultResponseType).message);
          throw new Error();
        }
        this.allComments = comments as CommentsAllType;

      },
      error: (errorResponse:HttpErrorResponse)=> {
        this._snackBar.open("Ошибка при загрузки данных");
        throw new Error(errorResponse.error);
      }
   })
  }

}
