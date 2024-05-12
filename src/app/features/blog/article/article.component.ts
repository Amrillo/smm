import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, combineLatest, EMPTY, map, Observable, switchMap, VirtualTimeScheduler} from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { ActiveActionsType } from 'src/types/active-actions.type';
import { ArticleDetailedType } from 'src/types/article-detail.type';
import { ArticlesType } from 'src/types/articles.type';
import { CommentActionType } from 'src/types/comment-action.type';
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
   commentsAction: CommentActionType[] = [];
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
      debugger
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
          console.log(article);
          return this.commentsService.getAllComments(this.defaultCount,this.articleInfo.id);
      })

    ).subscribe({
      next:(comments: CommentsAllType | DefaultResponseType)=>{
        if((comments as DefaultResponseType).error !== undefined) {
          this._snackBar.open((comments as DefaultResponseType).message);
          throw new Error();
        }
        const data = comments as CommentsAllType;
        if(data.comments.length) {
          this.allComments = data.comments;
          this.opened = true;
        }
        if(this.articleInfo && this.articleInfo.id) {
          this.getCommentsAction(this.articleInfo.id)
          .subscribe({
            next: (data: CommentActionType[]) => {
              // Handle the comments array here
               this.commentsAction = data ;
               console.log(this.commentsAction)

            },
            error: (error: any) => {
              // Handle errors here
              console.error(error);
            }
          })
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
            if(this.activeAction === action) {
              this.activeAction = null;
              this.commentId = null;
            } else {
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


    getCommentsAction(articleId: string): Observable<CommentActionType[]> {
      return this.commentsService.getActionComments(articleId)
        .pipe(
          catchError((errorResponse: HttpErrorResponse) => {
            if (errorResponse.error) {
              this._snackBar.open('Жалоба отправлена');
            } else {
              this._snackBar.open('Ошибка при отправки данных');
              throw new Error();
            }
            return EMPTY; // Return an empty observable or throw an error as per your requirement
          }),
          map((data: CommentActionType[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).error) {
              this._snackBar.open((data as DefaultResponseType).message);
              throw new Error();
            }
            return data as CommentActionType[];
          })
        );
    }

    // getCommentsAction(articleId: string): CommentActionType[]{
    //   let comments: CommentActionType[] ;

    //   this.commentsService.getActionComments(articleId)
    //   .subscribe({
    //     next: (data:CommentActionType[] | DefaultResponseType)=> {
    //        if((data as DefaultResponseType).error) {
    //          this._snackBar.open((data as DefaultResponseType).message);
    //          throw new Error();
    //        }
    //          comments = data as CommentActionType[];
    //     },
    //     error: (errorResponse: HttpErrorResponse)=> {
    //        if(errorResponse.error) {
    //           this._snackBar.open('Жалоба отправлена');
    //        } else {
    //         this._snackBar.open('Ошибка при отправки данных')
    //           throw new Error()
    //        }
    //     }
    //   });

    //   return comments
    // }
}
