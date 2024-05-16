import { Component, OnInit } from '@angular/core';
import { OrderModalService } from '../services/order-modal.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  order:string = '';

  constructor(private orderModalService: OrderModalService) {
  }
  ngOnInit(): void {

    this.orderModalService.string$.subscribe((data:string)=> {
           this.order = data ;
    });
  }

}
