import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ArticlesType } from 'src/types/articles.type';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

   relatedUrl: string = 'kak_borotsya_s_konkurentsiei_na_frilanse?';
   relatedArticles: ArticlesType[] = []; 
  constructor(private articleS: ArticleService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

      this.articleS.getRelatedArticles(this.relatedUrl)
      .subscribe({  
        next: (data:ArticlesType[])=> {  
           if(data === undefined) {  
              this._snackBar.open('Данные не загрузились');
           }
           this.relatedArticles = data; 
        }, 
        error: (errorResponse:HttpErrorResponse)=> {  
            this._snackBar.open(errorResponse.error.message);
            throw new Error(errorResponse.error);
        }
      }

      )

  }

}
