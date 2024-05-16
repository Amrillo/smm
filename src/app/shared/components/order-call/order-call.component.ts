import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { OrderModalService } from '../../services/order-modal.service';
import { CategoryService } from '../../services/category.service';
import { CategoryType } from 'src/types/category.type';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestOrderType } from 'src/types/order-request.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'order-call',
  templateUrl: './order-call.component.html',
  styleUrls: ['./order-call.component.scss']
})
export class OrderCallComponent implements OnInit, OnDestroy {


  showOrder:boolean = false;
  showResult: boolean = false;
  orderType: string = "";
  dropdownList: boolean = false ;
  categories : CategoryType[] = [];
  categoryValue: string = '';
  params: RequestOrderType | null = null ;

    orderForm = new FormGroup( {
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        phone: new FormControl(''),
        category: new FormControl(''),
    });

    private ngUnsubscribe = new Subject<void>();

  constructor(private orderCallService : OrderModalService,
    private categoryService: CategoryService, private _snackBar: MatSnackBar ) { }

  ngOnInit(): void {

      this.orderCallService.order$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data:boolean)=> {
          this.showOrder = data ;
      });

      this.orderCallService.string$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data:string)=> {
         this.orderType = data ;
      });
      this.orderCallService.category$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data:string)=> {
         this.categoryValue = data ;
     });

      this.categoryService.getCategories()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: CategoryType[])=>{
          this.categories = data ;
      });
  };

    ngOnDestroy():void {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
    
  closeOrder() {
      this.showOrder = false ;
      this.categoryValue = '';
      this.orderForm.reset();
  };

  closeResult() {
     this.showResult = false;
  };
  showContent() {
    this.dropdownList = !this.dropdownList ;
  };

  selectValue(selectedValue: string) {
      this.categoryValue = selectedValue ;
  }

  @HostListener('document: click', ['$event'])
    click(event:Event) {
       if(!(event.target as HTMLElement).classList.contains('dropdown__btn')) {
          this.dropdownList = false ;
       };
    };

     sendOrder(){
      if(this.orderForm.valid) {

        if(this.orderForm.valid && this.orderForm.value.name && this.orderForm.value.phone && this.orderForm.value.category) {
          this.params = {
            name: this.orderForm.value.name,
            phone: this.orderForm.value.phone ,
            service: this.orderForm.value.category,
            type: this.orderType,
          };
        } else {
          if(this.orderForm.valid && this.orderForm.value.name && this.orderForm.value.phone ) {
              const params: RequestOrderType = {
                name: this.orderForm.value.name,
                phone: this.orderForm.value.phone ,
                type: this.orderType,
              };
          }
        }
        if(this.params) {
          this.orderCallService.sendOrderRequest(this.params)
          .subscribe(
            {
              next:  (data:DefaultResponseType)=> {
                  if(data.error) {
                    this._snackBar.open(data.message);
                    throw new Error(data.message);
                  }
                  this._snackBar.open("Запрос успешно отправлен!");
                  this.closeOrder();
                  this.showResult = true ;
              },
               error: (errorResponse: HttpErrorResponse)=>{
                  if(errorResponse.error && errorResponse.message) {
                      this._snackBar.open(errorResponse.error.message);

                  } else {
                    this._snackBar.open('Произошла ошибка при отправке формы');
                  }
                  this.closeOrder();
               }
            }
           );
        }
      }
    }
}


