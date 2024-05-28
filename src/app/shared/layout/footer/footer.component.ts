import { Component } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { OrderCallComponent } from '../../components/order-call/order-call.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  email: string = 'info@itstorm.com';

  constructor(private dialog: Dialog) { }

  makeOrderCall() {
    const data = {categoryValue: 'SMM',  orderType: 'consultation'};
    this.dialog.open(OrderCallComponent, {data})
  }

}
