import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentType } from 'src/types/comment.type';
import { CommentsService } from '../../services/comments.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CommentActionType } from 'src/types/comment-action.type';
@Component({
  selector: 'comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {


  @Input() comment!: CommentType;
  @Input() articleUrl: string = '';
  @Output() onActionChange: EventEmitter<[string, string]> = new EventEmitter<[string, string]>();
  @Input() activeAction: string | null = null;
  @Input() commentId: string | null = null;
  @Input() commentAction: CommentActionType[] = [];

  constructor(private commentsService: CommentsService, private _snackBar: MatSnackBar
   ) {}

  ngOnInit(): void {
      console.log(this.commentAction);
      const foundComment = this.commentAction.find(item=> item.comment === this.commentId);
      if(foundComment) {
         this.commentId = foundComment.comment;
         this.activeAction = foundComment.action;
      }
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

    // getCommentAction(commentId: string):void {
    //     this.commentsService.getActionComment(commentId)
    //     .subscribe( {
    //       next: (data:CommentActionType | DefaultResponseType)=> {
    //          if((data as DefaultResponseType).error) {
    //            this._snackBar.open((data as DefaultResponseType).message);
    //            throw new Error();
    //          }
    //          console.log(data);
    //          this.commentAction = data as CommentActionType;
    //       },
    //       error: (errorResponse: HttpErrorResponse)=> {
    //          if(errorResponse.error) {
    //             this._snackBar.open('Жалоба отправлена');
    //          } else {
    //           this._snackBar.open('Ошибка при отправки данных')
    //             throw new Error()
    //          }
    //       }
    //     })
    // }

}
