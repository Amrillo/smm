import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { advantagesData } from 'src/app/constants/advantage-data';
import { serviceCards } from 'src/app/constants/service-cards';
import { sliderData } from 'src/app/constants/slider-data';
import { OrderModalService } from 'src/app/shared/services/order-modal.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

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
  }
  serviceCards = serviceCards;
  sliders = sliderData ;
  advantages = advantagesData ;
  constructor(private orderCallService: OrderModalService) { }



    ngOnInit(): void {

    }
    putOrder() {
      this.orderCallService.show();
      this.orderCallService.mainOrder();
    }
}
