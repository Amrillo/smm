import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentType } from 'src/types/comment.type';
import { CommentsService } from '../../services/comments.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CommentActionType } from 'src/types/comment-action.type';
import { catchError, EMPTY, map, Observable, tap} from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';


@Component({
  selector: 'comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {


  @Input() comment!: CommentType;
  @Input() articleId: string = '';
  @Input() activeAction: string | null = null;
  @Input() commentId: string | null = null;

  @Output() ActionChange: EventEmitter<[string, string]> = new EventEmitter<[string, string]>();

  isViolateSent: boolean = false; 

  constructor(private commentsService: CommentsService, private _snackBar: MatSnackBar, 
    private authService: AuthService
   ) {

   }

  ngOnInit(): void {
     this.getCommentsAction(this.articleId).pipe(
         map((data: CommentActionType[])=>{
           return data.find(item=> item.comment === this.comment.id);
         }), 
         tap((data)=> {  
          if(data) {  
            this.activeAction = data.action;
            this.commentId = data.comment;
           }
         })
     ).subscribe();
  }
  postAction(id:string, action: string):void {
    
    if(this.authService.getIsLoggedIn()) {  

      if(!this.isViolateSent && action !== 'violate') {  
        this.commentsService.postReaction(id,action)
        .subscribe({
          next: (data:DefaultResponseType)=> {
             if(!data.error) {
              console.log(this.activeAction); 
                if(this.activeAction && (action === 'like' || action === 'dislike')){  
                  this._snackBar.open('Ваш голос учтен!');
                  this.ActionChange.emit([id, action]);
                } else if((this.activeAction === null) && (action === 'like' || action === 'dislike')) {  
                  this._snackBar.open('Ваш голос удален!');
                  this.ActionChange.emit([id, action]);
                } else {  
                  this._snackBar.open('Жалоба отправлена!');
                }
             } else {  
               this._snackBar.open(data.message);
             }
          },
          error: (errorResponse: HttpErrorResponse)=> {
             if(errorResponse.error) {
                if(action === 'violate'){  
                    this._snackBar.open('Жалоба уже отправлена');
                    this.isViolateSent = true; 
                } else {  
                  this._snackBar.open(errorResponse.error);
                }
             } else {
              this._snackBar.open('Ошибка при отправки данных');
                throw new Error();
             }
          }
        }
      );} else { 
        this._snackBar.open('Невозможно отправить жалобу');
      }
    } else {  
       this._snackBar.open('Спрева вам нужно пройти авторизацию');
    }
 }

 getCommentsAction(articleId: string): Observable<CommentActionType[]> {
  return this.commentsService.getActionComments(articleId)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.error) {
          throw new Error(errorResponse.message);
        }
        return EMPTY; // Return an empty observable or throw an error as per your requirement
      }),
      map((data: CommentActionType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message);
        }
        return data as CommentActionType[];
      })
    );
  }
}
