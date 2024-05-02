import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
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

  constructor(private categoryS: CategoryService) { }

  ngOnInit(): void {

    this.categoryS.getCategories()
      .subscribe((data:CategoryType[])=>{  
          this.categoryTypes = data ;
          this.activeIndex = -1;  
      }) // получения всех категорий 


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
