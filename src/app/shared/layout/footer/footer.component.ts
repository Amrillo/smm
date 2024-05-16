import { Component } from '@angular/core';
import { OrderModalService } from '../../services/order-modal.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  email: string = 'info@itstorm.com';

  constructor(private orderCallService: OrderModalService) { }

  
  makeOrderCall() {
    this.orderCallService.show();
    this.orderCallService.footerOrder();
  }

}
