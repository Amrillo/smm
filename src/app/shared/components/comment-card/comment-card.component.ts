import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentType } from 'src/types/comment.type';
import { CommentsService } from '../../services/comments.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CommentActionType } from 'src/types/comment-action.type';
import { catchError, EMPTY, map, Observable } from 'rxjs';
@Component({
  selector: 'comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {


  @Input() comment!: CommentType;
  @Input() articleId: string = '';
  @Output() onActionChange: EventEmitter<[string, string]> = new EventEmitter<[string, string]>();
  @Input() activeAction: string | null = null;
  @Input() commentId: string | null = null;

  constructor(private commentsService: CommentsService, private _snackBar: MatSnackBar
   ) {}
  ngOnInit(): void {
     this.getCommentsAction(this.articleId).pipe(
         map(data=>{
           return data.find(item=> item.comment === this.comment.id);
         })
     ).subscribe((data)=>{
          if(data) {
            this.activeAction = data.action;
            this.commentId = data.comment;
          }
     })
  }
  postAction(id:string, action: string):void {
    this.commentsService.postReaction(id,action)
     .subscribe({
       next: (data:DefaultResponseType)=> {
          if(!data.error) {
            this._snackBar.open('Ваш голос учтен!');
            this.onActionChange.emit([id, action]);

          }
       },
       error: (errorResponse: HttpErrorResponse)=> {
          if(errorResponse.error) {
             this._snackBar.open('Жалоба отправлена');
          } else {
           this._snackBar.open('Ошибка при отправки данных')
             throw new Error()
          }
       }
     }
   )
 }

 getCommentsAction(articleId: string): Observable<CommentActionType[]> {
  return this.commentsService.getActionComments(articleId)
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.error) {
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
}
