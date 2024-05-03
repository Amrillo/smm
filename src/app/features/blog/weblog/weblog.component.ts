import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticlesAllType } from 'src/types/articles-all.type';
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
  activeParams: ActiveParamsType | null  = null; 
  articles: ArticlesType[] = [];
  pages: number[] = []; 
  activePage: number = 1 ; 
  constructor(private categoryS: CategoryService, private articlesS: ArticleService, 
    private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {

    this.categoryS.getCategories()
      .subscribe((data:CategoryType[])=>{
          this.categoryTypes = data ;
          this.activeIndex = -1;
      }) // получения всех категорий

      // this.articlesS.getAllArticles()
      //  .subscribe( {
      //     next:  (data:ArticlesAllType)=> {
      //         if(data !== undefined) {
      //           this.articles = data.items;
      //           console.log(data);
      //           this.pages = [];
          
      //           for(let i = 1; i <= data.pages; i++ ){ 
      //             this.pages.push(i); 
      //           }
      //           this.activePage = 1; 
      //         }
      //     },
      //     error: (errorResponse: HttpErrorResponse)=> {
      //        this._snackBar.open(errorResponse.error);
      //     }
      //   }
      //  )
  }

  toggleSorting():void {
    this.sortingOpen = !this.sortingOpen;
    // отритыя выпадающего списка
  }

  toggleActive(index: number, category:CategoryType):void {
        // Check if the clicked index is the same as the currently active index
      if (index === this.activeIndex) {
        // If it is, set the active index to -1 (no item active)
        this.activeIndex = -1;
        console.log("grabbed")
    } else {
        // If it's different, set the active index to the clicked index
        this.activeIndex = index;
       
          this.activeParams?.page = index;
          this.router.navigate(['/blog'], { 
            queryParams:  this.activeParams 
          })
          console.log('yes')
        
       
        console.log(this.activeParams);
    }
  }
    selectPage(page: number):void {  
      this.activePage = page;   
  }

  goToPrev():void {  
    if(this.activePage !== 1) {  
      this.activePage--
    }
  }
    goToNext():void {  
      if(this.activePage !== this.pages.length ) { 
        this.activePage++
      }
    }
}
