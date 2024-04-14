import { Component, OnInit } from '@angular/core';
import { OrderModalService } from '../../services/order-modal.service';

@Component({
  selector: 'order-call',
  templateUrl: './order-call.component.html',
  styleUrls: ['./order-call.component.scss']
})
export class OrderCallComponent implements OnInit {

  showOrder:boolean = false;
  showResult: boolean = false;
  orderType: string = "";

  constructor(private orderCallService : OrderModalService) { }

  ngOnInit(): void {
      this.orderCallService.order$.subscribe((data:boolean)=> {
          this.showOrder = data ;
          console.log(data);
      });

      this.orderCallService.string$.subscribe((data:string)=> {
        this.orderType = data ;
      })
  }

  closeOrder() {
      this.showOrder = false ;
  }

  closeResult() {
     this.showResult = false;
  }
}
