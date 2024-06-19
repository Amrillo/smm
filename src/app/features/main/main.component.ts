import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { advantagesData } from 'src/constants/advantage-data';
import { serviceCards } from 'src/constants/service-cards';
import { sliderData } from 'src/constants/slider-data';
import { OrderModalService } from 'src/app/shared/services/order-modal.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ArticlesType } from 'src/types/articles.type';
import { reviewsData } from 'src/constants/reviews-data';
import { Dialog } from '@angular/cdk/dialog';
import { OrderCallComponent } from 'src/app/shared/components/order-call/order-call.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    email: string = 'info@itstorm.com' ;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    // nav: true
  };

  customOptionsReview: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    margin:10,
    responsive: {
      220: {
        items: 1
      },

      820: {
        items: 2
      },
      1200: {
        items: 3
      }
    },
    // nav: true
  };
  serviceCards = serviceCards;
  sliders = sliderData ;
  advantages = advantagesData ;
  reviews = reviewsData ;

  topArticles: ArticlesType[] = [];

  constructor(private articleService : ArticleService ,
    private dialog: Dialog
   ) { }

    ngOnInit(): void {
        this.articleService.getTopArticles()
          .subscribe((data: ArticlesType[])=> {
            this.topArticles = data ;
            console.log(data);
        });
    }

    putOrder(category: string) {
      const data = {categoryValue: category, orderType: 'order'};
      this.dialog.open(OrderCallComponent, {data})

    }

}
