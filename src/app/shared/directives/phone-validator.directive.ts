import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
    selector: '[PhoneValidator]',
    providers: [
      {provide: NG_VALIDATORS, useExisting: PhoneValidatorDirective, multi: true}
    ]
})


export class PhoneValidatorDirective {

  constructor() { }

   validate(control: AbstractControl): ValidationErrors | null {
        const result = /\d/.test(control.value);
        return result? null : {pattern: {value: control.value}};
   }
}
