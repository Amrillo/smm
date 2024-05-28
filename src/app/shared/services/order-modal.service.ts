import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { RequestOrderType } from 'src/types/order-request.type';

@Injectable({
  providedIn: 'root'
})
export class OrderModalService {

  public order$ = new Subject<boolean>;
  string$ = new Subject<string>;
  category$ =  new Subject<string>;
  category : string = "" ;

  constructor(private http: HttpClient) { }

  mainOrder() {
     this.string$.next('order');
  }
  setCategory(category: string) {
     this.category = category ;
  }

  footerOrder() {
    this.string$.next('consultation');
  }
  show() {
      this.order$.next(true);
      this.category$.next(this.category);
  };

  hide() {
     this.order$.next(false);
  }

    sendOrderRequest(params: RequestOrderType):Observable<DefaultResponseType> {
      return this.http.post<DefaultResponseType>(environment.api + 'requests', params);

    }
}
