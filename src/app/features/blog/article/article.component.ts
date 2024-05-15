import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {EMPTY, catchError, combineLatest, filter, switchMap, tap} from 'rxjs';
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
   activeAction: string | null= null;
   commentId: string | null= null;
   loading: boolean = false ; 
   defaultCount: number = 3 ;
   count: number = 0;
   isLogged: boolean = false ;
   opened: boolean = false ;
   commentsShow:boolean = false;
   relatedArticles: ArticlesType[] = [];
   articleInfo: ArticleDetailedType | null = null;
   allComments!: CommentType[] ;


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
      switchMap((params: Params) => {
        this.urlWord = params['url'];
        return combineLatest([
          this.articleS.getArticle(this.urlWord),
          this.articleS.getRelatedArticles(this.urlWord)
        ]);
      }),
      tap(([article, relatedArticle]) => {
        if (!article || !relatedArticle) {
          this._snackBar.open('Данные не загрузились');
          throw new Error('Data not loaded');
        }
        this.articleInfo = article as ArticleDetailedType;
        this.relatedArticles = relatedArticle as ArticlesType[];
        this.isLogged = this.authService.getIsLoggedIn();
      }),
      switchMap(() => {
        if(this.articleInfo) {  
          return this.commentsService.getAllComments(this.defaultCount, this.articleInfo.id).pipe(
            catchError((errorResponse: HttpErrorResponse) => {
              this._snackBar.open('Ошибка при загрузке данных');
              throw new Error(errorResponse.error);
            })
          );
        } else {  
          return EMPTY
        }
      })
    ).subscribe(((data: CommentsAllType | DefaultResponseType) => {
        const errorText = data as DefaultResponseType
         if(errorText.error) {  
            this._snackBar.open(errorText.message);
         }
         const comments = data as CommentsAllType; 
        if (comments.comments.length) {
          this.allComments = comments.comments;
          this.opened = true;
        }
      })
    );
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
      if(action && id && this.isLogged) {
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
      this.loading = true;
      setTimeout(()=> {  
         this.loading = false; 
      },500)
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

    shareLink(event: Event):void {
      const vkontakte = 'https://vk.com/share.php?url='
      const facebook = 'https://www.facebook.com/sharer/sharer.php?u='
      const insta = 'https://twitter.com/intent/tweet?url=https://site.ru&text='

     let media = (event.target as HTMLInputElement).getAttribute('data-media');  
    
      if(media === 'vkontakte')  {  
        window.open(vkontakte + this.articleInfo?.url + 'width=626,height=436');
      }
      if(media === 'facebook') {  
        window.open(facebook + this.articleInfo?.url + 'width=626,height=436');
      }
      if(media === 'insta') {  
        window.open(insta + this.articleInfo?.url + 'width=626,height=436');
      }
    
    } 
}