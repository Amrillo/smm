import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderModalService {

  public order$ = new Subject<boolean>;
  string$ = new Subject<string>;

  constructor() { }

  mainOrder() {
     this.string$.next('main');
  }

  footerOrder() {
    this.string$.next('footer');
  }
  show() {
      this.order$.next(true);
  };

  hide() {
     this.order$.next(false);
  }

  //  getOrderCall() {
  //     return this.showOrder$ ;
  //  }

}
