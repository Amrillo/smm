
import { HttpParams } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatest, concat, concatMap, map, switchMap, tap} from 'rxjs';
import { ActiveParamsUtil } from 'src/app/shared/services/active-params.util';
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
  selectedCategory: boolean = false;
  appliedFilters: CategoryType[] = [];
  activeIndex: number = -1;
  categoryTypes: CategoryType[] = [];
  activeParams: ActiveParamsType = {category: []};
  articles: ArticlesType[] = [];
  pages: number[] = [];
  activePage: number = 1 ;
  constructor(private categoryS: CategoryService, private articlesS: ArticleService,
    private _snackBar: MatSnackBar, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams
    .pipe(
       map(params=> {
         return ActiveParamsUtil.handleParams(params);
       }),
        tap((activeParams:ActiveParamsType)=> {
          this.activeParams = activeParams;
          this.appliedFilters = [];
          this.pages = [];
          this.activePage = 1;
        }),
        switchMap((activeParams: ActiveParamsType)=>{
          return this.articlesS.getAllArticles(activeParams)
            .pipe(
              tap((data: ArticlesAllType) => {
                this.articles = data.items;
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
            }
          })
        );
      }),
       switchMap(()=> {
          return this.categoryS.getCategories()
          .pipe(
            tap((data:CategoryType[])=>{
              this.categoryTypes = data ;
            })
          );
       })
    )
    .subscribe(()=> {
      if(this.activeParams.category) {
        this.categoryTypes.forEach(category=> {
          if(this.activeParams.category.some(item=> item === category.url)) {
              this.appliedFilters.push(category);
          }
       });
     }
    });
  }

  toggleSorting():void {
    this.sortingOpen = !this.sortingOpen;
      // отритыя выпадающего списка
  }

  sortCategory(categoryUrl:string):void {
    this.activeParams.category = [...this.activeParams.category, categoryUrl];
      const activeParams: ActiveParamsType  = {category:  this.activeParams.category};
      console.log(this.activeParams);
      this.router.navigate(['/blog'], {
      queryParams: activeParams
    });


  }
  removeSorted(categoryUrl:string):void {
    this.activeParams.category = this.activeParams.category.filter(item=> item !== categoryUrl);
     this.router.navigate(['/blog'], {
       queryParams:  this.activeParams
    });
  }

  removeFilter(value:string):void {

      if(this.activeParams.category) {
        this.activeParams.category = this.activeParams.category.filter(item=> item !== value);
        this.router.navigate(['/blog'], {
        queryParams:  this.activeParams
      });
      this.activePage = 1 ;
    }
  }
  isCategoryActive(categoryUrl: string):boolean {
      return this.activeParams.category.some(item=> item === categoryUrl);
  }

  selectPage(page: number):void {
    this.activePage = page;
    this.activeParams.page = page ;
    this.router.navigate(['/blog'], {
       queryParams:  this.activeParams
    });
  }

  goToPrev():void {
    if(this.activePage !== 1) {
      this.activePage--;
      this.activeParams.page = this.activePage;
      this.router.navigate(['/blog'], {
        queryParams:  this.activeParams
     });
    }
  }
    goToNext():void {
      if(this.activePage !== this.pages.length ) {
        this.activePage++;
        this.activeParams.page = this.activePage;
        this.router.navigate(['/blog'], {
          queryParams:  this.activeParams
       });
      }
    }

    @HostListener('document: click', ['$event'])
    click(event:Event) {
       if(!(event.target as HTMLElement).classList.contains('webblog__sorting-head')) {
          this.sortingOpen = false ;
       };
    };
}



