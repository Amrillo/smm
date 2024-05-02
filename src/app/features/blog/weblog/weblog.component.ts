import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ArticlesAllType } from 'src/types/articles-All.type';
import { ArticlesType } from 'src/types/articles.type';
import { CategoryType } from 'src/types/category.type';

@Component({
  selector: 'app-weblog',
  templateUrl: './weblog.component.html',
  styleUrls: ['./weblog.component.scss']
})
export class WeblogComponent implements OnInit {

  sortingOpen: boolean = false;
  activeIndex: number = -1;
  categoryTypes: CategoryType[] = [];
  articles: ArticlesType[] = [];

  constructor(private categoryS: CategoryService, private articlesS: ArticleService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.categoryS.getCategories()
      .subscribe((data:CategoryType[])=>{
          this.categoryTypes = data ;
          this.activeIndex = -1;
      }) // получения всех категорий

      this.articlesS.getAllArticles()
       .subscribe( {
          next:  (data:ArticlesAllType)=> {
              if(data !== undefined) {
                this.articles = data.items;
              }
          },
          error: (errorResponse: HttpErrorResponse)=> {
             this._snackBar.open(errorResponse.error);
          }
        }
       )
  }

  toggleSorting():void {
    this.sortingOpen = !this.sortingOpen;
    // отритыя выпадающего списка
  }

  toggleActive(index: number) {
      // Check if the clicked index is the same as the currently active index
    if (index === this.activeIndex) {
      // If it is, set the active index to -1 (no item active)
      this.activeIndex = -1;
  } else {
      // If it's different, set the active index to the clicked index
      this.activeIndex = index;
  }
  }

}
