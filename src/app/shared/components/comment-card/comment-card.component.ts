import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentType } from 'src/types/comment.type';
import { CommentsService } from '../../services/comments.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {


  @Input() comment!: CommentType;
  @Input() articleUrl: string = '';
  @Output() onActionChange: EventEmitter<true> = new EventEmitter<true>()

  constructor(private commentsService: CommentsService, private _snackBar: MatSnackBar
   ) { }

  ngOnInit(): void {
  }

  postAction(id:string, action: string):void {  
    this.commentsService.postReaction(id,action)
     .subscribe({  
       next: (data:DefaultResponseType)=> {  
          if(!data.error) {  
            this._snackBar.open('Ваш голос учтен!');
            this.onActionChange.emit(true);
            console.log(this.articleUrl)
          }
       }, 
       error: (errorResponse: HttpErrorResponse)=> {  
          if(errorResponse.error) {  
             this._snackBar.open(errorResponse.message)
          } else {  
           this._snackBar.open('Ошибка при отправки данных')
             throw new Error()
          }
       }
     }
   )   
 }

}
