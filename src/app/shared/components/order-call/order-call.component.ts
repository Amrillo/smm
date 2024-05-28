import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { OrderModalService } from '../../services/order-modal.service';
import { CategoryService } from '../../services/category.service';
import { CategoryType } from 'src/types/category.type';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestOrderType } from 'src/types/order-request.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';


@Component({
  selector: 'order-call',
  templateUrl: './order-call.component.html',
  styleUrls: ['./order-call.component.scss']
})
export class OrderCallComponent implements OnInit, OnDestroy {

  showResult: boolean = false;
  showOrder: boolean = true; 
  dropdownList: boolean = false ;
  params: RequestOrderType | null = null ;
  categories : CategoryType[] = [];

    orderForm = new FormGroup( {
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        phone: new FormControl(''),
        category: new FormControl(''),
    });

    private ngUnsubscribe = new Subject<void>();

  constructor(private orderCallService : OrderModalService,
      private categoryService: CategoryService,
     private _snackBar: MatSnackBar,  
     @Inject(DIALOG_DATA) public data: {categoryValue: string , orderType: string},  
     private dialogRef: DialogRef<string> ) { }

  ngOnInit(): void {
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
       this.dialogRef.close();
  };
  closeResult():void {  
    this.dialogRef.close();
  }
  showContent() {
    this.dropdownList = !this.dropdownList ;
  };

  selectValue(selectedValue: string) {
      this.data.categoryValue = selectedValue ;
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
          type: this.data.orderType,
        };
      } else {
        if(this.orderForm.valid && this.orderForm.value.name && this.orderForm.value.phone ) {
            this.params = {
              name: this.orderForm.value.name,
              phone: this.orderForm.value.phone ,
              type: this.data.orderType,
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
                this.showOrder = false
                this.showResult = true;
            },
              error: (errorResponse: HttpErrorResponse)=>{
                if(errorResponse.error && errorResponse.message) {
                    this._snackBar.open(errorResponse.error.message);
                    this.showOrder = false;
                } else {
                  this._snackBar.open('Произошла ошибка при отправке формы');
                }
                this.showOrder = false;
              }
          }
          );
      }
    }
    }
}


