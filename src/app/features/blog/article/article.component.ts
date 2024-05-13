import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {combineLatest, switchMap} from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { ArticleDetailedType } from 'src/types/article-detail.type';
import { ArticlesType } from 'src/types/articles.type';
import { CommentType } from 'src/types/comment.type';
import { CommentsAllType } from 'src/types/comments-all.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit  {

   relatedUrl: string = 'kak_borotsya_s_konkurentsiei_na_frilanse?';
   urlWord: string = '';
   defaultCount: number = 3 ;
   relatedArticles: ArticlesType[] = [];
   articleInfo: ArticleDetailedType | null = null;
   allComments!: CommentType[] ;
   isLogged: boolean = false ;
   opened: boolean = false ;
   commentsShow:boolean = false;
   count: number = 0;
   activeAction: string | null= null;
   commentId: string | null= null;

    constructor(private articleS: ArticleService, private _snackBar: MatSnackBar,
    private activRoute: ActivatedRoute, private authService: AuthService , private commentsService: CommentsService,
    private router: Router) {}

    commentForm = {
      comment: ''
    }

  ngOnInit(): void {
      this.processMainFunctions();
  }

  processMainFunctions():void {
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
          return this.commentsService.getAllComments(this.defaultCount,this.articleInfo.id);
      })
    ).subscribe({
      next:(data1)=>{
        if((data1 as DefaultResponseType).error !== undefined) {
          this._snackBar.open((data1 as DefaultResponseType).message);
          throw new Error();
        }
        const comments = data1 as CommentsAllType;
        if(comments.comments) {
          this.allComments = comments.comments;
          this.opened = true;
        }
      },
      error: (errorResponse:HttpErrorResponse)=> {
        this._snackBar.open("Ошибка при загрузки данных");
        throw new Error(errorResponse.error);
      }
   })
  }

    postComment():void {
      if(this.commentForm.comment && this.articleInfo &&  this.articleInfo.id) {
          this.commentsService.postComments({text:this.commentForm.comment, article: this.articleInfo.id})
          .subscribe((data:DefaultResponseType)=> {
              console.log(data);
              this.router.navigate(['/articles/', this.articleInfo?.url]);
              this.processMainFunctions();
          })
      }
    }

    updateActions([id, action]:string[]):void {
      if(action && id) {
        this.articleS.getArticle(this.urlWord)
        .pipe(
          switchMap((data: ArticleDetailedType)=> {
            this.articleInfo = data;
            return this.commentsService.getAllComments(this.defaultCount,this.articleInfo.id)
          })
        ).subscribe(
            {
              next: (data:CommentsAllType | DefaultResponseType)=> {
                if((data as DefaultResponseType).error !== undefined) {
                  this._snackBar.open((data as DefaultResponseType).message);
                  throw new Error();
                }
                const data1 = data as CommentsAllType;
                if(data1.comments.length) {
                  this.allComments = data1.comments;
                  this.opened = true;
                }
                },
                error: (errorResponse:HttpErrorResponse)=> {
                    this._snackBar.open("Ошибка при загрузки данных");
                    throw new Error(errorResponse.error);
              }
            }
          )
            if(this.activeAction === action && this.commentId === id) {
               this.activeAction = null;
            }  else  {
                this.activeAction = action;
                this.commentId = id;
            }
      }
    }

    showComments():void {
      if((this.allComments.length > this.count)) {
        if(this.allComments.length < 11) {
          this.opened = false;
        }
         this.count += 10;
         this.allComments.slice(0,this.count);
         this.commentsShow = true;
      } else {
        this.opened = false;
      }
    }
}
