import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ValidatorHelper {
  public static notEmptyValue(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if ([undefined, null].includes(value) || String(value).trim() === '') {
      return { emptyValue: true };
    }
    return null;
  }
}
