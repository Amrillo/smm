import { Component, OnInit } from '@angular/core';
import { OrderModalService } from '../../services/order-modal.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  email: string = 'info@itstorm.com';

  constructor(private orderCallService: OrderModalService) { }

  ngOnInit(): void {
  }

  makeOrderCall() {
    this.orderCallService.show();
    this.orderCallService.footerOrder();
  }

}
